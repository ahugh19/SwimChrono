import { editableElementInVisConfigType, visControllerPanelConfigType, VisSelectionPanelTooltipTitleType } from "../types"

export const DEFAULTSwimFlow2ShapeControllerFillColor = "#1677ff"
export const DEFAULTSwimFlow2ShapeControllerStrokeColor = "#1677ff"
export const DEFAULTSwimFlow2ShapeControllerStrokeWidth = 1
export const DEFAULTSwimFlow2TextControllerFillColor = "#ffffff"
export const DEFAULTSwimFlow2TextControllerFontSize = 20 //px
export const DEFAULTSwimFlow2TextControllerIconSize = 40 //px
export const DEFAULTSwimFlow2CustomizedIconControllerIconSize = 1 //%
export const DEFAULTSwimFlow2PositionX = 0 // 
export const DEFAULTSwimFlow2PositionY = 0 // 
export const DEFAULTSwimFlow2PositionR = 0 // 
export const DEFAULTSwimFlow2PositionS = 100 // 
export const DEFAULTSwimFlow2PositionXNoMove = 0 // 
export const DEFAULTSwimFlow2LaneSum = 8 // 
export const DEFAULTSwimFlow2LapDistance = 50 // 

export const DEFAULTSwimFlow2GLOBAL_blur = 0.5 // 
export const DEFAULTSwimFlow2GLOBAL_minDuration = 3 // 

export const VALUEFrameDataDirection_advance = "advance" // 
export const VALUEFrameDataDirection_return = "return" //



// AI assistant credentials are loaded from environment variables; see
// `src/utils/aiConfig.ts` and `.env.example`.

export const rectColorDefault = "#616161"
export const rectColorInvisible = "#303030"
export const rectColorStatic = "#87CEEB"
export const rectColorMoving = "#EEB4B4"
export const rectColorFrontPlayer = "#FFB90F"
export const rectColorBehindPlayer = "#EE6363"
export const rectColorBottomRight = "#00CED1"
export const rectColorBottomLeft = "#3CB371"
export const rectColorTopRight = "#CDAA7D"
export const rectColorTopLeft = "#DDA0DD"
export const rectColorAlong = "#999999"

export const textColor = "#B0B0B0"
export const uiTextLight = "#dedede" // light text on dark backgrounds (result/legend)
export const uiHighlightStar = "#FFC125" // highlighted-case star colour
export const uiWarningOrange = "#F4A460" // warning indicator (forms)
export const strokeColor = "#DDDDDD"
export const strokeWidth = 1.5
export const uiLineColor = "#454545"
export const uiBlue = "#2babea"
// export const uiBackgroundHighlight = "#1d7ef34d" 
export const uiBackgroundHighlight = "#1e5874"
export const uiBackgroundHighlightInvisible = "#1b2c35"
export const uiBackgroundNormal = "#1a1a1a"
export const uiBackgroundNormalInvisible = "#000000"
export const rectBorderRadius = 0.5

export const videoPreStartColor = "#313131"
export const videoPreStartColorInVisible = "#222222"
export const triggerStartBorderColor = "#3BB875"
export const triggerEndBorderColor = "#DA71EB"
export const triggerEndDurationBorderColor = "#727272"
export const triggerStartBorderColorInvisible = "#274f3a"
export const triggerEndBorderColorInvisible = "#432b46"
export const triggerEndDurationBorderColorInvisible = "#333333"

export const durationRectMarginY = 0 // vertical gap between rows of rects
export const durationRectLineStroke = 1 // thickness of the divider line between rows
export const durationRectHeight = 24 - durationRectLineStroke // height of each rect
export const temporalInfoHeight = 440
export const chromeScrollBarWidth = 15
export const globalUIPadding = 12
export const globalConfigPanelWidth = 240
export const layerPartWidth = 224
export const VALUEHalfDistance = 50
export const VALUEClimbHeight = 14.4
export const VALUEClimbWidth = 3.2
export const VALUEClimbVideoHeight = 1920
export const VALUEClimbVideoWidth = 368
// Reference video pixel width used as a fallback when the live svgWidth is
// unavailable (the source videos in this repo are 1920×1080).
export const DEFAULT_VIDEO_PIXEL_WIDTH = 1920

export const OPTION_PLACEMENT = "placement"
export const OPTION_MOVEMENT = "movement"

export const VIS_MOVEMENT_STATIC = "static"
export const VIS_MOVEMENT_MOVING = "move with players"
export const VIS_PLACEMENT_LANE_ALONG = "along lane"
export const VIS_PLACEMENT_LANE_OTHERS = "others-lane"
export const VIS_PLACEMENT_PLAYER_FRONT = "front"
export const VIS_PLACEMENT_PLAYER_BEHIND = "behind"
export const VIS_PLACEMENT_PLAYER_OTHERS = "others-player"
export const VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT = "bottom right"
export const VIS_PLACEMENT_SCREEN_BOTTOM_LEFT = "bottom left"
export const VIS_PLACEMENT_SCREEN_TOP_RIGHT = "top right"
export const VIS_PLACEMENT_SCREEN_TOP_LEFT = "top left"
export const VIS_PLACEMENT_SCREEN_TOP = "top"
export const VIS_PLACEMENT_SCREEN_BOTTOM = "bottom"
export const VIS_PLACEMENT_SCREEN_RIGHT = "right"
export const VIS_PLACEMENT_SCREEN_LEFT = "left"
export const VIS_PLACEMENT_SCREEN_OTHERS = "others-screen"

export const TRIGGER_COMP_START_END = "start+end"
export const TRIGGER_COMP_START_DURATION = "start+duration"

export const VIS_TYPE_NATIONALITY = "nationality"
export const VIS_TYPE_CURRENT_SPEED = "currentSpeed"
export const VIS_TYPE_RECORD = "record"

export const DATA_COLUMN_NAME_ELAPSED = "elapsed"

export const optionsTriggerType = [
  TRIGGER_COMP_START_END,
  TRIGGER_COMP_START_DURATION
]

export const COMPARE_GREATER = "greater than (>)"
export const COMPARE_GREATER_AND_EQUAL = "greater than or equal to (>=)"
export const COMPARE_EQUAL = "equal to (=)"
export const COMPARE_SMALLER_AND_EQUAL = "smaller than or equal to (<=)"
export const COMPARE_SMALLER = "smaller than (<)"

export const optionsCompareOnlyEqual = [
  COMPARE_EQUAL,
]

export const optionsCompare = [
  COMPARE_GREATER,
  COMPARE_GREATER_AND_EQUAL,
  COMPARE_EQUAL,
  COMPARE_SMALLER_AND_EQUAL,
  COMPARE_SMALLER
]

