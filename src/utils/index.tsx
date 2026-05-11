import { VisBboxType, UrlType, VideoType, VisType, EventType, CameraShotType, VideoMetaDataType, TriggerFormProps, SwimmerVideoFrameType, VisIntervalType, SwimmerStatsType, SwimmerVideoDataType, GlobalSettingType } from "../types"
import _ from "lodash";
import { COMPARE_EQUAL, COMPARE_GREATER, COMPARE_GREATER_AND_EQUAL, COMPARE_SMALLER, COMPARE_SMALLER_AND_EQUAL, TRIGGER_COMP_START_END, TRIGGER_COMP_START_DURATION, subjectListUnitMeter, subjectListUnitSecond, subjectListUnitMeterPerSquareSecond, videoMetaDataList, DEFAULTSwimFlow2GLOBAL_blur, DEFAULTSwimFlow2GLOBAL_minDuration } from "./values";
import { useEffect, useRef } from 'react';
import { message } from "antd";
import { flagBE, flagGB, flagCA, flagCH, flagESP, flagFR, flagIT, flagNL, flagRSA, flagUS, flagGRE, flagCHN, flagJPN } from "./flag";

export function formatTimeNumber(v: number) {
  return `${v > 10 ? v.toString() : "0" + v.toString()}`
}

export function formatTime(time: number | undefined) {
  if (time === undefined) {
    return formatTime(0)
  } else {
    const hour = Math.floor(time / 3600)
    const minute = Math.floor((time - hour * 3600) / 60)
    const second = Math.floor(time - hour * 3600 - minute * 60)
    const mSecond = time - hour * 3600 - minute * 60 - second
    return `${formatTimeNumber(hour)}:${formatTimeNumber(minute)}:${formatTimeNumber(second)}.${mSecond.toFixed(3).toString().split(".")[1]}`
    // return `${formatTimeNumber(hour)}:${formatTimeNumber(minute)}:${formatTimeNumber(second)}`  
  }
}

export const testVisItem: VisType = {
  // videoKey-startMoment-x1-y1
  key: "videoKey-startMoment-x1-y1",
  // Vis Start Moment
  startMoment: 0,
  // Vis End Moment
  endMoment: 1,
  // Visualization
  visType: ["number", "flag icon", "text"],
  // Data of Vis
  data: ["lane number", "nation flag", "nation abbreviation", "last name"],
  // Example
  visBbox: {
    x1: 1, y1: 1, x2: 2, y2: 2
  },
  // Morph of Vis
  morph: "Corresponding to the camera perspective",
  // Entering Animation of Vis
  enteringAnimation: "hard cut",
  // Updating Animation of Vis
  updatingAnimation: ["none"],
  // Leaving Animation of Vis
  leavingAnimation: "hard cut",
  // Movement of Vis
  movement: "static",
  // Duration of Vis Display (in second)
  duration: 7,
  // Placement of Vis
  placement: "player",
  // Placement of Vis Relative to
  placementRelativeTo: "front",
  // Camera Shot
  cameraShot: ["others"],
  // Key Events
  keyEvent: "Race Start",
  // Temporal Relation (visualizaiton shows [relation] event)
  temporalRelation: ["before"],
  // Narrative Connection
  narrativeConnection: "none",
  // Narration
  narrationNote: "none",
  // Notes
  note: "none",
  // Issues to solve
  issues: "none",
  highlight: "false",
  // video key
  videoKey: "https://www.youtube.com/watch?v=9sHPbtj5Tj8-0"
}

export const testVis: VisType[] = [
  testVisItem
]

export const testVideoItem: VideoType = {
  key: "https://www.youtube.com/watch?v=9sHPbtj5Tj8-0",
  type: "individual",
  year: 2020,
  style: "freestyle",
  startMoment: 0,
  endMoment: 1,
  visList: testVis,
  gender: "men",
  distance: "1500m",
  level: "final",
  url: "https://www.youtube.com/watch?v=9sHPbtj5Tj8"
}

export function initVideoData(): VideoType[] {
  return []
}

export function initVisData(): VisType[] {
  return []
}

export function initUrlList(): UrlType[] {
  return []
}

export function initEventList(): EventType[] {
  return []
}

export function initCameraShotList(): CameraShotType[] {
  return []
}

export function initPos(): VisBboxType {
  return {
    x1: -1, y1: -1,
    x2: -1, y2: -1
  }
}

// export function findVideoByKey(videoKey: string, videoList: VideoType[]) {
//   videoList.filter
// }

export function initVisTriggerData() {
  return {
    video: testVideoItem,
    visList: testVis
  }
}

export function initVideoMetaData() {
  return videoMetaDataList[0]
}

