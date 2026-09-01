# OpenHW Studio CLI Command Reference

The `openhw` CLI provides a comprehensive command-line interface for project file management, circuit authoring, headless electronics simulation, serial monitoring, and library management.

---

## 1. Global Options

| Option | Description |
| :--- | :--- |
| `-V, --version` | Output current CLI version. |
| `--backend-url <url>` | Backend compiler API URL (default: `http://localhost:5001/api`). |
| `-h, --help` | Display command help. |

---

## 2. `project` Commands

Commands for creating, inspecting, modifying, and exporting OpenHW canonical JSON project files.

```bash
# Initialize a new project
openhw project init <file> --name <name> --board <board>

# Inspect available component types from manifests
openhw project component-types

# Add a component to the project
openhw project add-component <file> --type <type> [--id <id>] [--x <x>] [--y <y>] [--label <label>] [--attrs-file <json-file>]

# Connect two endpoints with a wire
openhw project connect <file> --from <comp:pin> --to <comp:pin> [--color <hex>]

# Set firmware code for a board
openhw project set-code <file> --board-id <id> [--code <code> | --code-file <path>]

# Configure block coding / Blockly XML
openhw project set-blockly <file> --xml-file <path> --generated-code-file <path> [--use-blockly-code true]
openhw project block-summary <file>

# Update library requirements (libraries.txt)
openhw project set-library-file <file> --input <libs.txt>

# Validate project structure and references
openhw project validate <file>

# Print high-level project summary
openhw project summary <file>

# Convert legacy format or export canonical JSON
openhw project import-json <input> -o <output>
openhw project import-png <input.png> -o <output>
openhw project export-json <file> [-o <output>]
```

---

## 3. `sim` Commands

Commands for headless execution, telemetry monitoring, event injection, and trace capture.

```bash
# Run simulation until Ctrl+C
openhw sim run <file> [--debug text|json]

# Run simulation for fixed duration (ms)
openhw sim run <file> --duration-ms 5000 [--board-id <id> | --all-boards]

# Capture component behavior telemetry report
openhw sim telemetry <file> --duration-ms 2500 [--json]

# Capture bounded event trace timeline
openhw sim trace <file> --duration-ms 3000 --event-types state,serial,fault --include-state

# Inspect a single component in detail
openhw sim inspect <file> --component-id <id> --duration-ms 2000

# Inject an interactive event (buttons, sliders, sensors)
openhw sim interact <file> --component-id <id> --event <type> [--key <key>] [--value <val>]

# Check inter-board UART and SoftwareSerial routing
openhw sim check-routes <file> [--json]

# Export SVG circuit snapshot (static or after runtime elapsed)
openhw sim screenshot <file> --duration-ms 0 --output out/static.svg
openhw sim screenshot <file> --duration-ms 1500 --output out/runtime.svg

# Probe component with diffed before/after state
openhw sim probe <file> --component-id <id> --event <type> --assertions-file <yaml>

# Normalized display buffer capture
openhw sim display <file> --duration-ms 1500 --output out/display.json

# Execute multi-step scenario manifest
openhw sim scenario <file> --scenario <scenario.yaml> --output out/report.json

# Print simulation-focused summary
openhw sim summary <file>
```

---

## 4. `serial` Commands

Commands for hardware serial ports and simulated UART communication.

```bash
# List available hardware serial ports
openhw serial ports [--json]

# Monitor a physical hardware serial port
openhw serial monitor --port <port> --baud <baud>

# Monitor simulated serial port (pipes stdin directly into simulation RX)
openhw serial sim-monitor <file> --duration-ms 10000
```

---

## 5. `lib` Commands

Commands for querying and installing Arduino / Python libraries via the backend API.

```bash
# List installed/cached libraries
openhw lib list

# Search library registry
openhw lib search <query>

# Install a library
openhw lib install "<library-name>"

# Uninstall a library
openhw lib uninstall "<library-name>"

# Sync project libraries from libraries.txt
openhw lib sync-project <project.json> [--dry-run]
```

---

## 6. `mcp` Command

Starts the local Model Context Protocol server over standard input/output.

```bash
# Run stdio MCP server
openhw mcp serve

# Run with token gate
openhw mcp serve --auth-token <secret-token>
```

---

## 7. `repl` Command

Starts an interactive terminal shell for running OpenHW CLI commands interactively.

```bash
openhw repl
```