export const SUBJECT_DURATION = "duration"
export const SUBJECT_distanceSwam = "distanceSwam"
export const SUBJECT_x_middle = "x_middle"
export const SUBJECT_POOLSIDE = "distanceToPoolSide"
export const SUBJECT_acceleration = "acceleration"
export const SUBJECT_distanceToLeader = "distanceToLeader"
export const SUBJECT_event = "event"

export const subjectListUnitMeter = [
  SUBJECT_distanceSwam, SUBJECT_x_middle, SUBJECT_POOLSIDE, SUBJECT_distanceToLeader
]

export const subjectListUnitSecond = [
  SUBJECT_DURATION
]

// speed
export const subjectListUnitMeterPerSecond = [
]

// acceleration
export const subjectListUnitMeterPerSquareSecond = [
  SUBJECT_acceleration
]

export const optionsSubjectNoDuration = [
  SUBJECT_distanceSwam,
  SUBJECT_x_middle,
  SUBJECT_POOLSIDE,
  SUBJECT_acceleration,
  SUBJECT_distanceToLeader,
  SUBJECT_event
]

export const optionsSubjectDuration = [
  ...optionsSubjectNoDuration,
  SUBJECT_DURATION
]

export const EVENT_JUMPINTOWATER = "jumpIntoWater"
export const EVENT_DIVING = "diving"
export const EVENT_CYCLE = "cycle"
export const EVENT_TURNING = "turn"
export const EVENT_Finish = "finish"

export const optionsEvent = [
  EVENT_JUMPINTOWATER,
  EVENT_DIVING,
  EVENT_CYCLE,
  EVENT_Finish,
  EVENT_TURNING
]

// smaller is leader
export const minIsLeaderSubjectList = [
  SUBJECT_x_middle
]

// larger is leader
export const maxIsLeaderSubjectList = [
  SUBJECT_distanceSwam
]

export const optionsVisType = [
  VIS_TYPE_NATIONALITY,
  VIS_TYPE_CURRENT_SPEED,
  VIS_TYPE_RECORD
]

export const optionsDataColumnName = [
  DATA_COLUMN_NAME_ELAPSED
]

export const genderOptions = [
  "men",
  "women",
  "mixed"
]
export const styleOptions = [
  "freestyle",
  "backstroke",
  "breaststroke",
  "butterfly",
  "mixed",
  "others"
]
export const typeOptions = [
  "individual",
  "relay",
  "others"
]
export const visTypeOptions = [
  "bar",
  "line",
  // "highlight",
  // "flag icon",
  // "number",
  // "race icon",
  "text",
  "graphics",
  // "wr icon",
  // "cr icon",
  "others"
]
export const dataOptionsStringList = ["lane number", "ranking number", "speed", "race name", "only leader", "top x player", "all players", "nation flag", "nation abbr", "full first name", "abbr first name", "full last name", "abbr last name", "reaction time", "elapsed time of race", "leader's lap time", "others' lap time difference to leader", "time difference of the leader to wr", "time difference of the leader to cr", "time difference of the leader to wr (splitted)", "time difference of the leader to cr (splitted)", "distance diving", "distance swam", "distance of current laps", "others' distance differerences to leader", "wr (world record) splitted", "wr (world record)", "cr (competition record) splitted", "cr (competition record)", "others"]
export const dataOptions = [
  {
    label: "basic",
    options: [
      { label: "lane number", value: "lane number" },
      { label: "ranking number", value: "ranking number" },
      { label: "speed", value: "speed" },
      { label: "race name", value: "race name" },
    ],
  },
  {
    label: "which player(s)",
    options: [
      { label: "only leader", value: "only leader" },
      { label: "top x player", value: "top x player" },
      { label: "all players", value: "all players" },

    ]
  },
  {
    label: "nation",
    options: [
      { label: "nation flag", value: "nation flag" },
      { label: "nation abbr", value: "nation abbr" },
    ],
  },
  {
    label: "player name",
    options: [
      { label: "full first name", value: "full first name" },
      { label: "abbr first name", value: "abbr first name" },
      { label: "full last name", value: "full last name" },
      { label: "abbr last name", value: "abbr last name" },
    ],
  },
  {
    label: "time",
    options: [
      { label: "reaction time", value: "reaction time" },
      { label: "elapsed time of race", value: "elapsed time of race" },
      // { label: "elapsed time of leader", value: "elapsed time of leader" },
      { label: "leader's lap time", value: "leader's lap time" },
      { label: "others' lap time difference to leader", value: "others' lap time difference to leader" },
      { label: "time difference of the leader to wr", value: "time difference of the leader to wr" },
      { label: "time difference of the leader to cr", value: "time difference of the leader to cr" },
      { label: "time difference of the leader to wr (splitted)", value: "time difference of the leader to wr (splitted)" },
      { label: "time difference of the leader to cr (splitted)", value: "time difference of the leader to cr (splitted)" },
    ],
  },
  {
    label: "distance",
    options: [
      { label: "distance dive", value: "distance diving" },
      { label: "distance swam", value: "distance swam" },
      { label: "distance of current laps", value: "distance of current laps" },
      { label: "others' distance differerences to leader", value: "others' distance differerences to leader" },
    ],
  },
  {
    label: "record",
    options: [
      { label: "wr (world record) splitted", value: "wr (world record) splitted" },
      { label: "wr (world record)", value: "wr (world record)" },
      { label: "cr (competition record) splitted", value: "cr (competition record) splitted" },
      { label: "cr (competition record)", value: "cr (competition record)" },
    ],
  },
  {
    label: "others",
    options: [
      { label: "others", value: "others" },
    ]
  }
]
export const highlightOptions = [
  "true", "false"
]
export const morphOptions = [
  "corresponding to camera",
  "none",
  "others"
]
export const enteringAnimationOptions = [
  "hard cut",
  "staged",
  "fade in",
]
export const updatingAnimationOptions = [
  "update number",
  "update bar",
  "update icon",
  "update position",
  "none",
  "others"
]
export const leavingAnimationOptions = [
  "hard cut",
  "staged",
  "fade out"
]
export const movementOptions = [
  "static",
  "move with players",
  "others"
]
export const placementRelativeToOptions = [
  "screen",
  "player",
  "lane",
  "others"
]
export const placementRelativeToScreenOptions = [
  "bottom right",
  "bottom left",
  "top right",
  "top left",
  "top",
  "bottom",
  "right",
  "left",
  "others"
]
export const placementRelativeToPlayerOptions = [
  "front",
  "behind",
  "others"
]
export const placementRelativeToLaneOptions = [
  "along lane",
  "others"
]
export const cameraShotOptions = [
  {
    label: "in air",
    options: [
      { label: "in air bird's-eyes", value: "in air bird's-eyes" },
      { label: "in air right half", value: "in air right half" },
      { label: "in air left half", value: "in air left half" },
      { label: "in air midline", value: "in air midline" },
      { label: "in air major diagonal", value: "in air major diagonal" },
      { label: "in air minor diagonal", value: "in air minor diagonal" },
      { label: "in air leader place", value: "in air leader place" },
    ],
  },
  {
    label: "under water",
    options: [
      { label: "under water bottom", value: "under water bottom" },
      { label: "under water right half", value: "under water right half" },
      { label: "under water left half", value: "under water left half" },
      { label: "under water midline", value: "under water midline" },
      { label: "under water major diagonal", value: "under water major diagonal" },
      { label: "under water minior diagonal", value: "under water minior diagonal" },
      { label: "under water leader place", value: "under water leader place" },
    ],
  },
  {
    label: "others",
    options: [
      { label: "others", value: "others" },
    ],
  }
]
export const OLDcameraShotOptions = [
  {
    label: "in air",
    options: [
      { label: "Bird's-eyes view", value: "ia Bird's-eyes view" },
      { label: "Left half", value: "ia Left half" },
      { label: "Right half", value: "ia Right half" },
      { label: "Minor diagonal to Midline to Right half view", value: "ia Minor diagonal to Midline to Right half view" },
      { label: "Major diagonal to Midline view", value: "ia Major diagonal to Midline view" },
      { label: "Left half to Midline view", value: "ia Left half to Midline view" },
      { label: "Right half to Midline view", value: "ia Right half to Midline view" },
    ],
  },
  {
    label: "under water",
    options: [
      { label: "Bottom view", value: "uw Bottom view" },
      { label: "Down-left to Major diagonal view", value: "uw Down-left to Major diagonal view" },
      { label: "Major diagonal view", value: "uw Major diagonal view" },
      { label: "Minior diagonal view", value: "uw Minior diagonal view" },
      { label: "Right half to Midline view", value: "uw Right half to Midline view" },
      { label: "Down-left / left half to the current 1st place view", value: "uw Down-left / left half to the current 1st place view" },
    ],
  },
  {
    label: "others",
    options: [
      { label: "others", value: "others" },
    ],
  }
]
export const keyEventOptionsStringList = [
  "whole race",
  "race start",
  "jump into the water",
  "dolphin kick",
  "passing",
  "lap",
  "turning",
  "last lane",
  "overtake (in relay)",
  "general swimming",
  "race end",
  "others"
]

