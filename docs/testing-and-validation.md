# OpenHW Studio CLI & MCP Testing Guide

This guide details the test suites, deterministic scenario runners, and verification scripts available in the CLI project.

---

## 1. Quick Test Commands

| Test Suite | Command | Purpose |
| :--- | :--- | :--- |
| **Typecheck** | `npm run typecheck` | Validates TypeScript types across the CLI codebase. |
| **MCP Contracts** | `npm run test:mcp:contracts` | Validates MCP tool input/output schema contracts and error handling. |
| **MCP Smoke Test** | `npm run test:mcp:smoke` | Boots MCP server over stdio, tests tool listing, and initializes projects. |
| **Block Coding CLI** | `npm run test:cli:block-coding` | Validates Blockly XML importing, code generation, and project summary. |
| **LED Lifecycle** | `npm run test:mcp:scenario` | Dry-run lifecycle scenario on Raspberry Pi Pico with LED. |
| **Display Observability** | `npm run test:mcp:scenario:display` | Validates OLED display state capture and buffer diffs. |
| **Sensor Observability** | `npm run test:mcp:scenario:sensor` | Validates LDR and potentiometer interaction event traces. |

---

## 2. Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `MCP_SMOKE_REQUIRE_SIM` | `1` | Set to `0` to skip live backend firmware compilation in smoke tests. |
| `MCP_SMOKE_BACKEND_URL` | `http://127.0.0.1:5001/api` | Backend API URL used during MCP smoke tests. |
| `MCP_TEST_BACKEND_URL` | `http://127.0.0.1:5001/api` | Backend API URL used for contract and component matrix tests. |
| `OPENHW_MCP_TOKEN` | *(none)* | Auth token passed during tests if authentication is enabled. |

---

## 3. Scenario Runner (`mcp-scenario-runner.mjs`)

The scenario runner executes deterministic, multi-step simulation scenarios from YAML or JSON manifests.

### Running a Scenario

```bash
# Dry-run validation (manifest parse + wiring diagnostics + report export)
node scripts/mcp-scenario-runner.mjs --scenario scenarios/pico-led-lifecycle.yaml --dry-run

# Full runtime scenario execution
node scripts/mcp-scenario-runner.mjs --scenario scenarios/pico-led-lifecycle.yaml

# Export custom JSON and Markdown reports with baseline diffing
node scripts/mcp-scenario-runner.mjs \
  --scenario scenarios/pico-led-lifecycle.yaml \
  --output-json temp/scenario-report.json \
  --output-md temp/scenario-report.md \
  --baseline temp/baseline.json
```

### Scenario Manifest Format Example (`scenarios/pico-led-lifecycle.yaml`)

```yaml
name: pico-led-lifecycle
board: wokwi-raspberry-pi-pico
components:
  - type: wokwi-led
    id: led1
    x: 240
    y: 140
    attrs:
      color: green
wires:
  - from: board1:GP15
    to: led1:A
  - from: board1:GND.1
    to: led1:C
steps:
  - at_ms: 100
    action: assert
    component: led1
    path: state.illuminated
    equals: true
  - at_ms: 500
    action: interact
    component: led1
    event: SET_ATTR
    key: brightness
    value: 0.5
```

---

## 4. Component Matrix Testing

Test all individual components against Arduino Uno and Raspberry Pi Pico:

```bash
# Test UNO component matrix
npm run test:mcp:uno-components-individual

# Test Pico component matrix
npm run test:mcp:pico-components-individual

# Test all Pico components combined
npm run test:mcp:pico-all-components
```
