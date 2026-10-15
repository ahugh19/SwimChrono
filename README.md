# SwimChrono

This is a repository for original codes of an authoring tool, *SwimChrono*, provided in the paper ["Diving Deep into Time: Temporal Arrangements for Embedded Visualization in Swimming Videos"](https://doi.org/10.1109/TVCG.2026.3689361) ([preprint on HAL](https://hal.science/hal-05612503)), published at [IEEE Transactions on Visualization and Computer Graphics](https://www.computer.org/csdl/journal/tg).
*SwimChrono* lets users author embedded visualizations on top of swimming-race videos: pick a race, select data fields, attach visualizations to lanes or screen corners, edit each element's style, and define triggers (by hand, from the review-based recommendations, or via the optional AI assistant) that decide when each layer appears. Designs can be saved as JSON and exported as a PNG snapshot or as a video with the visualizations rendered in. The repository also hosts the labeling tools and the result charts of the systematic review behind the paper. An online interactive version can be accessed at https://aviz.gitlabpages.inria.fr/swimchrono/ or https://ahugh19.github.io/SwimChrono/.

See also [*SwimFlow*](https://aviz.gitlabpages.inria.fr/vis-in-motion-swimflow/), our related tool for embedded visualizations in swimming videos.

![SwimChrono authoring interface with the Olympic Style example loaded](./docs/img/tool-screenshot.jpg)

## Pages

* [Authoring tool](https://ahugh19.github.io/SwimChrono/) — compose embedded visualizations on a race video, set their triggers on the timeline, and export the design, a snapshot or a video.
* [Visualization labeling](https://ahugh19.github.io/SwimChrono/label-vis) — the tool used in the systematic review to mark the embedded visualizations of broadcast videos: bounding box, data, placement, movement and animation.
* [Event labeling](https://ahugh19.github.io/SwimChrono/label-event) — marks race events (start, turns, finish) as intervals or points.
* [Camera-shot labeling](https://ahugh19.github.io/SwimChrono/label-camera) — marks camera shots and how they connect.
* [Labeling results](https://ahugh19.github.io/SwimChrono/visualization) — the 1544 review annotations as gantt charts, one video at a time or all at once, linked to the player and a filterable table.

All pages are reachable from the Pages menu in every header. The label tools run without a backend, so edits last only for the session.

## Paper version

The code used for the paper is tagged [`v1.0.0`](https://github.com/ahugh19/SwimChrono/releases/tag/v1.0.0)
(May–Aug 2026). To get exactly that state:

```bash
git checkout v1.0.0
```

Later releases (see [Changelog](#changelog)) improve loading, architecture and UI beyond what the paper
describes; the shipped examples still reproduce Figures 4–6 on the latest version.

## Documentation & Materials

* [Replicating paper results](./docs/replicating-paper-results.md) — clear instructions to reproduce Figures 4–6 from the paper with the shipped examples.
* [Adding a new video](./docs/adding-a-video.md) — step-by-step instructions, a copy/paste metadata template, and notes on the data-processing pipeline.
* [The speed-climbing case](./docs/climbing-case.md) — an experimental demonstration that the approach generalizes beyond swimming.
* [Supplementary materials on OSF](https://osf.io/t82cw/overview) — materials accompanying the paper.

If you use *SwimChrono* and our results on **temporal arrangements for embedded visualization** in new projects or use it in a different way, we would appreciate a citation:

* Junxiu Tang, Lijie Yao, Lu Ying, Romain Vuillemot, Petra Isenberg. Diving Deep Into Time: Temporal Arrangements for Embedded Visualization in Swimming Videos. IEEE Transactions on Visualization and Computer Graphics, 32(7):6825–6841, 2026. doi: [10.1109/TVCG.2026.3689361](https://doi.org/10.1109/TVCG.2026.3689361). [Preprint on HAL](https://hal.science/hal-05612503).

    ```
    @ARTICLE{11501810,
        author={Tang, Junxiu and Yao, Lijie and Ying, Lu and Vuillemot, Romain and Isenberg, Petra},
        journal={IEEE Transactions on Visualization and Computer Graphics},
        title={Diving Deep Into Time: Temporal Arrangements for Embedded Visualization in Swimming Videos},
        year={2026},
        volume={32},
        number={7},
        pages={6825-6841},
        doi={10.1109/TVCG.2026.3689361}}
    ```

## Local Deployment

1. Install necessary tools like `node.js` and `yarn`.

2. Install node_modules for front end:
   ```bash
   yarn
   ```

3. Run the system front end at the project root `./`:
   ```bash
   yarn run dev
   ```

4. The system is usually served on [http://localhost:5173/SwimChrono/](http://localhost:5173/SwimChrono/).

To build the project, run:
```bash
yarn run build
```
The built files are in `./dist`.

### Hosting the large assets elsewhere (optional)

The race videos (`public/video/`, ~135 MB) and frame CSVs (`public/csv/`, ~48 MB)
are served from `public/` by default. To serve them from a CDN or object
storage instead, set `VITE_ASSET_BASE_URL` in `.env` (see `.env.example`);
every `video/…`, `csv/…`, `configuration/…` and `labelTool/…` path is then
resolved against that base. New mp4s should be remuxed with
`-movflags +faststart` so playback can start before the whole file is
downloaded (see [Adding a new video](./docs/adding-a-video.md)).

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

The test setup lives in `vitest.config.ts` and `src/test/`. Component tests
sit next to the components they cover (`index.test.tsx`); the pure modules
in `src/utils/` and the layout / tokenizer helpers have `*.test.ts` files
beside them (trigger intervals, CSV parsing, configuration import, race
info, timecodes, recommendations, gantt layout, svg serialization).

## Project Layout

```
public/
├── configuration/   # exportable layer-config JSON examples (olympic, pacman, acc, climb)
├── csv/             # per-race frame data (one row per swimmer per frame)
├── video/           # compressed, faststart mp4s referenced from videoMetaDataList
├── img/             # icons used by the visualization picker
├── font/            # OlympicStyle font for badge text (also embedded in exports)
└── labelTool/       # review annotations (result-vis25.json) and the derived
                     # trigger-recommendations.json (yarn build:recommendations)

scripts/
└── buildTriggerRecommendations.mjs   # aggregates the review annotations

src/
├── pages/           # route entries (Home = authoring tool, LabelTool, Visualization)
├── components/
│   ├── Header/                 # authoring header: video / example pickers,
│   │   ├── ImportMenu/         #   upload + JSON-format dialog
│   │   ├── ExportMenu/         #   configuration / snapshot / video export dialog
│   │   └── AboutModal/         #   paper reference and page links
│   ├── PageHeader/             # slim header of the label tools and result charts
│   ├── HeaderActions/          # Pages menu, GitHub, About, help tour (every header)
│   ├── AppNav/, Brand/         # page list + navigation, logo and version badge
│   ├── ResizeHandle/           # draggable gutters between panels
│   ├── CodeEditor/             # highlighted svg editor, json viewer, xml/json tokenizers
│   ├── VideoPanel/             # player, loading overlay, click-to-select overlay
│   │   └── VisHolder/          # SVG layers driven by frame data:
│   │       ├── visRegistry.ts  #   visName -> component map (add new vis here)
│   │       ├── builtInGlyphs.ts#   default svg of glyphs that can be replaced
│   │       ├── CustomGlyph.tsx #   renders a user svg in place of a glyph
│   │       ├── OverlaySvg.tsx  #   pure overlay used by the exports
│   │       ├── VisAlongLane/   #   per-lane visualizations
│   │       └── VisGlobal/      #   screen-corner / global visualizations
│   ├── LayerPanel/             # Konva timeline (ruler, bars, handles, legend),
│   │                           # layer list, TriggerDrawer + AIChat
│   ├── ControllerPanel/        # data / vis / position / element / svg-icon editors
│   ├── VideoLabel/             # labeling tools (vis / event / camera shot)
│   └── ResultVisualization/    # review results: player, annotations, gantt chart
│       └── ganttLayout.ts      #   pure layout of the gantt rows
├── store/           # MobX root store (layers, frame data, intervals)
├── tool/            # CanvasSelect (rect / polygon / point / line / circle annotator)
├── types/           # shared types + zod schema for imported configurations
├── utils/
│   ├── values.tsx            # constants, visualization catalog, editable elements
│   ├── index.tsx             # trigger interval computation, helpers
│   ├── raceInfo.ts           # race name / record label / event label from metadata
│   ├── triggerRecommendation.ts # recommendations from the review summary
│   ├── timecode.ts           # mm:ss:ff parsing and formatting
│   ├── assets.ts             # VITE_ASSET_BASE_URL resolution
│   ├── frameData.ts          # CSV download with progress + parsing
│   ├── feedback.ts           # theme-aware antd message wrapper
│   ├── theme.tsx             # dark / light palettes and antd tokens
│   └── export/               # overlay compositing, png snapshot, mp4 / webm video
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

To add a visualization: create its component under `VisHolder/VisAlongLane/`
or `VisHolder/VisGlobal/`, register it in `VisHolder/visRegistry.ts`, add a
`VALUE_…` name, a catalog entry and its editable elements in
`utils/values.tsx`. If it draws a glyph that users may replace, add its
default svg to `VisHolder/builtInGlyphs.ts` and render `CustomGlyph` when
`customizedIcon.svgContent` is set.

## Changelog

### 1.6.0

Export with the visualizations rendered in
* The header's Export menu offers, besides the configuration JSON, a PNG snapshot of the current frame and a video of a chosen time range with the visualizations rendered in. MP4 (H.264) is encoded in the browser with WebCodecs where available (Chrome, Edge, Safari 16.4+), otherwise a WebM is recorded in real time. Resolution and frame rate are selectable; the overlay is rendered exactly as in the editor, with the badge font embedded. No audio.

* The export dialog shows the number of frames and an estimated duration, explains that smaller sizes and lower frame rates are faster, notes that the start time defaults to the race start from the data, and reminds you to keep the tab in the foreground since browsers throttle timers in background tabs.
* Start and end are entered as timecodes (mm:ss:ff at the source frame rate, plain seconds also accepted) with a "use player time" shortcut; the file name is editable; a running export shows the frames done and the estimated time left.
* Import and Export are menus with a chevron; the Export menu keeps a fixed width.
* The default global blur of the embedded visualizations is 0.2 (was 0.5).
* Timeline: loading a video zooms the ruler so the race start sits at the left edge; the zoom survives resizing the panels; clicking the tick row of the ruler seeks like the label row; the right edge of a bar reaching the end of the video is no longer clipped; a "Legend" popover explains the bar colors (green initiation trigger, purple conclusion trigger from race data, gray conclusion trigger from a fixed duration), hand-edited bars, handles and the pre-start shading.
* A "Fit race" button next to the zoom slider fits the race to the timeline (with a small gap before the race start); the header's Import/Export group is labeled "File".
* Import is a menu too: upload a configuration, or open "About the JSON format", a dialog with a highlighted example and a field reference of the configuration file. Exported JSON is pretty-printed. Importing keeps hand-edited intervals instead of recomputing them.

### 1.5.0

Visualizations driven by the video metadata
* The race-name corner reads gender, distance, stroke and round from the video's metadata instead of a fixed string; lane count, pool length and lap length come from the metadata too (27 components, climbing unchanged).
* New "Event logo" corner (data: race name): the Olympic rings for an Olympic race, otherwise the competition name and year. The Olympic Style example uses it in place of the hand-made rings icon. The record corner reads "OR" at the Olympics and "CR" elsewhere.
* Built-in glyphs can be replaced by a custom svg: the event logo, Pac-Man, the ranking arrows, the climbing icon, the dive arrowhead and the WR / OR lettering. Selecting such a layer shows the default svg in the icon panel, ready to copy or edit.

Trigger recommendations from the review data
* The trigger panel no longer shows hand-written hints. It reads `public/labelTool/trigger-recommendations.json`, a summary of the 1544 review annotations generated by `yarn build:recommendations`, maps the layer's data to the review's data labels and lists when such visualizations appeared (e.g. "after a turn 70% (295)") with a typical duration.

Customized SVG icon panel
* Preview of the current icon, and a code window with syntax highlighting, a Format button, Copy and Apply.

Result charts
* The player is cued at the race start without playing (no more pre-roll on page load); seeking while paused stays paused; a mute button with a speaker icon.
* The page is titled "Labeling results".

Headers, tours and polish
* Every page header ends with the same button group: Pages menu, GitHub, About (with page icons on its links) and the help tour. The tours of the label tools and the result charts open only from that button; the authoring tour gained a "Resize the panels" step and its help button moved into the header.
* Timeline ruler: tick labels yield to the race-start label and the playhead badge; interval tooltips flip to stay inside the visible chart.
* Controller panel: tighter spacing, "Global settings" styled like the other sections, and the video file name shown under the player instead of above it.
* Layer panel: the divider between the layer list and the timeline can be dragged to change the list's width (double-click to reset); the size is remembered.
* User-facing text uses American spelling throughout; a few notices were reworded.

### 1.4.0

Result charts (`/visualization`)
* One video at a time by default, with a switch to stack all 31 videos (optionally on a common time scale); the gantt is a scrubbable navigator under the player with a ticked time axis, playhead, zoom (ctrl/⌘ + wheel or slider) and hover tooltips.
* Side panel with two tabs: the annotations active at the current moment, and the full table. Column filters in the table dim the non-matching bars in the gantt and the bbox overlay; clicking a bar, a card or a table row selects the annotation and seeks the player.
* The player stays at 640×360 so the stored bounding boxes (labeled on 1280×720) map 1:2 without any transform.
* Layout is computed by a pure, tested module instead of per-group Konva effects; bars are memoised so hovering doesn't repaint the whole chart.

Authoring page
* The controller panel width and the layer panel height can be dragged (double-click a gutter to reset); sizes are remembered.
* Copying a layer now assigns it a new id.

Navigation
* The floating buttons in the bottom-right corner are gone. Every page header now carries the page navigation: a compact "Pages" menu in the authoring header, and a tab strip in the slim header of the label tools and the result charts. Links are router links, so switching pages no longer reloads the app.
* The bbox overlay on the result player is off by default, as before, so it never covers the video.

Onboarding & appearance
* Guided tours on the result charts and on each label tool (? button in the header), shown once on first visit; the authoring tour gained steps for the timeline, click-to-select on the video, resizable panels and the Pages menu.
* The label tools use a two-column flow layout instead of fixed absolute offsets, so nothing overlaps any more.
* Light mode uses a deeper accent blue (#1a8fc7) and firmer selection tints; the accent is theme-aware in the timeline and chart canvases.
### 1.3.0

Timeline
* Ruler with time ticks, a playhead badge and a race-start marker; drag on the ruler or the rows to seek; ctrl/⌘ + wheel zooms around the cursor, shift + wheel pans.
* Interval bars can be reshaped by dragging their edges or moved by dragging the bar; hand-edited layers show a dashed outline and a ↺ button restores the trigger result. Edits are kept in exported configurations and recomputed from the triggers when a different video is loaded.
* Keyboard: space plays/pauses, ←/→ step one frame (shift: 1 s), Home jumps to the race start.
* Layers without triggers span the race start to the end of the video ("whole race") instead of starting at video time 0, both on the timeline and when rendering.

Authoring
* Hovering a visualization on the video highlights it; clicking it selects its layer.
* Trigger panel: the value input shows the unit of the selected subject (m, s, m/s, m/s²) per trigger card.

Appearance
* Blue-tinted dark and light palettes with consistent contrast; layer-row icons stay readable on selected rows; a global font stack so text outside antd widgets no longer falls back to a serif.
* Header regrouped with labeled controls, GitHub link and an About dialog that names the paper version.

### 1.2.0

Loading & network
* mp4s are remuxed with `faststart` so the browser starts playing before the whole file is downloaded.
* Frame CSVs are downloaded with a progress overlay on the video panel; switching video aborts the previous download.
* The frame table is built in a single pass and kept out of MobX's deep proxy, which makes per-frame rendering cheaper.
* `VITE_ASSET_BASE_URL` lets the videos / CSVs / configurations be served from a CDN instead of `public/`.
* Route-level code splitting (label tools and result charts load on demand), vendor chunks for react / antd / konva, the `openai` SDK is loaded only when the AI assistant is used, and `console.log` is stripped from production bundles.

Architecture
* `VisHolder/visRegistry.ts` maps `visName` to its component; the two 500-line switch statements are gone.
* Store: one generic `updateEditingElement(patch)` behind the per-property setters; trigger intervals are recomputed whenever a different race is loaded.
* Exported configurations are wrapped in a versioned envelope (`format`, `appVersion`, `video`, `layers`) and named `swimchrono-<video>-v<version>.json`; the legacy bare array (used by the shipped examples) still imports, and a mismatch between the exported and the loaded video is reported.

UI
* Header fits viewports down to ~1100 px; the video search is case-insensitive; the version badge next to the logo links to this changelog.
* antd messages follow the dark / light theme; the permanent "loading may take a while" notification is gone.
* The label tools no longer leave a `beforeunload` prompt behind when returning to the authoring page.

Tests
* New unit tests for trigger interval computation, CSV parsing, asset URL resolution and configuration import (57 tests).

### 1.1.0

* App version shown in the header and the Supplementary modal.
* Documentation: step-by-step instructions to replicate Figures 4–6 of the paper.

### 1.0.0 — paper version

* The state of the tool described in the paper: authoring interface, paper examples (Olympic Style, Pac-man, Acceleration), speed-climbing case, GitHub Pages deployment.

## License

MIT — see [LICENSE](./LICENSE).