export const keyEventOptions = [
  {
    label: "whole race",
    value: "whole race",
  },
  {
    label: "race start",
    value: "race start",
  },
  {
    label: "jump into the water",
    value: "jump into the water",
  },
  {
    label: "dolphin kick",
    value: "dolphin kick",
  },
  {
    label: "passing",
    value: "passing",
  },
  {
    label: "lap",
    value: "lap",
  },
  {
    label: "turning",
    value: "turning",
  },
  {
    label: "last lane",
    value: "last lane",
  },
  { label: "overtake (in relay)", value: "overtake (in relay)" },
  { label: "general swimming", value: "general swimming" },
  { label: "race end", value: "race end" },
  { label: "others", value: "others" },

]

export const temporalRelationOptions = [
  "before",
  "after",
  "during",
  "others"
]
export const placementOptions = [
  {
    label: "lane/pool (placement relative to lane/pool)",
    options: [
      { label: "along lane", value: "along lane" },
      { label: "other to lane", value: "others-lane" }
    ],
  },
  {
    label: "player (placement relative to player's heading direction)",
    options: [
      { label: "front of player", value: "front" },
      { label: "behind player", value: "behind" },
      { label: "other to player", value: "others-player" }
    ],
  },
  {
    label: "screen",
    options: [
      {
        label: "bottom right",
        value: "bottom right",
      },
      {
        label: "bottom left",
        value: "bottom left",
      },
      {
        label: "top right",
        value: "top right",
      },
      {
        label: "top left",
        value: "top left",
      },
      {
        label: "top",
        value: "top",
      },
      {
        label: "bottom",
        value: "bottom",
      },
      {
        label: "right",
        value: "right",
      },
      {
        label: "left",
        value: "left",
      },
      { label: "other to screen", value: "others-screen" }
    ],
  },
]
export const placementOptionsStringList = [
  VIS_PLACEMENT_LANE_ALONG,
  VIS_PLACEMENT_LANE_OTHERS,
  VIS_PLACEMENT_PLAYER_FRONT,
  VIS_PLACEMENT_PLAYER_BEHIND,
  VIS_PLACEMENT_PLAYER_OTHERS,
  VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT,
  VIS_PLACEMENT_SCREEN_BOTTOM_LEFT,
  VIS_PLACEMENT_SCREEN_TOP_RIGHT,
  VIS_PLACEMENT_SCREEN_TOP_LEFT,
  VIS_PLACEMENT_SCREEN_TOP,
  VIS_PLACEMENT_SCREEN_BOTTOM,
  VIS_PLACEMENT_SCREEN_RIGHT,
  VIS_PLACEMENT_SCREEN_LEFT,
  VIS_PLACEMENT_SCREEN_OTHERS,
]


export const visOptionsCopiedBbox = ["visBbox"]
export const visOptionsCopiedMoment = ["startMoment", "endMoment"]
export const visOptionsCopiedOther = ["data", "visType", "placement", "morph", "movement", "keyEvent", "temporalRelation", "enteringAnimation", "leavingAnimation", "updatingAnimation", "highlight", "note"]
export const visOptionsCopiedAll = [...visOptionsCopiedBbox, ...visOptionsCopiedMoment, ...visOptionsCopiedOther]

export const defaultVisOptionsCopiedBbox = ["visBbox"]
export const defaultVisOptionsCopiedMoment = ["startMoment"]
export const defaultVisOptionsCopiedOther = ["data", "visType", "placement", "morph", "movement", "keyEvent", "temporalRelation", "enteringAnimation", "leavingAnimation", "updatingAnimation", "highlight"]

export const eventOptionsCopiedMoment = ["startMoment", "endMoment"]
export const eventOptionsCopiedOther = ["keyEvent", "type", "note"]
export const defaultEventOptionsCopiedOther = ["keyEvent", "type"]
export const eventOptionsCopiedAll = [...eventOptionsCopiedMoment, ...eventOptionsCopiedOther]

