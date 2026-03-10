# Blog Cover Image CLI 🎨

A modern, AI-powered CLI tool designed to automatically generate high-converting, minimalist blog cover images and thumbnails using **Gemini 3.1 Flash Image Preview**. 

It handles everything from fetching company logos to pixel-perfect typography integration, all from your terminal or directly via an AI Agent using the included OpenCode Skill.

![Banner](https://img.shields.io/badge/AI-Gemini%203.1-blue)
![Format](https://img.shields.io/badge/Format-16:9-success)
![Platform](https://img.shields.io/badge/Platform-Node.js-green)

---

## Features
- **Full AI Generation**: Uses `gemini-3.1-flash-image-preview` to generate the entire image.
- **Smart Logo Fetching**: Pass a domain (like `vercel.com`) and the CLI automatically fetches the logo using `logos.hunter.io`, normalizes it to PNG via `sharp`, and injects it into the AI context.
- **Aesthetic Control**: Bundled with `examples/` that automatically guide the model to produce clean, white-background, heavy-typography styles.
- **Google Search Grounding**: The image generation is hooked into Google Search to pull real-time data if your title involves current events.
- **Agent Ready**: Includes an OpenCode `SKILL.md` so your favorite AI agents can use this CLI autonomously.

---

## Installation

You can install this globally via npm:

```bash
npm install -g blog-cover-image-cli
```

*(Note: Ensure you are using Node.js v18+)*

---

## Configuration

The CLI securely stores your API key on your local machine using the `conf` package so you don't have to export it every time.

```bash
# Set your Gemini API Key
blog-cover-cli config set-key <YOUR_GEMINI_API_KEY>

# Check your key (masked)
blog-cover-cli config get-key

# Delete your key
blog-cover-cli config delete-key
```

*If you run the generate command without a key, a secure, interactive prompt will ask you for it.*

---

## Usage

Generate a 16:9 cover image by providing a title and a domain name for the logo.

```bash
blog-cover-cli generate -t "How Claude 3.7 is Redefining AI" -l "anthropic.com"
```

### Options

| Flag | Full Name | Description | Required | Default |
|---|---|---|---|---|
| `-t` | `--title` | The exact text to render on the cover | **Yes** | |
| `-l` | `--logo` | The domain to fetch the logo from (e.g. `google.com`) | No | |
| `-o` | `--output` | The output path for the PNG file | No | `./output/<auto-name>.png` |

If you omit the `--output` flag, the CLI automatically creates an `output/` directory in your current path and names the file intelligently based on the logo domain or title (e.g., `output/anthropic-cover.png`).

---

## For AI Agents (OpenCode Skill)

This package includes a structured OpenCode skill! Agents can install this package and read the instructions in `agent-skill/blog-cover-generator/SKILL.md` to learn how to generate cover images for users autonomously. 

**Workflow for Agents:**
1. Execute `npx -p blog-cover-image-cli blog-cover-cli config set-key $KEY`
2. Execute `npx -p blog-cover-image-cli blog-cover-cli generate -t "Title" -l "domain.com"`
3. Return the generated image to the user.

---

## How it works under the hood
1. **Logo Fetcher**: Hits `logos.hunter.io`, parses SVGs/AVIFs, and converts to strict PNGs.
2. **Context Assembly**: Loads aesthetic examples from the `./examples` folder to ground the style.
3. **Multimodal Prompting**: Assembles the exact text instructions, the visual examples, and the fetched logo into a single unified payload.
4. **Google GenAI SDK**: Sends the payload with `tools: [{ googleSearch: {} }]` to the Imagen 3 endpoint.