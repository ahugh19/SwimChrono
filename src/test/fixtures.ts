import { SwimmerVideoDataType, VideoFrameDataType } from "../types"

export function makeFrame(overrides: Partial<VideoFrameDataType> = {}): VideoFrameDataType {
  return {
    acceleration: 0,
    age: 25,
    averageLap: 26,
    averageSpeed: 1.9,
    currentLap: 26,
    currentLeader: 0,
    direction: "advance",
    distanceRemaining: 50,
    distanceSwam: 50,
    distanceToLeader: 0,
    diving: 1,
    elapsed: 30,
    estimatedCompletionTime: 52,
    event: "",
    frameId: 0,
    name: "TEST Athlete",
    national: 51.6,
    nationality: "USA",
    nextPassing: -1,
    olympic: 51.6,
    personal: 51.6,
    reaction: 0.5,
    result: 1,
    resultS: 52.0,
    speed: 1.9,
    speed_national: 1.9,
    speed_olympic: 1.9,
    speed_personal: 1.9,
    speed_world: 1.9,
    strokeCount: 0,
    strokeDistance: 0,
    swimmerId: 0,
    winner: 0,
    world: 51.6,
    x_left: 49.5,
    x_middle: 25,
    x_national: 25,
    x_olympic: 25,
    x_personal: 25,
    x_right: 50.5,
    x_world: 25,
    xa_above: 50.5,
    xb_above: 49.5,
    ...overrides,
  }
}

export function makeSwimmerVideo(): SwimmerVideoDataType {
  // 8 lanes, lane 0 is the leader (largest distanceSwam)
  const lanes: Record<number, VideoFrameDataType> = {}
  for (let i = 0; i < 8; i++) {
    lanes[i] = makeFrame({
      swimmerId: i,
      currentLeader: 0,
      distanceSwam: 50 - i * 2, // lane 0 leads
      distanceToLeader: i * 2,
      currentLap50: 25 - i * 0.1,
      world50: 25.0,
      x_middle: 25 + i,
    } as Partial<VideoFrameDataType>)
  }
  return { 0: lanes }
}