export const cameraShotOptionsCopiedMoment = ["startMoment"]
export const cameraShotOptionsCopiedOther = ["cameraShot", "note"]
export const defaultCameraShotOptionsCopiedOther = ["cameraShot"]
export const cameraShotOptionsCopiedAll = [...cameraShotOptionsCopiedMoment, ...cameraShotOptionsCopiedOther]

export const eventTypeOptions = [
  "interval", "point"
]
export const intervalEventList = [
  "whole race",
  "dolphin kick",
  "passing",
  "lap",
  "last lane",
  "general swimming",
]

export const pointEventList = [
  "race start",
  "jump into the water",
  "turning",
  "overtake (in relay)",
  "race end",
]

export const videoMetaDataList = [
  {
    "name": "paris24-men-back-final-100m",
    "lanes": 8,
    "raceStartTime": 46.68,
    "dataCSV": "paris24-men-back-final-100m.csv",
    "framerate": 50,
    "distance": 100,
    "poolLapLength": 50,
    "gender": "men",
    "year": 2024,
    "type": "individual",
    "style": "backstroke",
    "level": "Olympic",
    "videoName": "paris24-men-back-final-100m",
    "video": "video/zip-2024_JO_Paris_dos_hommes_100_finaleA_from_above.mp4",
    "note": "paris24-men-back-final-100m",
    "swimmersInfo": [
      {
        "name": "MORGAN Oliver",
        "nationality": "GBR",
        "swimmerId": 0,
      },
      {
        "name": "MURPHY Ryan",
        "nationality": "USA",
        "swimmerId": 1,
      },
      {
        "name": "NDOYE-BROUARD Yohann",
        "nationality": "FRA",
        "swimmerId": 2,
      },
      {
        "name": "XU Jiayu",
        "nationality": "CHN",
        "swimmerId": 3,
      },
      {
        "name": "CECCON Thomas",
        "nationality": "ITA",
        "swimmerId": 4,
      },
      {
        "name": "COETZE Pieter",
        "nationality": "RSA",
        "swimmerId": 5,
      },
      {
        "name": "CHRISTOU Apostolos",
        "nationality": "GRE",
        "swimmerId": 6,
      },
      {
        "name": "GONZALEZ DE OLIVEIRA Hugo",
        "nationality": "ESP",
        "swimmerId": 7,
      }
    ]
  },
  {
    "name": "paris24-men-mixed-final-200m",
    "lanes": 8,
    "raceStartTime": 13.8,
    "dataCSV": "paris24-men-mixed-final-200m.csv",
    "framerate": 50,
    "distance": 200,
    "poolLapLength": 50,
    "gender": "men",
    "year": 2024,
    "type": "individual",
    "style": "medlay",
    "level": "Olympic",
    "videoName": "paris24-men-mixed-final-200m",
    "video": "video/zip-paris24-men-mixed-200-final.mp4",
    "note": "paris24-men-mixed-final-200m",
    "swimmersInfo": [
      {
        "name": "RAZZETTI Alberto",
        "nationality": "ITA",
        "swimmerId": 0,
      },
      {
        "name": "SETO Daiya",
        "nationality": "JPN",
        "swimmerId": 1,
      },
      {
        "name": "SCOTT Duncan",
        "nationality": "GBR",
        "swimmerId": 2,
      },
      {
        "name": "MARCHAND Leon",
        "nationality": "FRA",
        "swimmerId": 3,
      },
      {
        "name": "FOSTER Carson",
        "nationality": "USA",
        "swimmerId": 4,
      },
      {
        "name": "WANG Shun",
        "nationality": "CHN",
        "swimmerId": 5,
      },
      {
        "name": "DEAN Tom",
        "nationality": "GBR",
        "swimmerId": 6,
      },
      {
        "name": "KNOX Finlay",
        "nationality": "CAN",
        "swimmerId": 7,
      }
    ]
  },
  {
    "name": "paris24-women-free-final-50m",
    "lanes": 8,
    "raceStartTime": 13.94,
    "dataCSV": "paris24-women-free-final-50m.csv",
    "framerate": 50,
    "distance": 50,
    "poolLapLength": 50,
    "gender": "women",
    "year": 2024,
    "type": "individual",
    "style": "freestyle",
    "level": "Olympic",
    "videoName": "paris24-women-free-final-50m",
    "video": "video/zip-paris24-women-free-50-final.mp4",
    "note": "paris24-women-free-final-50m",
    "swimmersInfo": [
      {
        "name": "WU Qingfeng",
        "nationality": "CHN",
        "swimmerId": 0,
      },
      {
        "name": "JACK Shayna",
        "nationality": "AUS",
        "swimmerId": 1,
      },
      {
        "name": "WASICK Katarzyna",
        "nationality": "POL",
        "swimmerId": 2,
      },
      {
        "name": "SJOESTROEM Sarah",
        "nationality": "SWE",
        "swimmerId": 3,
      },
      {
        "name": "WALSH Gretchen",
        "nationality": "USA",
        "swimmerId": 4,
      },
      {
        "name": "ZHANG Yufei",
        "nationality": "CHN",
        "swimmerId": 5,
      },
      {
        "name": "HARRIS Meg",
        "nationality": "AUS",
        "swimmerId": 6,
      },
      {
        "name": "KLANCAR Neza",
        "nationality": "SLO",
        "swimmerId": 7,
      }
    ]
  },
  {
    "name": "Local 100m breast F",
    "lanes": 8,
    "raceStartTime": 13.6599,
    "dataCSV": "dataTest.csv",
    "framerate": 50,
    "distance": 100,
    "poolLapLength": 50,
    "gender": "women",
    "year": 2021,
    "type": "individual",
    "style": "breaststroke",
    "level": "France Championship",
    "videoName": "test",
    "video": "video/test.mp4",
    "note": "test",
    "swimmersInfo": [
      {
        "name": "GALLEGO Solene",
        "nationality": "FR",
        "swimmerId": 0,
      },
      {
        "name": "BRAUN Chloe",
        "nationality": "FR",
        "swimmerId": 1,
      },
      {
        "name": "BARREAU Laure",
        "nationality": "netherlands",
        "swimmerId": 2,
      },
      {
        "name": "GASPARD Florine",
        "nationality": "BE",
        "swimmerId": 3,
      },
      {
        "name": "DELMAS Justine",
        "nationality": "FR",
        "swimmerId": 4,
      },
      {
        "name": "BLANCHETIERE Adele",
        "nationality": "FR",
        "swimmerId": 5,
      },
      {
        "name": "CUCUMEL Romy",
        "nationality": "FR",
        "swimmerId": 6,
      },
      {
        "name": "MALLET Camille",
        "nationality": "FR",
        "swimmerId": 7,
      }
    ]
  },
  {
    "name": "Climbing",
    "lanes": 1,
    "raceStartTime": 3.3,
    "dataCSV": "climb_processed.csv",
    "framerate": 60,
    "distance": 15,
    "poolLapLength": 15,
    "gender": "women",
    "year": 2024,
    "type": "individual",
    "style": "climbing",
    "level": "Olympic",
    "videoName": "climbing",
    "video": "video/climbing.mp4",
    "note": "climbing",
    "swimmersInfo": [
      {
        "name": "MADE RITA D.M.",
        "nationality": "INA",
        "swimmerId": 0,
      },
    ]
  },
]

