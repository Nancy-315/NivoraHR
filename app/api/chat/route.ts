// src/app/api/chat/route.ts - NivoraHR Serverless Streaming Route
import { NextRequest, NextResponse } from 'next/server';
import { NIVORA_SYSTEM_PROMPT, getGeminiModel, formatConversation } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { messages } = body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required.' },
        { status: 400 }
      );
    }

    const rawKey = process.env.GEMINI_API_KEY;
    const geminiKey = rawKey ? rawKey.trim() : null;

    if (!geminiKey) {
      console.error('[NivoraHR Auth Error] GEMINI_API_KEY is not configured on the server. (Key present: false)');
      return NextResponse.json(
        { error: 'NivoraHR is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const model = getGeminiModel();
    console.log(`[NivoraHR Request] Model: ${model} | API Key present: true | Turns: ${messages.length}`);

    const contents = formatConversation(messages);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(geminiKey)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: NIVORA_SYSTEM_PROMPT }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
        }
      })
    });

    clearTimeout(timeoutId);

    if (!geminiResponse.ok) {
      const status = geminiResponse.status;
      const errorText = await geminiResponse.text().catch(() => '');
      let parsedError: { error?: { message?: string; status?: string } } = {};
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // Raw text
      }

      const errorMessage = parsedError?.error?.message || errorText;
      console.error(`[NivoraHR Gemini Error] Status: ${status} | Model: ${model} | Detail:`, errorMessage);

      if (status === 429) {
        return NextResponse.json(
          {
            error: 'NivoraHR is temporarily busy. Please try again in a moment.',
            debug: errorMessage
          },
          { status: 429 }
        );
      }

      if (status === 404) {
        return NextResponse.json(
          { error: 'NivoraHR is temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      if (status === 401 || status === 403) {
        return NextResponse.json(
          { error: 'NivoraHR is temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: 'Something went wrong. Please try again.',
          debug: { status, detail: errorMessage }
        },
        { status: 500 }
      );
    }

    // Stream Google Gemini SSE responses progressively to the client
    const upstreamBody = geminiResponse.body;
    if (!upstreamBody) {
      return NextResponse.json(
        { error: 'Unable to stream response from AI provider.' },
        { status: 502 }
      );
    }

    const reader = upstreamBody.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    let buffer = '';

    const stream = new ReadableStream({
      async pull(streamController) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              streamController.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;

              const jsonStr = trimmed.slice(5).trim();
              if (!jsonStr || jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const textPart = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textPart) {
                  // Forward plain text chunk directly to browser stream
                  streamController.enqueue(encoder.encode(textPart));
                }
              } catch {
                // Ignore parse errors on malformed chunks
              }
            }
          }
        } catch (streamErr: unknown) {
          console.error('[NivoraHR Stream Reading Error]', streamErr);
          streamController.error(streamErr);
        }
      },
      cancel() {
        reader.cancel().catch(() => {});
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[NivoraHR Route Exception]', error?.message || err);

    if (error?.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Connection problem. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again.',
        debugException: error?.message || String(err)
      },
      { status: 500 }
    );
  }
}
