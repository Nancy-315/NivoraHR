# NivoraHR – Your Intelligent HR & MBA Assistant 🎓💼

NivoraHR is a modern, high-speed AI assistant designed specifically for MBA HR students, researchers, management professionals, and interns. It provides deep, structured, and exam-calibrated academic guidance across Human Resource Management, HR Analytics, Indian Labour Laws, Research Methodologies, and Viva-Voce preparation.

---

## 🌟 Key Features

* **⚡ Ultra-Fast Streaming:** Real-time token streaming using Server-Sent Events (SSE) directly from Google Gemini API.
* **🎯 Powered by Gemini 3.8 Flash:** Configured for the official `gemini-3.8-flash` model with configurable override support (`GEMINI_MODEL`).
* **🔓 Truly Public & Open Access:** Zero login, signup, subscription, or message counters required.
* **🧠 Context-Aware Conversation Memory:** Understands multi-turn follow-up questions (e.g. *"Explain recruitment"* → *"Give me an example"* → *"Give me 5 viva questions"*).
* **📚 Academic & Exam Marks Calibration:** Answers can be calibrated specifically to requested marks (2 Marks, 5 Marks, 10 Marks, 15 Marks).
* **🌐 Multilingual Support:** Fluent in English, Tamil, and Tanglish (e.g. *"Recruitment na enna?"*).
* **🔒 Enterprise-Grade Key Security:** `GEMINI_API_KEY` is strictly executed on the server/API route and is never exposed to the client or browser bundle.
* **📱 Responsive & Clean UI:** Thoughtfully designed for both mobile and desktop with auto-expanding input, copy response, and instant retry.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Serverless Node.js Runtime)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **UI & Styling:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
* **AI Engine:** Google Gemini API (`gemini-3.8-flash`)

---

## 📁 Project Architecture

```
NivoraHR/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Secure server-side streaming API route
│   ├── globals.css            # Custom typography, scrollbars & prose styling
│   ├── layout.tsx             # Root layout and metadata
│   └── page.tsx               # Main reactive chat client & streaming state
├── components/
│   ├── ChatInput.tsx          # Dynamic auto-resizing input with keyboard shortcuts
│   ├── ChatMessage.tsx        # Message bubble with Markdown, copy & retry
│   ├── Header.tsx             # Brand header with Live indicator & New Chat
│   └── WelcomeScreen.tsx      # Hero screen with suggested MBA HR prompts
├── lib/
│   └── gemini.ts              # Gemini system prompt, formatting & model config
├── types/
│   └── chat.ts                # TypeScript interfaces for messages and payload
├── public/                    # Static assets
├── .env.example               # Environment variable template
├── .gitignore                     # Git ignore rules for secrets and builds
├── next.config.mjs                # Next.js build configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS plugins
├── tailwind.config.js             # Tailwind design system configuration
├── tsconfig.json                  # TypeScript compiler settings
└── README.md                      # Documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Clone or Enter Project
```bash
cd NivoraHR
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a local `.env.local` file by copying `.env.example`:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```
*(Get a key from [Google AI Studio](https://aistudio.google.com/))*

### 5. Run the Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel (Step-by-Step)

### Step 1: Push Code to GitHub
1. Initialize git in the project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of NivoraHR AI Assistant"
   ```
2. Create a new repository on GitHub (e.g. `NivoraHR`).
3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/NivoraHR.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** > **"Project"**.
3. Select your **NivoraHR** GitHub repository and click **Import**.

### Step 3: Configure Environment Variables
In the **Environment Variables** section before deploying:
* **Key:** `GEMINI_API_KEY`
  * **Value:** `[Your Google Gemini API Key]`
  * **Environments:** Production, Preview, Development
* **Key:** `GEMINI_MODEL`
  * **Value:** `gemini-3.8-flash`
  * **Environments:** Production, Preview, Development

### Step 4: Deploy
Click **Deploy**. Vercel will build the Next.js application in ~45 seconds and provide your live permanent URL (e.g., `https://nivora-hr.vercel.app`).

---

## 🔒 Security & Privacy

* **Strict Server-Side Isolation:** The Gemini API key is processed exclusively inside Next.js serverless functions (`/api/chat`).
* **Zero Public Variables:** No client-side public environment keys exist in this repository.
* **No Database Storage:** Conversation history remains solely in the client's current session memory, preserving student privacy.

---

## 📄 License
This project is open-source and intended for academic and educational guidance.