export const exampleList = [
  {
    videoName: "paris24-men-back-final-100m",
    exampleName: "Olympic Style (Case 1)",
    configuration: "olympic.json"
  },
  {
    videoName: "paris24-men-back-final-100m",
    exampleName: "Pac-man (Case 3)",
    configuration: "pacman.json"
  },
  {
    videoName: "paris24-men-back-final-100m",
    exampleName: "Acceleration (Case 3)",
    configuration: "acc.json"
  },
  {
    videoName: "climbing",
    exampleName: "Climbing",
    configuration: "climb.json"
  },
]


export const embeddedVisTypeComposeType_GLOBAL = "global"
export const embeddedVisTypeComposeType_INDIVIDUAL = "individual"
export const VALUE_customizedIconGlobal = "VisCustomizedIconGlobal"
export const VALUE_customizedIconIndividual = "VisCustomizedIconIndividual"
export const VALUE_customizedTextGlobal = "VisCustomizedTextGlobal"
export const VALUE_customizedTextIndividual = "VisCustomizedTextIndividual"
export const VALUE_elapsedTimeCorner = "elapsedTimeCorner" as const
export const VALUE_elapsedTimeLane = "elapsedTimeLane" as const
export const VALUE_nationalityTextLane = "nationalityTextLane" as const
export const VALUE_nationalityIconLane = "nationalityIconLane" as const
export const VALUE_currentSpeedTextLane = "currentSpeedTextLane" as const
export const VALUE_currentSpeedGlyphLane = "currentSpeedGlyphLane" as const
export const VALUE_worldRecordTextLane = "worldRecordTextLane" as const
export const VALUE_swimmerNameTextLane = "swimmerNameTextLane" as const
export const VALUE_distanceSwumTextLane = "distanceSwumTextLane" as const
export const VALUE_accelerationTextLane = "accelerationTextLane" as const
export const VALUE_distanceToLeaderTextLane = "distanceToLeaderTextLane" as const
export const VALUE_rankingChangeTextLane = "rankingChangeTextLane" as const
export const VALUE_rankingTextLane = "rankingTextLane" as const
export const VALUE_rankingBarCorner = "rankingBarCorner" as const
export const VALUE_laneHighlight = "laneHighlight" as const
export const VALUE_worldRecordLine = "worldRecordLine" as const
export const VALUE_worldRecordSplitCorner = "worldRecordSplitCorner" as const
export const VALUE_worldRecordSplitDiffCorner = "worldRecordSplitDiffCorner" as const
export const VALUE_worldRecordCorner = "worldRecordCorner" as const
export const VALUE_olympicRecordCorner = "olympicRecordCorner" as const
export const VALUE_lapDistanceCorner = "lapDistanceCorner" as const
export const VALUE_distanceSwumTextCorner = "distanceSwumTextCorner" as const
export const VALUE_raceNameCorner = "raceNameCorner" as const
export const VALUE_rankingFlagLane = "rankingFlagLane" as const
export const VALUE_distanceDivedTextLane = "distanceDivedTextLane" as const
export const VALUE_distanceDivedArrowLane = "distanceDivedArrowLane" as const
export const VALUE_strokeCountTextLane = "strokeCountTextLane" as const
export const VALUE_leaderLaneNumberTextCorner = "leaderLaneNumberTextCorner" as const
export const VALUE_distanceToLeaderBarLane = "distanceToLeaderBarLane" as const
export const VALUE_distanceSwumBarCorner = "distanceSwumBarCorner" as const
export const VALUE_top3SpeedLane = "top3SpeedLane" as const
export const VALUE_top3DistanceGapLane = "top3DistanceGapLane" as const
export const VALUE_distanceToLeaderPacManLane = "distanceToLeaderPacManLane" as const
export const VALUE_distanceLeftLane = "distanceLeftLane" as const
export const VALUE_climbCount = "climbCount" as const
export const VALUE_climbLine = "climbLine" as const
export const VALUE_climbIcon = "climbIcon" as const