export function initGlobalSetting() {
  const defaultGlobalSetting: GlobalSettingType = {
    blur: DEFAULTSwimFlow2GLOBAL_blur,
    minDuration: DEFAULTSwimFlow2GLOBAL_minDuration
  }
  return defaultGlobalSetting
}

export function arrangeGanttItems(listInput: VisType[]): VisType[][] {
  listInput.sort((a, b) => a.startMoment - b.startMoment)
  const rows: VisType[][] = [];
  for (const item of listInput) {
    let placed = false;
    // First try to find a row that already holds items with the same data and no time conflict.
    for (const row of rows) {
      if (row.some(rowItem => _.isEqual(rowItem.data, item.data)) &&
        row.every(rowItem => rowItem.endMoment <= item.startMoment)) {
        row.push(item);
        placed = true;
        break;
      }
    }
    // Otherwise, fall back to any non-conflicting row.
    if (!placed) {
      for (const row of rows) {
        if (row.every(rowItem => rowItem.endMoment <= item.startMoment)) {
          row.push(item);
          placed = true;
          break;
        }
      }
    }
    // Still nothing fits — create a new row.
    if (!placed) {
      rows.push([item]);
    }
  }
  return rows;
}

export function getSymbol(compareStr: string) {
  let res = "="
  switch (compareStr) {
    case COMPARE_EQUAL:
      res = "==="
      break;
    case COMPARE_GREATER:
      res = ">"
      break;
    case COMPARE_GREATER_AND_EQUAL:
      res = ">"
      break;
    case COMPARE_SMALLER:
      res = "<"
      break;
    case COMPARE_SMALLER_AND_EQUAL:
      res = "<="
      break;
    default:
      break
  }
  return res
}

export function compare(a: any, operator: string, b: any): boolean {
  if (operator === COMPARE_EQUAL || operator === "=") {
    if (typeof a === "string") {
      return a === b
    } else {
      return Math.abs(a - b) <= 0.1;
    }
  } else if (operator === COMPARE_GREATER_AND_EQUAL || operator === ">=") {
    return a >= b;
  } else if (operator === COMPARE_SMALLER_AND_EQUAL || operator === "<=") {
    return a <= b;
  } else if (operator === COMPARE_GREATER || operator === ">") {
    return a > b;
  } else if (operator === COMPARE_SMALLER || operator === "<") {
    return a < b;
  } else {
    throw new Error(`Unsupported operator: ${operator}`);
  }
};

export function getLeaderKeyInOneFrame(frame: SwimmerVideoFrameType) {
  let maxDistanceSwam = -1;
  let keyOfMaxDistance = null;
  // Walk each key/value pair.
  for (const [key, value] of Object.entries(frame)) {
    if (value.distanceSwam > maxDistanceSwam) {
      maxDistanceSwam = value.distanceSwam;
      keyOfMaxDistance = key as unknown as number;
    }
  }

  return keyOfMaxDistance;
}

export function getMyKeyInOneFrame(frame: SwimmerVideoFrameType) {
  return 3;
}

export function getMaxFrame(frames: SwimmerVideoDataType) {
  // Pull every key, parse as number, return the maximum.
  const maxKey: number = Math.max(...Object.keys(frames).map(key => parseInt(key, 10)));
  return maxKey
}

// On overlap, keep only the higher-priority interval.
export function clearIntervals(intervals: VisIntervalType[]) {
  // The input array is already ordered by layer priority, so we don't sort here.
  let result: VisIntervalType[] = [];

  // Iterate each layer.
  intervals.forEach((current) => {
    let isAdded = false;

    // Walk the result list and check whether the current layer overlaps any existing entry.
    for (let i = 0; i < result.length; i++) {
      let { startFrame, endFrame } = result[i];
      result[i].triggerConfig = current.triggerConfig
      // The current layer overlaps an existing interval.
      if (!(current.endFrame < startFrame || current.startFrame > endFrame)) {
        // The existing entry already has higher priority; nothing to update.
        // Bail out of the inner loop.
        isAdded = true;
        break;
      }
    }

    // No overlap with any existing interval — append to the result list.
    if (!isAdded) {
      result.push(current);
    }
  });

  // Return the resolved list.
  return result;
}

