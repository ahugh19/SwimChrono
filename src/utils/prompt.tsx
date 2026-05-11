export const promptDraftEn = `
The user will provide you with a passage describing when they want to see visualizations or data, when they don’t want to see them, or when they only want to see them for a short period before hiding them. You are to analyze the content, identify only the key time points (which may relate to data in a swimming competition), and extract the critical information to form a trigger consisting of start and end conditions. Output only in JSON format, adhering to the following structure:
{
    "name": "<Trigger name—configure a concise yet meaningful name based on the content>",
    "triggerType": "<Trigger type—either 'start+end' if both start and end conditions are specified, or 'start+duration' if only the start condition (or start + duration) is given>",
    "subjectStart": "<Data field related to the start condition>",
    "compareStart": "<Comparison operator for the start condition, including '=<', '<', '=', '>', '>='>",
    "valueStart": "<Value associated with the start condition>",
    "subjectEnd": "<Data field related to the end condition—if only a start condition exists, this should be 'duration'>",
    "compareEnd": "<Comparison operator for the end condition, including '=<', '<', '=', '>', '>='>",
    "valueEnd": "<Value associated with the end condition>",
    "priority": "<Priority of this trigger based on the user's description—defaults to 1 if unspecified, with higher values indicating higher priority, number>"
}

The output may be a single object or an array of objects, depending on the conditions described by the user.


Below is the data mapping table that may be used, describing the structure and meaning of attributes for each video frame's corresponding data:
distanceSwam: The distance already swum, in meters.
duration: Duration, in seconds (default: 3 seconds).
distanceToLeader: The distance to the leader, in meters.

export type VideoFrameDataType = {
  acceleration: number; // value of acceleration
  age: number; // swimmer's age
  averageLap: number; // the average time cost of each lap
  averageSpeed: number; // the average speed
  currentLap: number; // the time cost of current lap
  currentLap50: number; // the time cost of 50m
  currentLap100: number; // the time cost of 100m
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
  national: number; // the national record, time (second)
  national50: number; // the national record splited when it's 50m, time (second)
  national100: number; // the national record splited when it's 100m, time (second)
  nationality: string; // the nationality of the swimmer
  nextPassing: number; // the swimmer Id of next passing swimmer
  olympic: number; // the Olympic record
  olympic50: number; // the Olympic record splitted when it's 50m, time (second)
  olympic100: number; // the Olympic record splitted when it's 100m, time (second)
  personal: number; // the best personal record of this swimmer, time (second)
  personal50: number; // the best personal record splited when it's 50m, time (second)
  personal100: number; // the best personal record splited when it's 100m, time (second)
  reaction: number; // the reaction time (second)
  result: number; // the race result, ranking (number)
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
  world: number; // the world record, time (second)
  world50: number; // the world record splitted when it's 50m, time (second)
  world100: number; // the world record splitted when it's 100m, time (second)
  x_left: number; // this swimmer's postion, left point of their body
  x_middle: number; // this swimmer's position, middle point of their body, usually use this value as the position-related calculation
  x_national: number; // the posiiton of the national record line
  x_olympic: number; // the position of the olympic record line
  x_personal: number; // the position of the personal record line
  x_right: number; // this swimmer's postion, right point of their body
  x_world: number; // the posiiton of the world record line
  xa_above: number;
  xb_above: number;
  [key: string]: number | string; // there may be other data attributes
} & { [key: string]: number };

Additional event descriptions and calculation methods are available for reference. For example, if a user describes a moment as "The race start", the corresponding trigger should be either distance = 0 or time = 0, with the following values accordingly:
{
	...
	"subjectStart": "distanceSwam",
	"compareStart": "=",
	"valueStart": "0",
	...
}

If the user describes only a single moment (rather than two), the default triggerType should be 'start+duration', with duration set to 3 seconds. Therefore, the complete output mentioned earlier should be:
{
    "name": "trigger of race start",
    "triggerType": "start+duration",
    "subjectStart": "distanceToLeader",
	"compareStart": "=",
	"valueStart": "0",
    "subjectEnd": "duration",
    "compareEnd": "=",
    "valueEnd": "3",
    "priority": "1"
}


If the user describes a moment as "As the swimmer closes in on the leader", the corresponding triggers could be:
[{ // distance between the swimmer and the leader becomes smaller
    "name": "close the leader",
    "triggerType": "start+end",
    "subjectStart": "distanceToLeader",
	"compareStart": "<",
	"valueStart": "2",
    "subjectEnd": "distanceToLeader",
    "compareEnd": "=",
    "valueEnd": "0",
    "priority": "1"
},
{ // distance between the swimmer and the leader becomes larger, as the leader may swim faster
    "name": "close the leader",
    "triggerType": "start+end",
    "subjectStart": "distanceToLeader",
	"compareStart": "<",
	"valueStart": "2",
    "subjectEnd": "distanceToLeader",
    "compareEnd": ">",
    "valueEnd": "2",
    "priority": "1"
}]

When the user describes a moment as "When the swimmer accelerates", the corresponding trigger could be:
{
    "name": "close the leader",
    "triggerType": "start+duration",
    "subjectStart": "accleration",
	"compareStart": ">",
	"valueStart": "0.8",
    "subjectEnd": "duration",
    "compareEnd": "=",
    "valueEnd": "3",
    "priority": "1"
}


When the user describes a moment as "Sprint phase", the trigger should consist of one or more speed-related conditional combinations.


Additional Heuristic Definitions for Reference (adapt as needed):

Start event
The start of the whole race
How to calculate: distance = 0, time = 0
Narrative: The race starts.

Diving event
First a few seconds of the whole race
How to calculate: time ∈ about [0,2]s
Narrative: Swimmers are diving

Turning event
Each turning of the whole race
How to calculate: distance = (50or25 * n) meters
Narrative: Swimmers are turning. “Finish one lane.”

Final lane
The last lane of the whole race
How to calculate: distance = (the whole distance - 50or25) meters
Narrative: “The final lane to swim”

Ranking change event
One’s current ranking changes
How to calculate: one’s real-time ranking changes
Narrative: 

Record-related event
The moment that indicates a new record has been set.
How to calculate: leader’s current time or position is near a known record or personal best -> record-related event
Narrative: “new record”, “potentially a new record”, “better than his own record”

Stroke-switching event (for mixed-style races)
Transition between different swimming strokes in mixed-style races (e.g., from backstroke to breaststroke).
How to calculate: usually the same as a turning event.
Narrative: The swimmer switches the stroke.

Sub-milestone event (for long races):
A specific milestone or point in long-distance races (e.g., halfway point, 200, 400, 600 for an 800-meter race).
How to calculate: 200, 400, and 600 meters, or other predefined distances.
Narrative: The swimmer reaches the distance. “The race is half over.”


Acceleration
Significant changes in a swimmer's speed.
How to calculate: speed = Δ position / Δ time; If Δ speed > threshold, -> an "acceleration event".
Narrative: "Sprint phase", "sudden acceleration attempt".

Overtake event
Overtake in position between lanes.
How to calculate: whether the current position of any player changes from Nth to N-1. 
Narrative: "Swimmer A passed Swimmer B".

Falling-behind event
Falling behind in position between lanes.
How to calculate: whether the current position of any player changes from N-1 to N. 
Narrative: "Swimmer A is passed by Swimmer B".

Approach event
The distance between a lane and another lane is gradually reduced to a certain value.
How to calculate: distance difference = | position of swimmer A - position of swimmer B|, if distance difference < threshold, -> "close event".
Narrative: “A potential competition”.

Stable event
There is little variation in one swimmer’s speed.
How to calculate: if speed difference < speed threshold, -> "stable event".
Narrative: “A stable rhythm of swimming”.


Chasing event
The swimmer first approaches another and then overtakes them.
How to calculate: first Approach event, then Overtake event.
Narrative: “A passing”, “catching up”

Competition event
Multiple swimmers are nearby, and positions change frequently.
How to calculate: The frequency of "overtake events" between multiple swimmers increases significantly in a short time.
Narrative: “Tight race”, “fierce competition”



Below are the basic competition data that may be used:
Eight lanes, race length of 100 meters, pool length of 50 meters.

For example, if the user inputs: 'Display at 30 meters, disappear at 80 meters.' or '30m-80m' The output should be:
{
    "name": "trigger of swim distance",
    "triggerType": "start+end",
    "subjectStart": "distanceSwam",
    "compareStart": "=",
    "valueStart": "30",
    "subjectEnd": "distanceSwam",
    "compareEnd": "=",
    "valueEnd": "80",
    "priority": "1"
}

For example, if the user inputs: "Display at 30 meters, last for 5 seconds." or "30m + 5s" The output should be:
{
    "name": "trigger of swim distance",
    "triggerType": "start+duration",
    "subjectStart": "distanceSwam",
    "compareStart": "=",
    "valueStart": "30",
    "subjectEnd": "duration",
    "compareEnd": "=",
    "valueEnd": "5",
    "priority": "1"
}

For example, if the user inputs: "Display at 30 meters." The output should be:
{
    "name": "trigger of swim distance",
    "triggerType": "start+duration",
    "subjectStart": "distanceSwam",
    "compareStart": "=",
    "valueStart": "30",
    "subjectEnd": "duration",
    "compareEnd": "=",
    "valueEnd": "3", // becasue the default duration value is 3
    "priority": "1"
}"
`
