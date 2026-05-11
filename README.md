# SwimChrono

Authoring tool for embedded visualizations on top of swimming-race videos. Pick a race, select data fields, attach visualizations to lanes or screen corners, edit each element's style, and define triggers (manually or via the
built-in AI assistant) that decide when each layer appears.
This tool is part of the contribution of the paper [Diving Deep into Time: Temporal Arrangements for Embedded Visualization in Swimming Videos](https://doi.org/10.1109/TVCG.2026.3689361) on TVCG.

## Local Deployment

1. Install `node.js` and `yarn`.

2. Install node_modules for front end:
   ```bash
   yarn
   ```

3. Run the system front end at the project root `./`:
   ```bash
   yarn run dev
   ```

4. The system is usually served on [http://localhost:5173/swimchrono/](http://localhost:5173/swimchrono/).

To build the project, run:
```bash
yarn run build
```
The built files are in `./dist`.

## Configure the AI Assistant (optional)

The TriggerDrawer's "AI Interpret" button calls a chat-completion API to
turn natural-language descriptions into trigger configs. **No API key
ships with this repository — you must supply your own.**

1. Copy `.env.example` to `.env` (gitignored — never committed):
   ```bash
   cp .env.example .env
   ```
2. Fill in `VITE_AI_API_KEY` and, if needed, `VITE_AI_BASE_URL` /
   `VITE_AI_MODEL`. Without a key the AI button shows a warning instead
   of dispatching a request.
3. Restart `yarn run dev` so Vite picks up the new env vars.

### Provider compatibility

The client uses the [`openai`](https://www.npmjs.com/package/openai) SDK
with a configurable `baseURL`, so any **OpenAI-compatible** chat-completion
endpoint works without code changes:

| Provider | `VITE_AI_BASE_URL` | Example `VITE_AI_MODEL` | Works out of the box |
|---|---|---|---|
| DeepSeek | `https://api.deepseek.com` | `deepseek-chat` | Yes |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | Yes |
| Together AI | `https://api.together.xyz/v1` | `mistralai/Mixtral-8x7B-Instruct-v0.1` | Yes |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.1-70b-versatile` | Yes |
| Anthropic Claude | n/a — Messages API is not OpenAI-shaped | `claude-3-5-sonnet-latest` | **Needs adapter** (add `@anthropic-ai/sdk` and a small wrapper in `src/utils/aiConfig.ts`) |
| Google Gemini | n/a — uses its own protocol | `gemini-1.5-pro` | **Needs adapter** (add `@google/generative-ai` and a wrapper) |

> Keys placed in `.env` are bundled into the front-end and visible to any
> page visitor. Use a key scoped to client-side usage and rotate it
> regularly. For production, proxy the request through a backend you
> control instead of shipping the key.

## Tests

Component regression tests run with [Vitest](https://vitest.dev/) +
`@testing-library/react` + `jsdom`.

```bash
yarn test         # run once
yarn test:watch   # watch mode
```

The test setup lives in `vitest.config.ts` and `src/test/`. Tests sit
next to the components they cover, named `index.test.tsx`.

## Project Layout

```
public/
├── configuration/   # exportable layer-config JSON examples (olympic, pacman, acc, …)
├── csv/             # per-race frame data (one row per swimmer per frame)
├── video/           # compressed mp4s referenced from videoMetaDataList
├── img/             # icons used by the visualization picker
├── font/            # OlympicStyle font for badge text
└── labelTool/       # backing data for the label tool's existing-data fetch

src/
├── pages/           # route entries (Home, LabelTool, Visualization)
├── components/
│   ├── Header/                 # video selection, import/export, examples
│   ├── VideoPanel/VisHolder/   # SVG layers driven by frame data:
│   │   ├── VisAlongLane/       # per-lane visualizations
│   │   └── VisGlobal/          # screen-corner / global visualizations
│   ├── LayerPanel/             # Konva timeline, layer list, TriggerDrawer + AIChat
│   ├── ControllerPanel/        # data / vis / position / element editors
│   ├── VideoLabel/             # labelling tool (vis / event / camera shot)
│   └── ResultVisualization/    # cross-race statistics gantt
├── store/           # MobX root store
├── tool/            # CanvasSelect (rect / polygon / point / line / circle annotator)
├── types/           # shared types + zod schema for imported configurations
├── utils/           # values, prompts, flag SVGs, helpers
└── test/            # vitest setup + shared fixtures
```

## Editing-element contract

Each visualization advertises an editable element list in
`utils/values.tsx → editableElementInVisConfig`. The `ControllerPanel`
exposes editors based on the element's `type` (`text` / `shape` / `icon` /
`color`); the matching component reads those styles back through
`editableElementList` and applies `visible` / `x` / `y` / `fontSize` /
`fontFillColor` / `shapeFillColor` / `shapeStrokeColor` / `shapeStrokeWidth`
/ `iconSize` to its rendered SVG. Regression tests in
`src/components/.../*.test.tsx` pin this contract.

## License

MIT — see [LICENSE](./LICENSE).
