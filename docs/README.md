# OpenHW Studio CLI & MCP Server Documentation

Welcome to the documentation for **OpenHW Studio CLI** and its integrated **Model Context Protocol (MCP) Server**.

---

## 📚 Documentation Index

| Guide | Description |
| :--- | :--- |
| [**MCP Server Guide & Tool Reference**](./mcp-server.md) | Full specification of all 17 MCP tools, schemas, client setup (Antigravity, Claude, Cursor, VSCode), and usage examples. |
| [**CLI Command Reference**](./cli-reference.md) | Complete reference for all CLI commands (`project`, `sim`, `serial`, `lib`, `repl`, `mcp`), flags, and file formats. |
| [**Testing & Validation Guide**](./testing-and-validation.md) | Runbook for contract tests, smoke tests, deterministic scenario suites, and component matrices. |

---

## 🚀 Quickstart

### 1. Installation

From the CLI folder:
```bash
cd OpenHW-studio--cli
npm install
```

### 2. Verify Setup

Run the full verification suite to ensure everything is operating cleanly:
```bash
npm run typecheck
npm run test:mcp:contracts
npm run test:mcp:scenario
```

### 3. Run the CLI

```bash
# View all available CLI commands
npm run cli -- --help

# Create a new Arduino Uno project
npm run cli -- project init temp/demo.json --name "Blink LED" --board arduino_uno

# Add an LED and connect it
npm run cli -- project add-component temp/demo.json --type wokwi-led --id led1 --x 240 --y 140
npm run cli -- project connect temp/demo.json --from board1:13 --to led1:A
npm run cli -- project connect temp/demo.json --from board1:GND --to led1:C

# Inspect project status and validate circuit
npm run cli -- project summary temp/demo.json
npm run cli -- project validate temp/demo.json
```

### 4. Run the MCP Server (stdio)

```bash
npm run mcp
```

To configure with an optional authorization token:
```bash
npm run mcp -- --auth-token local-dev-token
```
