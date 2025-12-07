
<div align="center">
  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCI+PHBhdGggZD0iTSA3NSAyNSBMIDM1IDI1IEwgMTUgNTAgTCAzNSA3NSBMIDc1IDc1IiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiAvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNTAiIHI9IjEwIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iNiIgLz48cGF0aCBkPSJNIDUwIDUwIEwgODUgNTAiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+PHBhdGggZD0iTSA2OCA1MCBMIDY4IDYyIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPjxwYXRoIGQ9Ik0gNzggNTAgTCA3OCA1OCIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz48L3N2Zz4=" alt="Cipher Logo" />
  
  <h1 style="font-size: 3rem; margin-top: -10px;">CIPHER <span style="font-weight: 300;">STUDIO</span></h1>

  <p><strong>"Red Teaming the Metaverse."</strong></p>

  <a href="https://x.com/Cipher_attacks"><img src="https://img.shields.io/badge/X-Twitter-black?style=for-the-badge&logo=x" alt="Twitter"/></a>
  <a href="https://www.youtube.com/@cipher-attack"><img src="https://img.shields.io/badge/YouTube-Subscribe-red?style=for-the-badge&logo=youtube" alt="YouTube"/></a>
  <a href="https://github.com/cipher-attack"><img src="https://img.shields.io/badge/GitHub-Repo-gray?style=for-the-badge&logo=github" alt="GitHub"/></a>
  <a href="https://et.linkedin.com/in/cipher-attack-93582433b"><img src="https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn"/></a>
</div>

<br />

Welcome to **Cipher Studio**. I built this platform because I needed a workspace that didn't just "chat" but actually *worked* alongside me. This isn't just another AI wrapper; it's a dedicated digital workstation for developers, security researchers, and creative minds.

I designed this with a **Cyber/Hacker aesthetic** in mind—clean, dark, and functional. It leverages Google's Gemini 2.5 Flash and Pro models, but I've uncapped the potential to make it a true "Red Team" assistant.

## 🚀 Features

I've broken the app down into **6 Specialized Modules**, so you don't have to keep prompting the AI to change its behavior:

1.  **💬 Cipher Chat (Core)**
    *   The main interface. It supports pinning messages, audio input/output, and image analysis.
    *   *Specialty:* It knows the **Real-Time Date & Time** (no more "As of my last update in 2023...").

2.  **🛡️ Cyber House (Red Team Ops)**
    *   My favorite module. It includes **Real Offline JS Tools** (Base64, Hex Dump, URL Encode) built right into the UI.
    *   The AI persona here is set to "Unrestricted" mode for generating payloads, auditing code, and analyzing logs without constant ethical refusals (for educational/testing purposes).

3.  **💻 Code Lab**
    *   Generates HTML/CSS/JS artifacts and renders them **instantly** in a split-screen preview.
    *   Great for prototyping UI components in seconds.

4.  **👁️ Vision Hub**
    *   Dedicated computer vision tools.
    *   Features: `OCR Extraction`, `Code Extraction` (from screenshots), and `Threat Detect` (analyzing images for phishing indicators).

5.  **📊 Data Analyst**
    *   Paste raw text or CSV data, and it builds interactive **Chart.js** visualizations automatically.

6.  **✨ Prompt Studio**
    *   A tool to refine your prompt engineering skills. It takes a basic idea and expands it into a "Mega-Prompt" using chain-of-thought reasoning.

## 🛠️ Tech Stack

Built with the tools I love:
*   **Frontend:** React (TypeScript) + Vite
*   **Styling:** Tailwind CSS (Custom "Glassmorphism" & 3D effects)
*   **AI Engine:** Google Gemini API (`@google/genai` SDK)
*   **Icons:** Lucide React

## 🌍 Deployment (Vercel / Netlify)

This app is **Production Ready**. It includes a polyfill for the `process` variable, so it won't crash on client-side hosting platforms.

1.  **Clone the repo**
    ```bash
    git clone https://github.com/cipher-attack/cipher_studio.git
    cd cipher-studio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Deploy**
    *   Just push to Vercel or Netlify.
    *   **Note:** You can enter your Gemini API Key directly in the app sidebar (recommended for security), OR set it as an Environment Variable `VITE_API_KEY` in your hosting dashboard.

4.  **Run locally**
    ```bash
    npm start
    ```

## 👤 About the Developer

I'm **Biruk Getachew** (aka **Cipher Attack**).

I am a Cyber Security Specialist and Web Designer based in Ethiopia. I love blending high-end aesthetics with functional security tools.

---
*Built for the builders. Break things to fix them.*
