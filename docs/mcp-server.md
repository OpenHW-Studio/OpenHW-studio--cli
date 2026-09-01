# OpenHW Studio MCP Server Guide

The **OpenHW Studio Model Context Protocol (MCP) Server** exposes circuit design, project manipulation, physics-based circuit safety validation, and headless electronics simulation directly to AI coding assistants and autonomous agents.

---

## 1. Running the MCP Server

The MCP server runs over **standard input/output (stdio)**.

```bash
cd OpenHW-studio--cli
npm run mcp
```

### Options & Flags

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--backend-url <url>` | `string` | `http://localhost:5001/api` | Base URL of the OpenHW backend compilation server. |
| `--auth-token <token>` | `string` | *(none)* | Optional token gate required for all tool invocations. |

---

## 2. Client Configurations

### A. Antigravity IDE (`~/.gemini/config/mcp_config.json` or `.agents/mcp_config.json`)

```json
{
  "mcpServers": {
    "openhw-studio": {
      "command": "npm",
      "args": ["--prefix", "/home/danish1075/Documents/simulator/OpenHW-studio--cli", "run", "mcp"]
    }
  }
}
```

### B. Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "openhw-studio": {
      "command": "node",
      "args": [
        "--experimental-loader",
        "/home/danish1075/Documents/simulator/OpenHW-studio--cli/scripts/raw-loader.js",
        "/home/danish1075/Documents/simulator/OpenHW-studio--cli/node_modules/tsx/dist/cli.mjs",
        "/home/danish1075/Documents/simulator/OpenHW-studio--cli/src/cli.ts",
        "mcp",
        "serve"
      ]
    }
  }
}
```

### C. Cursor / VS Code MCP Extension

```json
{
  "name": "openhw-studio",
  "command": "npm",
  "args": ["--prefix", "/path/to/OpenHW-studio--cli", "run", "mcp"]
}
```

---

## 3. Tool Reference (17 Tools)

### Project Lifecycle Tools

#### 1. `project_init`
Creates a new OpenHW canonical project and sets it as the active session.
- **Parameters**:
  - `name` (*string, required*): Project name.
  - `board` (*string, required*): Target board (`wokwi-arduino-uno`, `wokwi-raspberry-pi-pico`, `wokwi-esp32`, `arduino_uno`, `rp2040`, etc.).
  - `file` (*string, optional*): Destination JSON file path.
  - `token` (*string, optional*): Auth token if required.
- **Returns**: `{ ok: true, action: "project_init", file: string, summary: ProjectSummary }`

#### 2. `project_open`
Loads an existing project JSON file and sets it as the active session.
- **Parameters**:
  - `file` (*string, required*): Path to the project JSON file.
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "project_open", file: string, summary: ProjectSummary }`

#### 3. `project_status`
Returns the status, component count, wiring count, and active files of the current session.
- **Parameters**:
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "project_status", file: string, project: ProjectSummary }`

#### 4. `project_validate`
Performs structural schema, board reference, and endpoint validation on the active project.
- **Parameters**:
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "project_validate", file: string, valid: boolean, issues: Issue[] }`

---

### Circuit Design & Safety Tools

#### 5. `circuit_validate`
Runs physics-based circuit safety rules (LED without current-limiting resistor, short circuits, floating pins, reverse polarity, voltage mismatches).
- **Parameters**:
  - `token` (*string, optional*): Auth token.
  - `auto_fix` (*boolean, optional*): Automatically apply non-destructive circuit fixes.
- **Returns**: `{ ok: true, action: "circuit_validate", valid: boolean, errors: CircuitIssue[], warnings: CircuitIssue[], fixesApplied: string[] }`

#### 6. `component_catalog`
Lists all known emulator component types, pinouts, categories, and telemetry affordances.
- **Parameters**:
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "component_catalog", count: number, components: ComponentInfo[] }`

#### 7. `component_add`
Adds a new component to the active project circuit.
- **Parameters**:
  - `type` (*string, required*): Component type (e.g. `openhw-led`, `wokwi-led`, `openhw-servo`, `wokwi-pushbutton`).
  - `id` (*string, optional*): Unique component identifier.
  - `x` (*number, optional*): X coordinate on canvas.
  - `y` (*number, optional*): Y coordinate on canvas.
  - `label` (*string, optional*): Custom display label.
  - `attrs` (*object, optional*): Component attributes (e.g. `{ color: "blue" }`).
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "component_add", component: ComponentEntry }`

