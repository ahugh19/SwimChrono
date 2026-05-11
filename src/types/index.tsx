///////////////// label tool
// the position of example image, relative to the whole video image
// x1, y1: topleft
// x2, y2: bottomright
export type VisBboxType = {
  x1: number,
  y1: number,
  x2: number,
  y2: number
}

export type VisType = {
  // videoKey-startMoment-x1-y1
  key: string,
  // Vis Start Moment
  startMoment: number,
  // Vis End Moment
  endMoment: number,
  // Visualization
  visType: string[],
  // Data of Vis
  data: string[],
  // Example
  visBbox: VisBboxType,
  // Morph of Vis
  morph: string,
  // Entering Animation of Vis
  enteringAnimation: string,
  // Updating Animation of Vis
  updatingAnimation: string[],
  // Leaving Animation of Vis
  leavingAnimation: string,
  // Movement of Vis
  movement: string,
  // Duration of Vis Display (in second)
  duration: number,
  // Placement of Vis
  placement: string,
  // Placement of Vis Relative to
  placementRelativeTo: string,
  // Camera Shot
  cameraShot: string[],
  // Key Events
  keyEvent: string,
  // Temporal Relation (visualizaiton shows [relation] event)
  temporalRelation: string[],
  // Narrative Connection
  narrativeConnection?: string,
  // Narration
  narrationNote?: string,
  // Note
  note?: string,
  // Issues to solve
  issues?: string,
  // video key
  videoKey: string,
  // vis moment - video start moment
  relativeTimeInfo?: relativeTimeInfoType,
  // whether highlighed case
  highlight: string,
}

export type relativeTimeInfoType = {
  relativeStartMoment: number,
  relativeEndMoment: number,
}

export type VideoType = {
  // url-startmoment
  key: string,
  // raceName: string,
  startMoment: number,
  endMoment: number,
  visList: VisType[],
  gender: string, // "men", "women", "mixed"
  distance: string,
  year: number,
  type: string,
  style: string,
  level: string,
  // url key
  url: string,
  relativeTimeInfo?: relativeTimeInfoType,
}

export type UrlType = {
  // url key
  key: string,
  urlVideoName: string, // the title of this url
  sportsType: string,
  raceLevel: string,
  year: number
}

export type dataType = {
  visList: VisType[],
  videoList: VideoType[],
  urlList: UrlType[]
}

export type EventType = {
  // videoKey-event-startMoment-[keyEvent]
  key: string,
  // interval event or point event
  type: string, // "interval" "point"
  // Vis Start Moment
  startMoment: number,
  // Vis End Moment
  endMoment: number,
  // Key Events
  keyEvent: string,
  // Note
  note?: string,
  // video key
  videoKey: string,
}

export type CameraShotType = {
  // videoKey-camera-startMoment-[cameraShot]
  key: string,
  // Vis Start Moment
  startMoment: number,
  // Key Events
  cameraShot: string,
  // whether this camera shot is in a new clip
  // if true, it means this camera shot is a hard cut from the previous one
  // if false,
  isConnectedToPrevious: string,
  // Note
  note?: string,
  // video key
  videoKey: string,
}

/////////////////////// swimflow 2

export type visControllerPanelConfigType = {
  [key: string]: {
    visList: EmbeddedVisType[]
  }
}

export type editableElementInVisConfigType = {
  [key: string]: EditableElementType[]
}

export type VisSelectionPanelTooltipTitleType = {
  [key: string]: string
}

export type CustomizedIconType = {
  svgContent: string | undefined,
  size: number | undefined,
  visible: boolean
}

export type EmbeddedVisType = {
  visName: string,
  dataName: string,
  visIcon: string,
  composeType: string, // "global", "individual"
  positionX: number, // x
  positionXAndWidthRatio?: number | undefined, // x / video width
  positionY: number, // y
  positionYAndHeightRatio?: number | undefined, // y / video height
  positionR: number, // rotation
  positionS: number, // size
  positionSRatio?: number | undefined, // positionS / video width
  positionMove: boolean, // only work when composeType is individual
  editableElementList: EditableElementType[]
  visibleLanes?: number[], // swimmerId List
  customizedIcon?: CustomizedIconType, // only for customized icon
  customizedText?: string, // only for customized text
  triggerRecommendation?: string, // trigger recommendation
}

export type VisTriggerType = {
  video: VideoType,
  visList: VisType[],
}

export type JSLayerType = {
  uuid: string,
  isSelected: boolean,
  visibility: string, // "none", "block"
  name: string,
  properties: undefined | any,
  intervalList: VisIntervalType[] | null,
  triggerCompList: TriggerCompType[] | null
}

export type LayerType = {
  uuid: string,
  isSelected: boolean,
  visibility: boolean,
  name: string,
  intervalList: VisIntervalType[] | null,
  triggerCompList: TriggerCompType[] | null,
  embeddedVis: EmbeddedVisType | null,
}

export type TriggerIndividualType = {
  subject: string,
  value: number,
}

export type TriggerUpdateType = TriggerIndividualType & {
  visConfig: any
}

export type TriggerCompType = {
  name: string,
  triggerType: string,
  priority: number | string,

  subjectStart: string,
  compareStart: string,
  valueStart: number | string,

  subjectEnd: string,
  compareEnd: string,
  valueEnd: number | string
}

export type TriggerFormProps = {
  triggerCompList: TriggerCompType[] | null
}

export type JSControllerPropertiesType = any

