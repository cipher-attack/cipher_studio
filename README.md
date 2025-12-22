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

I built **Cipher Studio** because I got tired of standard AI wrappers that just "chat." I needed a proper digital workstation where the AI actually helps with the heavy lifting. This platform is designed for developers and security researchers who need functional tools in one place.

The UI is built with a **Cyber/Hacker aesthetic**—it’s dark, clean, and gets straight to the point. Under the hood, it uses Google’s Gemini 1.5 and 2.0 Pro models, but I’ve tweaked the system instructions to make it much more useful for Red Team operations and technical auditing.

## Modules

The app is split into **6 specialized modules** so you don't have to keep re-prompting the AI for different tasks:

1.  **Cipher Chat (Core)**
    * The main interface. Supports pinned messages, audio I/O, and image analysis.
    * It’s context-aware and knows the current date/time, so no more outdated "knowledge cutoff" excuses.

2.  **Cyber House (Red Team Ops)**
    * This is for the security folks. It has built-in **Offline JS Tools** (Base64, Hex Dump, URL Encode) so you don't have to leave the app. 
    * The AI persona here is tuned to help with payload generation, log analysis, and code auditing without the usual "I can't help with that" roadblocks.

3.  **Code Lab**
    * For quick UI prototyping. It generates HTML/CSS/JS and renders a live preview instantly.

4.  **Vision Hub**
    * Computer vision tools focused on data extraction. Supports `OCR`, `Code Extraction` from screenshots, and a `Threat Detect` feature to scan for phishing indicators in UI designs.

5.  **Data Analyst**
    * Toss in raw text or CSV data, and it uses **Chart.js** to build interactive visualizations on the fly.

6.  **Prompt Studio**
    * A tool to fix bad prompts. It takes a simple sentence and expands it into a detailed "Mega-Prompt" using chain-of-thought logic.

## Tech Stack

* **Frontend:** React (TypeScript) + Vite
* **Styling:** Tailwind CSS (Glassmorphism & 3D effects)
* **AI Engine:** Google Gemini API SDK (`@google/genai`)
* **Icons:** Lucide React

## Deployment & Setup

This is a production-ready React app. I've included a polyfill for the `process` variable to prevent crashes on Vercel or Netlify.

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
    * Push to Vercel/Netlify. 
    * You can either set your `VITE_API_KEY` in the dashboard or enter it manually in the app sidebar for better security.

4.  **Running on Mobile (Termux)**
    * If you're on Termux, make sure `nodejs` and `git` are installed. Run `npm run dev` and access the local server through your browser at `localhost:3000`.

## 👤 About the Developer

I'm **Biruk Getachew** (aka **Cipher Attack**).

I am a Cyber Security Specialist and Web Designer based in Ethiopia. I’m interested in the intersection of high-end aesthetics and functional security tools.

---
*Built for the builders. Break things to fix them.*