#### 8. `wire_add`
Connects two component/board pins in the active project.
- **Parameters**:
  - `from` (*string, required*): Source endpoint in `componentId:pinName` format (e.g. `board1:13`).
  - `to` (*string, required*): Destination endpoint in `componentId:pinName` format (e.g. `led1:A`).
  - `color` (*string, optional*): Wire hex color (e.g. `#e74c3c`).
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "wire_add", wire: WireEntry }`

#### 9. `wiring_validate`
Dry-run endpoint and pin compatibility validation without mutating the project.
- **Parameters**:
  - `wires` (*array, required*): List of proposed wires `[{ from: "board1:13", to: "led1:A" }]`.
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "wiring_validate", valid: boolean, issues: Issue[] }`

---

### Interactive & Sensor Affordances

#### 10. `component_input_schema`
Returns all interaction event templates (sliders, buttons, rotary, sensor values) for components in the active project.
- **Parameters**:
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "component_input_schema", components: ComponentInputSchema[] }`

#### 11. `component_interact`
Injects an interaction event (e.g. button press, slider value, sensor reading) into a component.
- **Parameters**:
  - `component_id` (*string, required*): ID of the component.
  - `event` (*string, required*): Event type (e.g. `input`, `SET_ATTR`, `press`, `release`).
  - `key` (*string, optional*): Attribute key.
  - `value` (*any, optional*): Attribute value.
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "component_interact", telemetry: object }`

#### 12. `simulation_capabilities`
Describes the observability, serial output, pin monitoring, and interaction capabilities of the active project.
- **Parameters**:
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "simulation_capabilities", capabilities: ProjectCapabilities }`

---

### Simulation & Observability Tools

#### 13. `sim_execute`
Runs the simulation for a given duration and returns telemetry, pin states, serial logs, and trace events.
- **Parameters**:
  - `ms` (*number, optional, default: 1000*): Simulation duration in milliseconds.
  - `include_telemetry` (*boolean, optional*): Include component state telemetry.
  - `include_trace` (*boolean, optional*): Include event timeline.
  - `include_console` (*boolean, optional*): Capture simulation stdout/stderr.
  - `include_state` (*boolean, optional*): Include full component states.
  - `include_serial_text` (*boolean, optional*): Return plain-text UART output.
  - `board_id` (*string, optional*): Specific board to execute.
  - `all_boards` (*boolean, optional*): Run multi-board routing.
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "sim_execute", result: SimulationResult }`

#### 14. `sim_trace`
Captures a bounded timeline of runtime events (pin toggles, serial writes, state changes, faults).
- **Parameters**:
  - `ms` (*number, optional*): Duration to trace.
  - `event_types` (*string[], optional*): Filter event types (`['state', 'serial', 'fault', 'debug']`).
  - `component_id` (*string, optional*): Filter by component.
  - `max_events` (*number, optional, max: 5000*): Event limit.
- **Returns**: `{ ok: true, action: "sim_trace", trace: TraceReport }`

#### 15. `sim_inspect`
Inspects focused diagnostics, electrical states, and telemetry for one component or the entire project.
- **Parameters**:
  - `component_id` (*string, optional*): Specific component ID to inspect.
  - `duration_ms` (*number, optional*): Duration to run before inspection.
  - `token` (*string, optional*): Auth token.
- **Returns**: `{ ok: true, action: "sim_inspect", inspection: InspectionReport }`

#### 16. `simulation_step`
Executes deterministic stepping through simulation time with scheduled timed events.
- **Parameters**:
  - `steps` (*number, required*): Number of steps or intervals to advance.
  - `step_ms` (*number, optional*): Milliseconds per step.
  - `events` (*array, optional*): Timed interaction events to inject during steps.
- **Returns**: `{ ok: true, action: "simulation_step", stepResult: StepReport }`

#### 17. `simulation_assert`
Runs a simulation and checks test assertions against telemetry, display outputs, or pin values.
- **Parameters**:
  - `ms` (*number, required*): Run duration.
  - `assertions` (*array, required*): List of assertions to test (e.g. `{ component: "led1", path: "state.illuminated", equals: true }`).
- **Returns**: `{ ok: true, action: "simulation_assert", passed: boolean, failures: AssertionFailure[] }`