// map data to visualizations
export const visControllerPanelConfig: visControllerPanelConfigType = {
  "elapsedTime": {
    visList: [
      {
        visName: VALUE_elapsedTimeCorner,
        visIcon: "generalCorner.png",
        dataName: "elapsedTime",
        triggerRecommendation: "This visualization usually appears during the whole race",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#0E3034", fontSize: 10 },
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#CFEEF2", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_elapsedTimeLane,
        visIcon: "generalTextLane.png",
        dataName: "elapsedTime",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
        ],
        visibleLanes: [1, 2, 5]
      },
      {
        visName: VALUE_customizedIconGlobal,
        visIcon: "generalIconCustomized.png",
        dataName: "elapsedTime",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [],
        customizedIcon: {
          svgContent: undefined,
          visible: true,
          size: DEFAULTSwimFlow2CustomizedIconControllerIconSize
        }
      },
      {
        visName: VALUE_customizedIconIndividual,
        visIcon: "generalIconLaneCustomized.png",
        dataName: "elapsedTime",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [],
        customizedIcon: {
          svgContent: undefined,
          visible: true,
          size: DEFAULTSwimFlow2CustomizedIconControllerIconSize
        }
      },
      {
        visName: VALUE_customizedTextGlobal,
        visIcon: "generalTextCustomized.png",
        dataName: "elapsedTime",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        customizedText: "Your customized text",
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: DEFAULTSwimFlow2TextControllerFontSize }
        ],
      },
      {
        visName: VALUE_customizedTextIndividual,
        visIcon: "generalTextLaneCustomized.png",
        dataName: "elapsedTime",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        customizedText: "Your customized text",
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: DEFAULTSwimFlow2TextControllerFontSize }
        ],
      },
    ]
  },
  "nationality": {
    visList: [
      {
        visName: VALUE_nationalityTextLane,
        visIcon: "generalTextLane.png",
        dataName: "nationality",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_nationalityIconLane,
        visIcon: "generalIconLane.png",
        dataName: "nationality",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "icon-1", type: "icon", visible: true, iconSize: DEFAULTSwimFlow2TextControllerIconSize }
        ]
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "nationality",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "currentSpeed": {
    visList: [
      {
        visName: VALUE_currentSpeedTextLane,
        visIcon: "generalTextLane.png",
        dataName: "currentSpeed",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_currentSpeedGlyphLane,
        visIcon: "generalIconLane.png",
        dataName: "currentSpeed",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "color-1", type: "color", visible: true, shapeFillColor: "#7AA2E3", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "color-2", type: "color", visible: true, shapeFillColor: "#FFC94A", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 }
        ]
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "currentSpeed",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_top3SpeedLane,
        visIcon: "generalTextLane.png",
        dataName: "currentSpeed",
        triggerRecommendation: "This visualization usually appears before or after the turn.",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-speed", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: "#1D4662" },
          { id: "icon-flag", type: "icon", visible: true, iconSize: DEFAULTSwimFlow2TextControllerIconSize },
          { id: "shape-bg-speed", type: "shape", visible: true, shapeFillColor: "#E9E9E9", shapeStrokeColor: "#1D4662", shapeStrokeWidth: 0 },
        ]
      },
    ]
  },
  "worldRecord": {
    visList: [
      {
        visName: VALUE_worldRecordTextLane,
        visIcon: "generalTextLane.png",
        dataName: "worldRecord",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_worldRecordLine,
        visIcon: "generalCorner.png",
        dataName: "worldRecord",
        triggerRecommendation: "This visualization usually appears when the leader has a chance to touch or break the record.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "shape-1", type: "shape", visible: true, shapeFillColor: "#1B3038", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#F0961D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "line-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#F0961D", shapeStrokeWidth: 2 },
        ]
      },
      {
        visName: VALUE_worldRecordSplitCorner,
        visIcon: "generalCorner.png",
        dataName: "worldRecord",
        triggerRecommendation: "This visualization usually appears during the turn.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1-spit-value", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },

          { id: "shape-1-WR-text", type: "shape", visible: true, shapeFillColor: "#102C3D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "shape-2-WR-bg", type: "shape", visible: true, shapeFillColor: "#EEAB40", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "shape-2-split", type: "shape", visible: true, shapeFillColor: "#ffffff", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },

          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#102C3D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_worldRecordCorner,
        visIcon: "generalCorner.png",
        dataName: "worldRecord",
        triggerRecommendation: "This visualization usually appears before the race end.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1-WR-value", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },

          { id: "shape-1-WR-text", type: "shape", visible: true, shapeFillColor: "#102C3D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "shape-2-WR-bg", type: "shape", visible: true, shapeFillColor: "#EEAB40", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },

          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#102C3D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "olympicRecord": {
    visList: [
      {
        visName: VALUE_olympicRecordCorner,
        visIcon: "generalCorner.png",
        dataName: "olympicRecord",
        triggerRecommendation: "This visualization usually appears before the race end.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1-OR-value", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },

          { id: "shape-1-OR-text", type: "shape", visible: true, shapeFillColor: "#102C3D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "shape-2-OR-bg", type: "shape", visible: true, shapeFillColor: "#828F9A", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },

          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#102C3D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "swimmerName": {
    visList: [
      {
        visName: "swimmerNameTextLane",
        visIcon: "generalTextLane.png",
        dataName: "swimmerName",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "swimmerName",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "distanceSwum": {
    visList: [
      {
        visName: VALUE_distanceSwumTextLane,
        visIcon: "generalTextLane.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_distanceSwumTextCorner,
        visIcon: "generalCorner.png",
        dataName: "distanceSwum",
        triggerRecommendation: "This visualization usually appears during the whole race.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#1B505D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_distanceSwumBarCorner,
        visIcon: "generalCorner.png",
        dataName: "distanceSwum",
        triggerRecommendation: "This visualization usually appears during the whole race.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: 10, fontFillColor: "#0E3034" },
          { id: "shape-bar", type: "shape", visible: true, shapeFillColor: "#872a31", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "shape-bar-bg", type: "shape", visible: true, shapeFillColor: "#9ebec4", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "shape-background", type: "shape", visible: true, shapeFillColor: "#CFEEF2", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_customizedIconGlobal,
        visIcon: "generalIconCustomized.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [],
        customizedIcon: {
          svgContent: undefined,
          visible: true,
          size: DEFAULTSwimFlow2CustomizedIconControllerIconSize
        }
      },
      {
        visName: VALUE_customizedIconIndividual,
        visIcon: "generalIconLaneCustomized.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [],
        customizedIcon: {
          svgContent: undefined,
          visible: true,
          size: DEFAULTSwimFlow2CustomizedIconControllerIconSize
        }
      },
      {
        visName: VALUE_customizedTextGlobal,
        visIcon: "generalTextCustomized.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        customizedText: "Your customized text",
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: DEFAULTSwimFlow2TextControllerFontSize }
        ],
      },
      {
        visName: VALUE_customizedTextIndividual,
        visIcon: "generalTextLaneCustomized.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        customizedText: "Your customized text",
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: DEFAULTSwimFlow2TextControllerFontSize }
        ],
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_distanceLeftLane,
        visIcon: "generalIconLane.png",
        dataName: "distanceSwum",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: DEFAULTSwimFlow2TextControllerFontSize },
          { id: "background-shape-1-start", type: "shape", visible: true, shapeFillColor: "#ffb6b6ae", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "background-shape-1-end", type: "shape", visible: true, shapeFillColor: "#88bbffff", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "acceleration": {
    visList: [
      {
        visName: "accelerationTextLane",
        visIcon: "generalTextLane.png",
        dataName: "acceleration",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "acceleration",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "distanceToLeader": {
    visList: [
      {
        visName: "distanceToLeaderTextLane",
        visIcon: "generalTextLane.png",
        dataName: "distanceToLeader",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: "distanceToLeaderBarLane",
        visIcon: "generalIconLane.png",
        dataName: "distanceToLeader",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
          { id: "shape-bar", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 }
        ]
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "distanceToLeader",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_top3DistanceGapLane,
        visIcon: "generalTextLane.png",
        dataName: "distanceToLeader",
        triggerRecommendation: "This visualization usually appears before the race end.",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-distance-gap", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: "#1D4662" },
          { id: "icon-flag", type: "icon", visible: true, iconSize: DEFAULTSwimFlow2TextControllerIconSize },
          { id: "shape-bg-distance-gap", type: "shape", visible: true, shapeFillColor: "#E9E9E9", shapeStrokeColor: "#1D4662", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_distanceToLeaderPacManLane,
        visIcon: "generalIconLane.png",
        dataName: "distanceToLeader",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "shape-pac-man", type: "shape", visible: true, shapeFillColor: "yellow", shapeStrokeColor: "#000000", shapeStrokeWidth: 0 },
          { id: "shape-food", type: "shape", visible: true, shapeFillColor: "#ffffff", shapeStrokeColor: "#000000", shapeStrokeWidth: 0 },
        ]
      },
    ]
  },
  "ranking": {
    visList: [
      {
        visName: VALUE_rankingTextLane,
        visIcon: "generalTextLane.png",
        dataName: "ranking",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_rankingFlagLane,
        visIcon: "generalIconLane.png",
        dataName: "ranking",
        triggerRecommendation: "This visualization usually appears after the race end.",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-ranking", type: "text", visible: true, fontSize: 28, fontFillColor: "#1D4662" },
          { id: "text-name", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: "#1D4662" },
          { id: "icon-flag", type: "icon", visible: true, iconSize: DEFAULTSwimFlow2TextControllerIconSize },
          { id: "shape-bg-ranking", type: "shape", visible: true, shapeFillColor: "#D2A272", shapeStrokeColor: "#1D4662", shapeStrokeWidth: 0.5 },
          { id: "shape-bg-name", type: "shape", visible: true, shapeFillColor: "#EDEDED", shapeFillOpacity: 0.7, shapeStrokeColor: "#1D4662", shapeStrokeWidth: 0.5 }
        ]
      },
      {
        visName: VALUE_rankingChangeTextLane,
        visIcon: "generalTextLane.png",
        dataName: "ranking",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
          { id: "shape-arrow-up", type: "shape", visible: true, shapeFillColor: "#1fae4eff", shapeStrokeColor: "#1fae4eff", shapeStrokeWidth: 0 },
          { id: "shape-arrow-down", type: "shape", visible: true, shapeFillColor: "#a72424ff", shapeStrokeColor: "#a72424ff", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_rankingBarCorner,
        visIcon: "generalCorner.png",
        dataName: "ranking",
        triggerRecommendation: "This visualization usually appears after the turn.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: 150,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#062648", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "background-shape-2", type: "shape", visible: true, shapeFillColor: "#BCE9EC", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "text-1", type: "text", visible: true, fontFillColor: "#d3ca16", fontSize: 10 },
          { id: "text-2", type: "text", visible: true, fontFillColor: "#062648", fontSize: 10 },
          { id: "text-3", type: "text", visible: true, fontFillColor: "#062648", fontSize: 10 }
        ]
      },
      {
        visName: VALUE_laneHighlight,
        visIcon: "generalIconLane.png",
        dataName: "ranking",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#c9c9c9", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      }
    ]
  },
  "differenceRecordAndLeader": {
    visList: [
      {
        visName: VALUE_worldRecordSplitDiffCorner,
        visIcon: "generalCorner.png",
        dataName: "differenceRecordAndLeader",
        triggerRecommendation: "This visualization usually appears after the turn.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1-spit-diff-value", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
          { id: "background-shape-smaller", type: "shape", visible: true, shapeFillColor: "#0E5636", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "background-shape-bigger", type: "shape", visible: true, shapeFillColor: "#962028", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
    ]
  },
  "leaderLaneNumber": {
    visList: [
      {
        visName: VALUE_leaderLaneNumberTextCorner,
        visIcon: "generalCorner.png",
        dataName: "leaderLaneNumber",
        triggerRecommendation: "This visualization usually appears after the turn.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: 10 },
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#1B505D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
    ]
  },
  "distanceDived": {
    visList: [
      {
        visName: VALUE_distanceDivedTextLane,
        visIcon: "generalTextLane.png",
        dataName: "distanceDived",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
      {
        visName: VALUE_distanceDivedArrowLane,
        visIcon: "generalIconLane.png",
        dataName: "distanceDived",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "shape-1", type: "shape", visible: true, shapeFillColor: "#ffffff", shapeStrokeColor: "#ffffff", shapeStrokeWidth: 4 }
        ]
      },
    ]
  },
  "lapDistance": {
    visList: [
      {
        visName: VALUE_lapDistanceCorner,
        visIcon: "generalCorner.png",
        dataName: "lapDistance",
        triggerRecommendation: "This visualization usually appears during the turn.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#1B505D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
    ]
  },
  "raceName": {
    visList: [
      {
        visName: VALUE_raceNameCorner,
        visIcon: "generalCorner.png",
        dataName: "raceName",
        triggerRecommendation: "This visualization usually appears during the whole race.",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: 10, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor },
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#1B505D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
    ]
  },
  "strokeCount": {
    visList: [
      {
        visName: VALUE_strokeCountTextLane,
        visIcon: "generalTextLane.png",
        dataName: "strokeCount",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor }
        ]
      },
    ]
  },
  "climb": {
    visList: [
      {
        visName: VALUE_climbCount,
        visIcon: "generalTextLane.png",
        dataName: "climb",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "text-1", type: "text", visible: true, fontSize: DEFAULTSwimFlow2TextControllerFontSize, fontFillColor: DEFAULTSwimFlow2TextControllerFillColor,  }
        ]
      },
      {
        visName: VALUE_climbIcon,
        visIcon: "generalIconLane.png",
        dataName: "climb",
        composeType: embeddedVisTypeComposeType_INDIVIDUAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: true,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#d42121", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
        ]
      },
      {
        visName: VALUE_climbLine,
        visIcon: "generalCorner.png",
        dataName: "climb",
        composeType: embeddedVisTypeComposeType_GLOBAL,
        positionX: DEFAULTSwimFlow2PositionX,
        positionY: DEFAULTSwimFlow2PositionY,
        positionR: DEFAULTSwimFlow2PositionR,
        positionS: DEFAULTSwimFlow2PositionS,
        positionMove: false,
        editableElementList: [
          { id: "shape-1-circle", type: "shape", visible: true, shapeFillColor: "#ff2916", shapeStrokeColor: "#ff2916", shapeStrokeWidth: 2 },
          { id: "shape-2-trial", type: "shape", visible: true, shapeFillColor: "#ff2916", shapeStrokeColor: "#ff2916", shapeStrokeWidth: 1},
          { id: "shape-3-line", type: "shape", visible: true, shapeFillColor: "#ff8075", shapeStrokeColor: "#ff8075", shapeStrokeWidth: 2 }
        ]
      },
    ]
  }
}

// Layer order: from 0 to 1, top to bottom.
// IDs must match those declared in visControllerPanelConfig.
export const editableElementInVisConfig: editableElementInVisConfigType = {
  "elapsedTimeCorner": [
    { id: "text-1", type: "text", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "elapsedTimeLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "VisCustomizedTextGlobal": [
    { id: "text-1", type: "text", visible: true },
  ],
  "VisCustomizedTextIndividual": [
    { id: "text-1", type: "text", visible: true },
  ],
  "nationalityTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "nationalityIconLane": [
    { id: "icon-1", type: "icon", visible: true },
  ],
  "currentSpeedTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "currentSpeedGlyphLane": [
    { id: "color-1", type: "color", visible: true },
    { id: "color-2", type: "color", visible: true },
  ],
  "worldRecordTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "swimmerNameTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "distanceSwumTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "accelerationTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "distanceToLeaderTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "rankingTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "rankingChangeTextLane": [
    { id: "text-1", type: "text", visible: true },
    { id: "shape-arrow-up", type: "shape", visible: true },
    { id: "shape-arrow-down", type: "shape", visible: true },
  ],
  "rankingBarCorner": [
    { id: "background-shape-1", type: "shape", visible: true },
    { id: "background-shape-2", type: "shape", visible: true },
    { id: "text-1", type: "text", visible: true },
    { id: "text-2", type: "text", visible: true },
    { id: "text-3", type: "text", visible: true },
  ],
  "laneHighlight": [
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "worldRecordLine": [
    { id: "shape-1", type: "shape", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
    { id: "line-1", type: "shape", visible: true },
  ],
  "worldRecordSplitCorner": [
    { id: "text-1-spit-value", type: "text", visible: true },
    { id: "shape-1-WR-text", type: "shape", visible: true },
    { id: "shape-2-WR-bg", type: "shape", visible: true },
    { id: "shape-2-split", type: "shape", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "worldRecordSplitDiffCorner": [
    { id: "text-1-spit-diff-value", type: "text", visible: true },
    { id: "background-shape-smaller", type: "shape", visible: true },
    { id: "background-shape-bigger", type: "shape", visible: true },
  ],
  "worldRecordCorner": [
    { id: "text-1-WR-value", type: "text", visible: true },
    { id: "shape-1-WR-text", type: "shape", visible: true },
    { id: "shape-2-WR-bg", type: "shape", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "olympicRecordCorner": [
    { id: "text-1-OR-value", type: "text", visible: true },
    { id: "shape-1-OR-text", type: "shape", visible: true },
    { id: "shape-2-OR-bg", type: "shape", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "distanceSwumTextCorner": [
    { id: "text-1", type: "text", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "lapDistanceCorner": [
    { id: "text-1", type: "text", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "raceNameCorner": [
    { id: "text-1", type: "text", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "rankingFlagLane": [
    { id: "text-ranking", type: "text", visible: true },
    { id: "text-name", type: "text", visible: true },
    { id: "icon-flag", type: "icon", visible: true },
    { id: "shape-bg-ranking", type: "shape", visible: true },
    { id: "shape-bg-name", type: "shape", visible: true },
  ],
  "distanceDivedTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "distanceDivedArrowLane": [
    { id: "shape-1", type: "shape", visible: true },
  ],
  "strokeCountTextLane": [
    { id: "text-1", type: "text", visible: true },
  ],
  "leaderLaneNumberTextCorner": [
    { id: "text-1", type: "text", visible: true },
    { id: "background-shape-1", type: "shape", visible: true },
  ],
  "distanceToLeaderBarLane": [
    { id: "text-1", type: "text", visible: true },
    { id: "shape-bar", type: "shape", visible: true },
  ],
  "distanceSwumBarCorner": [
    { id: "text-1", type: "text", visible: true },
    { id: "shape-bar", type: "shape", visible: true },
    { id: "shape-bar-bg", type: "shape", visible: true },
    { id: "shape-background", type: "shape", visible: true },
  ],
  "top3SpeedLane": [
    { id: "text-speed", type: "text", visible: true },
    { id: "icon-flag", type: "icon", visible: true },
    { id: "shape-bg-speed", type: "shape", visible: true },
  ],
  "top3DistanceGapLane": [
    { id: "text-distance-gap", type: "text", visible: true },
    { id: "icon-flag", type: "icon", visible: true },
    { id: "shape-bg-distance-gap", type: "shape", visible: true },
  ],
  "distanceToLeaderPacManLane": [
    { id: "shape-pac-man", type: "shape", visible: true },
    { id: "shape-food", type: "shape", visible: true },
  ],
  "distanceLeftLane": [
    { id: "text-1", type: "text", visible: true },
    { id: "background-shape-1-start", type: "shape", visible: true },
    { id: "background-shape-1-end", type: "shape", visible: true },
  ],
  "climbCount": [
    { id: "text-1", type: "text", visible: true }
  ],
  "climbLine": [
    { id: "shape-1-circle", type: "shape", visible: true },
    { id: "shape-2-trial", type: "shape", visible: true },
    { id: "shape-3-line", type: "shape", visible: true }
  ],
  "climbIcon": [
    { id: "background-shape-1", type: "shape", visible: true }
  ]
}


// visualization selection panel tooltip introduction
export const visSelectionPanelTooltip: VisSelectionPanelTooltipTitleType = {
  "VisCustomizedIconGlobal": "Customized icon displayed at the screen corner",
  "VisCustomizedIconIndividual": "Customized icon displayed alongside the lane",
  "VisCustomizedTextGlobal": "Customized text displayed at the screen corner",
  "VisCustomizedTextIndividual": "Customized text displayed alongside the lane",
  "elapsedTimeCorner": "Total elapsed time of the race displayed at the screen corner",
  "elapsedTimeLane": "Total elapsed time of the race displayed alongside the lane",
  "nationalityTextLane": "Nationality of the swimmer displayed along the lane",
  "nationalityIconLane": "Nationality flag icon of the swimmer displayed along the lane",
  "currentSpeedTextLane": "Current speed of the swimmer displayed along the lane",
  "currentSpeedGlyphLane": "Icon or glyph representing the current speed of the swimmer along the lane",
  "worldRecordTextLane": "World record time for the event displayed along the lane",
  "swimmerNameTextLane": "Name of the swimmer displayed along the lane",
  "distanceSwumTextLane": "Total distance swum by the swimmer displayed along the lane",
  "accelerationTextLane": "Current acceleration of the swimmer displayed along the lane",
  "distanceToLeaderTextLane": "Distance between the swimmer and the race leader displayed along the lane",
  "rankingTextLane": "Current ranking of the swimmer displayed along the lane",
  "rankingChangeTextLane": "Changed ranking of the swimmer displayed along the lane",
  "rankingBarCorner": "Top3's ranking after turning displayed at the screen corner",
  "laneHighlight": "Highlight selected lanes",
  "worldRecordLine": "",
  "worldRecordSplitCorner": "",
  "climbCount": "",
  "climbLine": "",
  "climbIcon": "",
}