// Compute the union (merge contiguous / nearby intervals).
function mergeIntervals(intervals: VisIntervalType[], videoMetaData: VideoMetaDataType) {
  if (intervals.length === 0) return [];

  // Sort by start time.
  intervals.sort((a, b) => a.startFrame - b.startFrame);

  let result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = result[result.length - 1];
    const current = intervals[i];

    // If the current interval starts before (or right after) the previous one ends, merge them.
    if (current.startFrame <= prev.endFrame || (current.startFrame - prev.endFrame) <= 50) {
      prev.endFrame = Math.max(prev.endFrame, current.endFrame); // expand to the later end
      prev.relativeEndMoment = Math.max(prev.relativeEndMoment, current.relativeEndMoment)
      prev.duration = (prev.endFrame / videoMetaData.framerate) - (prev.startFrame / videoMetaData.framerate)
      prev.isMerged = true
      prev.mergedTriggers = prev.mergedTriggers.length > 0 ? [...prev.mergedTriggers, current.triggerConfig] : [prev.triggerConfig, current.triggerConfig]
    } else {
      result.push(current);
    }
  }

  console.log(result)
  return result;
}

// Map the user-selected subject onto its raw data field.
export function getSwimmerValue(swimmer: SwimmerStatsType, triggerSubject: string) {
  let value = swimmer[triggerSubject]
  return value
}

export function calIntervalByTrigger(videoMetaData: VideoMetaDataType, frames: SwimmerVideoDataType, triggerFormValues: TriggerFormProps | null) {
  console.log(videoMetaData, frames, triggerFormValues)

  if (!triggerFormValues) return []
  if (!triggerFormValues.triggerCompList) return []
  // sort by priority
  triggerFormValues.triggerCompList.sort((a, b) => (a.priority as number) - (b.priority as number))
  const intervals: VisIntervalType[] = []
  triggerFormValues.triggerCompList.forEach((triggerConfig, i) => {
    let startFrame: number | undefined = undefined;
    let endFrame: number | undefined = undefined;
    let inActiveSegment = false; // whether we're currently inside a matched segment
    const minIntervalFrames = Math.round(videoMetaData.framerate * 0.2); // require at least 0.2 s of frames

    console.log(triggerConfig);

    for (const [frameId, frame] of Object.entries(frames)) {
      if (!frame) continue;

      const leaderAttributeValue = frame[getLeaderKeyInOneFrame(frame) as number]?.[triggerConfig.subjectStart];
      const frameNumber = parseInt(frameId, 10);

      // Step 1: find the first frame that matches the start condition.
      if (!inActiveSegment && compare(leaderAttributeValue, triggerConfig.compareStart, triggerConfig.valueStart)) {
        startFrame = frameNumber;
        inActiveSegment = true; // entered an active segment
        continue;
      }

      // Step 2: while inside the active segment, keep extending endFrame as long as the end condition holds.
      if (startFrame !== undefined && inActiveSegment) {
        if (triggerConfig.triggerType === TRIGGER_COMP_START_END) {
          if (compare(leaderAttributeValue, triggerConfig.compareEnd, triggerConfig.valueEnd)) {
            endFrame = frameNumber; // keep advancing so endFrame stays at the latest matching frame
          } else if (endFrame !== undefined) {
            // First frame that fails the end condition — the previous one was the real endFrame.
            if (endFrame >= startFrame + minIntervalFrames) {
              intervals.push({
                triggerConfig,
                startFrame,
                endFrame,
                relativeStartMoment: startFrame / videoMetaData.framerate,
                relativeEndMoment: endFrame / videoMetaData.framerate,
                duration: (endFrame - startFrame) / videoMetaData.framerate,
                isMerged: false,
                mergedTriggers: [],
              });
            }

            // Reset and wait for the next start.
            startFrame = undefined;
            endFrame = undefined;
            inActiveSegment = false;
          }
        } else if (triggerConfig.triggerType === TRIGGER_COMP_START_DURATION) {
          endFrame = startFrame + videoMetaData.framerate * (triggerConfig.valueEnd as number);
          endFrame = Math.min(endFrame, getMaxFrame(frames)); // clamp to the last frame

          if (frameNumber >= endFrame) {
            if (endFrame >= startFrame + minIntervalFrames) {
              intervals.push({
                triggerConfig,
                startFrame,
                endFrame,
                relativeStartMoment: startFrame / videoMetaData.framerate,
                relativeEndMoment: endFrame / videoMetaData.framerate,
                duration: (endFrame - startFrame) / videoMetaData.framerate,
                isMerged: false,
                mergedTriggers: [],
              });
            }

            startFrame = undefined;
            endFrame = undefined;
            inActiveSegment = false;
          }
        }
      }
    }

  })


  console.log(`initial intervals:`, intervals);
  // console.log(`final intervals: ${JSON.stringify(clearIntervals(intervals))}`);
  // console.log("final intervals", JSON.parse(JSON.stringify(mergeIntervals(intervals, videoMetaData))));
  return mergeIntervals(intervals, videoMetaData)
}

