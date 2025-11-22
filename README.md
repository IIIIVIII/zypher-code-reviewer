# 🐛 Bug Hunt Agent

> AI-Powered Debugging System built with **Zypher Agent Framework** + **Claude Sonnet 4.5**

![Bug Hunt Agent](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet%204.5-blueviolet)
![Deno](https://img.shields.io/badge/Runtime-Deno-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

A sophisticated bug detection and fixing system that leverages AI to analyze code, identify bugs, and generate fixes automatically.

## ✨ Features

- 🔍 **Intelligent Bug Detection** - AI-powered analysis to find bugs, security vulnerabilities, and code issues
- 🛠️ **Automatic Fix Generation** - Complete fixed code with all issues resolved
- 📊 **Interactive Dashboard** - Matrix-style hacker UI with real-time progress
- 📁 **Multi-file Support** - Upload and analyze multiple code files
- 🎯 **Structured Results** - Bugs categorized by severity with detailed explanations

## 🖼️ Screenshots

### Bug Hunt Interface
![UI Screenshot](./screenshots/ui.png)

### Results View
![Results Screenshot](./screenshots/results.png)

## 🚀 Quick Start

### Prerequisites

- [Deno](https://deno.land/) v1.40+
- [Anthropic API Key](https://console.anthropic.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/MingfanX/zypher-code-reviewer.git
cd zypher-code-reviewer

# Set up environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run the application
deno task dev
```

### Usage

1. Open http://localhost:8080 in your browser
2. Upload code files or paste code directly
3. Describe the bug you're experiencing
4. Click "INITIATE BUG HUNT"
5. View detected bugs and fixed code

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Bug Hunt Agent                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌────────┐ │
│  │   Web UI    │───▶│  HTTP Server │───▶│ Agent  │ │
│  │  (Matrix)   │◀───│    (SSE)     │◀───│(Claude)│ │
│  └─────────────┘    └──────────────┘    └────────┘ │
│                                                      │
│  Features:                                           │
│  • Real-time streaming progress                      │
│  • Structured bug reports                            │
│  • Complete code fixes                               │
│  • Multi-language support                            │
└─────────────────────────────────────────────────────┘
```

## 📂 Project Structure

```
zypher-code-reviewer/
├── src/
│   ├── agent.ts      # Zypher Agent with Claude integration
│   └── server.ts     # HTTP server with SSE support
├── static/
│   └── index.html    # Matrix-style hacker UI
├── examples/         # Sample buggy code files
│   ├── buggy-server.js
│   ├── buggy_flask_api.py
│   ├── BuggyUserProfile.jsx
│   ├── buggy-auth-service.ts
│   └── buggy-utils.js
├── main.ts           # Application entry point
├── deno.json         # Deno configuration
└── README.md
```

## 🎯 Example Files

The `examples/` directory contains sample buggy code for testing:

| File | Language | Bugs | Description |
|------|----------|------|-------------|
| `buggy-server.js` | Node.js | 9 | Express API with security issues |
| `buggy_flask_api.py` | Python | 10 | Flask API with SQL injection |
| `BuggyUserProfile.jsx` | React | 10 | Component with memory leaks |
| `buggy-auth-service.ts` | TypeScript | 13 | Auth service vulnerabilities |
| `buggy-utils.js` | JavaScript | 10 | Common JS bugs |

## 🔧 Configuration

### Environment Variables

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

### Deno Tasks

```bash
deno task dev      # Run in development mode with watch
deno task start    # Run in production mode
deno task setup    # Interactive setup wizard
```

## 🛡️ Supported Languages

- JavaScript / TypeScript
- Python
- Java
- Go
- Rust
- C / C++
- PHP
- Ruby
- Swift
- Kotlin

## 📝 API Reference

### POST /api/hunt

Start a bug hunt session.

**Request:**
```
Content-Type: multipart/form-data

description: string (required) - Bug description
files: JSON[] (optional) - Array of {name, content} objects
```

**Response:**
```json
{
  "sessionId": "uuid",
  "status": "started"
}
```

### GET /api/stream/:sessionId

SSE endpoint for real-time progress updates.

**Events:**
- `log` - Progress messages
- `result` - Final analysis results
- `error` - Error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👨‍💻 Author

**Mingfan Xie**

- GitHub: [@MingfanX](https://github.com/IIIIVIII)

---

Built with ❤️ using [Zypher Agent Framework](https://github.com/MingfanX/zypher-code-reviewer) + [Claude Sonnet 4.5](https://anthropic.com)
