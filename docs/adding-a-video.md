# Adding a New Video

Each race in *SwimChrono* is made of three assets (plus one optional):

| Asset | Location | Role |
|---|---|---|
| Video file (`.mp4`) | `public/video/` | The from-above race footage shown in the player |
| Per-frame data (`.csv`) | `public/csv/` | One row per swimmer per frame; drives every visualization |
| Metadata entry | `src/utils/values.tsx` → `videoMetaDataList` | Registers the race in the Header dropdown and links video + CSV |
| Example configuration (`.json`, optional) | `public/configuration/` + `exampleList` | Pre-authored layer setups loadable from the Header |

The first entry of `videoMetaDataList` is the default race loaded on start.

## 1. Drop the video in `public/video/`

Use a compressed mp4 (the shipped `zip-*.mp4` files are compressed versions).
If you plan to commit it, keep it **under GitHub's 100 MB per-file limit**.

## 2. Add the per-frame CSV in `public/csv/`

One row per swimmer per frame. `frameId` is the video frame index
(`video time in seconds × framerate`), and `swimmerId` is the lane index
starting at 0. Use a shipped file such as
`public/csv/paris24-women-free-final-50m.csv` as a column reference.

The authoritative column/event specification is the `formats.csv.swimflow`
format in the [sportsdata](https://github.com/centralelyon/sportsdata)
repository. You can validate your CSV with:

```bash
python3 -m sportsdata.validators.cli \
  --format formats.csv.swimflow \
  public/csv/my-race.csv
```

## 3. Register the race in `videoMetaDataList`

Open `src/utils/values.tsx`, find `videoMetaDataList`, and append a copy of
this template:

```ts
{
  "name": "my-race",                    // unique id, shown in the Header dropdown
  "lanes": 8,                           // number of lanes in the pool
  "raceStartTime": 13.94,               // seconds into the video when the race starts
  "dataCSV": "my-race.csv",             // file name inside public/csv/
  "framerate": 50,                      // fps of the video (frameId in the CSV uses it too)
  "distance": 50,                       // race distance in meters
  "poolLapLength": 50,                  // pool length in meters
  "gender": "women",                    // "men" | "women" | "mixed"
  "year": 2024,
  "type": "individual",                 // "individual" | "relay"
  "style": "freestyle",                 // stroke, e.g. "freestyle" | "backstroke" | ...
  "level": "Olympic",                   // free-text competition level
  "videoName": "my-race",
  "video": "video/my-race.mp4",         // path relative to public/
  "note": "my-race",
  "swimmersInfo": [                     // one entry per lane, swimmerId = lane index
    { "name": "SWIMMER One", "nationality": "USA", "swimmerId": 0 },
    { "name": "SWIMMER Two", "nationality": "FRA", "swimmerId": 1 }
    // ...
  ]
}
```

## 4. (Optional) Ship an example configuration

Author layers in the tool, export the configuration from the Header
(**Export** button), place the JSON in `public/configuration/`, and add an
entry to `exampleList` in `src/utils/values.tsx`:

```ts
{
  videoName: "my-race",                 // must match the metadata "name"
  exampleName: "My Example",
  configuration: "my-example.json"      // file name inside public/configuration/
}
```

## 5. See it in the tool

```bash
yarn run dev
```

Open the Visualization page and pick the new race in the Header dropdown.
If the video plays but visualizations stay empty, check that `dataCSV`
points to the right file and that `framerate` / `raceStartTime` match the
video.

## Roadmap: a dynamic video index

Right now the video list is hard-coded in `videoMetaDataList`. A more
scalable setup — which we have been working on in related projects — would
be:

1. a folder that contains all the videos (e.g. `public/videos/`),
2. an index that lists those videos with metadata (race type, …),
3. individual per-video metadata files as JSON,

so that adding/removing videos only requires regenerating the index, with
no code change. This needs some adaptation and a small (e.g. Python)
backend, so it is out of scope for this replicability version.

Related resources:

* [aquanote](https://github.com/centralelyon/aquanote) — a tool to annotate
  swimming videos with cycles and generate the from-above video (like the
  ones used in *SwimFlow* / *SwimChrono*). It stores the JSON metadata and
  the cycles CSV separately from the video, includes sample videos with
  various race formats, and mirrors an online collection of 1000+ recorded
  videos. [Online demo](https://centralelyon.github.io/aquanote/?competition=2025_courses_demo&course=2025_courses_demo_freestyle_femmes_50_finale&source=static&apiUrl=https%3A%2F%2Frandou.liris.cnrs.fr%2Fvizapi%2Faquanote&data=2025_courses_demo_freestyle_femmes_50_finale.csv).
* [sportsdata](https://github.com/centralelyon/sportsdata) — strict
  JSON/CSV format specifications (columns and event values) shared across
  these tools; it includes the *SwimFlow*/*SwimChrono* CSV format and a
  validator CLI. The same format family is planned for other sports
  (climbing, boxing, table tennis).