export function useDeepEffect(callback: any, dependencies: any) {
  const currentDependenciesRef = useRef();

  if (!_.isEqual(currentDependenciesRef.current, dependencies)) {
    console.log('Dependencies changed');
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
}

export function getNumberUnit(subjectName: string) {
  let unit = ""
  if (subjectListUnitMeter.indexOf(subjectName) !== -1) {
    unit = "m"
  } else if (subjectListUnitMeterPerSquareSecond.indexOf(subjectName) !== -1) {
    unit = "m/ss"
  } else if (subjectListUnitSecond.indexOf(subjectName) !== -1) {
    unit = "s"
  }
  return unit
}

export function generateUUID() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

const countryFlags = {
  "France": "FR",
  "FR": "FR",
  "Belgium": "BE",
  "BE": "BE",
  "Netherlands": "NL",
  "netherlands": "NL"
};

export function getFlagEmoji(countryName: string) {
  if (!Object.keys(countryFlags).includes(countryName)) return
  //@ts-ignore
  const countryCode = countryFlags[countryName];
  if (!countryCode) {
    message.error("error in finding country emoji: empty")
  }
  const firstLetter = countryCode.charCodeAt(0) - 65 + 0x1F1E6;
  const secondLetter = countryCode.charCodeAt(1) - 65 + 0x1F1E6;
  return String.fromCodePoint(firstLetter, secondLetter);
}

export function downloadJson(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export async function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      resolve(e.target?.result)
      message.success(`JSON File ${file.name} reading succeeded`)
    };
    reader.onerror = function (e) {
      // Rejecting the promise if there's an error
      reject(new Error(`JSON File ${file.name} reading failed`))
      message.error(`JSON File ${file.name} reading failed`)
    };
    reader.readAsText(file)
  });
}


export function hexToRgb(hex: string) {
  // Convert hex to rgb.
  let r = 0, g = 0, b = 0;
  // 3-digit hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6-digit hex
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}

export function lerp(start: number, end: number, t: number) {
  // Linear interpolation.
  return start + (end - start) * t;
}

export function getGradientColor(percentage: number, colorA: string, colorB: string) {
  const t = percentage / 100;
  // Parse colour A and colour B.
  const { r: rA, g: gA, b: bA } = hexToRgb(colorA);
  const { r: rB, g: gB, b: bB } = hexToRgb(colorB);

  // Compute the interpolated colour.
  const r = Math.round(lerp(rA, rB, t));
  const g = Math.round(lerp(gA, gB, t));
  const b = Math.round(lerp(bA, bB, t));

  return `rgb(${r}, ${g}, ${b})`;
}

// netherlands, NL, nl.svg
// france, FR, fr.svg
// canada, CA, ca.svg
// switzerland, CH, ch.svg
// BE, be.svg

export function getFlagSVG(nation: string | null) {

  if (!nation) return ""

  let flag = ''

  switch (nation) {
    case "netherlands":
      flag = flagNL
      break
    case "NL":
      flag = flagNL
      break
    case "france":
      flag = flagFR
      break
    case "FR":
      flag = flagFR
      break
    case "canada":
      flag = flagCA
      break
    case "CA":
      flag = flagCA
      break
    case "switzerland":
      flag = flagCH
      break
    case "CH":
      flag = flagCH
      break
    case "BE":
      flag = flagBE
      break
    case "CHN":
      flag = flagCHN
      break
    case "ITA":
      flag = flagIT
      break
    case "RSA":
      flag = flagRSA
      break
    case "GRE":
      flag = flagGRE
      break
    case "ESP":
      flag = flagESP
      break
    case "GBR":
      flag = flagGB
      break
    case "USA":
      flag = flagUS
      break
    case "FRA":
      flag = flagFR
      break
    case "JPN":
      flag = flagJPN
      break
    case "CAN":
      flag = flagCA
      break
    default:
      flag = flagFR
      break
  }
  return flag
}

export function getNationAbbr(nation: string | null) {
  if (!nation) return
  if (nation.length === 3) return nation.toUpperCase()
  let abbr = ''

  switch (nation) {
    case "netherlands":
      abbr = "NLD"
      break
    case "NL":
      abbr = "NLD"
      break
    case "france":
      abbr = "FRA"
      break
    case "FR":
      abbr = "FRA"
      break
    case "canada":
      abbr = "CAN"
      break
    case "CA":
      abbr = "CAN"
      break
    case "switzerland":
      abbr = "CHE"
      break
    case "CH":
      abbr = "CHE"
      break
    case "BE":
      abbr = "BEL"
      break
    default:
      abbr = "FRA"
      break
  }
  return abbr
}

export function scaleConstantValue(constantValue: number, s: number) {
  return constantValue * s / 100
}