export type VideoFrameDataType = {
  acceleration: number; // value of acceleration
  age: number; // swimmer's age
  averageLap: number; // the average time cost of each lap
  averageSpeed: number; // the average speed
  currentLap: number; // the time cost of current lap
  currentLeader: number; // the swimmer id of current Leader
  direction: string; // "advance" (the direction from right to left), "return" (the directiopn from left to right)
  distanceRemaining: number; // the remaining distance to swim
  distanceSwam: number; // the distance swum
  distanceToLeader: number; // the distance gap to the leader
  diving: number; // the time cost of diving
  elapsed: number; //  the elapsed time of the race (current moment)
  estimatedCompletionTime: number; // the estimated completion Time
  event: string; // the event name, "turn", "start", "end"
  frameId: number; // the frame Id
  name: string; // the name of swimmers
  national: number | string; // the national record, time (second)
  nationality: string; // the nationality of the swimmer
  nextPassing: number; // the swimmer Id of next passing swimmer
  olympic: number | string; // the Olympic record
  personal: number | string; // the best personal record of this swimmer, time (second)
  reaction: number; // the reaction time (second)
  result: number | string; // the race result, ranking (number)
  resultS: number; // the race result, time (second)
  speed: number; // the speed of this swimmer, (meter per second)
  speed_national: number; // the speed of national record, (meter per second)
  speed_olympic: number; // the speed of national record, (meter per second)
  speed_personal: number; // the speed of personal record, (meter per second)
  speed_world: number; // the speed of world record, (meter per second)
  strokeCount: number; // the stroke count of this swimmer
  strokeDistance: number; // the stroke distance of this swimmer
  swimmerId: number; // the swimmer Id
  winner: number; // the swimmer Id of the winner
  world: number | string; // the world record, time (second)
  x_left: number; // this swimmer's postion, left point of their body
  x_middle: number; // this swimmer's position, middle point of their body, usually use this value as the position-related calculation
  x_national: number; // the posiiton of the national record line
  x_olympic: number; // the position of the olympic record line
  x_personal: number; // the position of the personal record line
  x_right: number; // this swimmer's postion, right point of their body
  x_world: number; // the posiiton of the world record line
  xa_above: number;
  xb_above: number;


  // --- common but optional split times (marked optional with ?) ---
  world50?: number;
  world100?: number;
  world150?: number;
  world200?: number;
  world250?: number;
  world300?: number;
  world350?: number;
  world400?: number;
  olympic50?: number;
  olympic100?: number;
  olympic150?: number;
  olympic200?: number;
  olympic250?: number;
  olympic300?: number;
  olympic350?: number;
  olympic400?: number;
  personal50?: number;
  personal100?: number;
  personal150?: number;
  personal200?: number;
  personal250?: number;
  personal300?: number;
  personal350?: number;
  personal400?: number;
  national50?: number;
  national100?: number;
  national150?: number;
  national200?: number;
  national250?: number;
  national300?: number;
  national350?: number;
  national400?: number;
  currentLap50?: number;
  currentLap100?: number;
  currentLap150?: number;
  currentLap200?: number;
  currentLap250?: number;
  currentLap300?: number;
  currentLap350?: number;
  currentLap400?: number;
  
  // --- index signature: catch every other possible field ---
  // For example: world150, world200, currentLap150, currentLap200, ...
  // The value type must be a superset of every concrete field type.
  // number | string | undefined safely covers every case.
  [key: string]: number | string | undefined
}

export type SwimmerStatsType = { [key: string]: number; }

export type SwimmerVideoFrameType = { [key: number]: VideoFrameDataType }


export type SwimmerVideoDataType = {
  [frameId: number]: SwimmerVideoFrameType | null
};

export type SwimmerInfoType = {
  name: string,
  nationality: string,
  swimmerId: number,
}

export type VideoObjType = {
  // url
  key: string,
  startMomentInS: number,
  endMomentInS: number,
  frames: SwimmerVideoDataType,
  framerate: number,
  lanes: number,
  url: string,

  distance: number,
  poolLapLength: number, // the length of one lap
  gender: string, // "men", "women", "mixed"
  year: number,
  type: string,
  style: string,
  level: string,
}

export type VideoMetaDataType = {
  name: string,
  lanes: number,
  raceStartTime: number, // startMomentInS
  dataCSV: string,
  framerate: number,
  distance: number,
  poolLapLength: number, // the length of one lap
  gender: string, // "men", "women", "mixed"
  year: number,
  type: string,
  style: string,
  level: string,
  video: string, // video url
  videoName: string,
  note: string,
  swimmersInfo: SwimmerInfoType[],
}

export type ConfigurationType = LayerType[]

export type ExampleType = {
  videoName: string,
  exampleName: string,
  configuration: ConfigurationType
}

export type VisIntervalType = {
  startFrame: number,
  endFrame: number,
  triggerConfig: TriggerCompType,
  relativeStartMoment: number, // the start timestamp of visualization segment - the start timestamp of video,
  relativeEndMoment: number, // the end timestamp of visualization segment - the start timestamp of video
  duration: number,
  isMerged: boolean,
  mergedTriggers: TriggerCompType[],
}

export type EditableElementType = {
  id: string,
  type: string,
  visible: boolean,
  x?: number,
  y?: number
  fontSize?: number,
  fontFillColor?: string,
  shapeFillColor?: string,
  shapeFillOpacity?: number,
  shapeStrokeColor?: string,
  shapeStrokeWidth?: number,
  iconSize?: number,
  customizedSvgSize?: number,
}

export type GlobalSettingType = {
  blur: number, // to make svg can better merged in the low-resolution video
  minDuration: number, // the min duration of visualization intervals
}