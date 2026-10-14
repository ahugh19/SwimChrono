import { z } from "zod";
import { ConfigurationType, LayerType } from "./index";

// Zod schema for EditableElementType
const EditableElementSchema = z.object({
  id: z.string(),
  type: z.string(),
  visible: z.boolean(),
  x: z.number().optional(),
  y: z.number().optional(),
  fontSize: z.number().optional(),
  fontFillColor: z.string().optional(),
  shapeFillColor: z.string().optional(),
  shapeFillOpacity: z.number().optional(),
  shapeStrokeColor: z.string().optional(),
  shapeStrokeWidth: z.number().optional(),
  iconSize: z.number().optional(),
  customizedSvgSize: z.number().optional(),
});

// Zod schema for CustomizedIconType
const CustomizedIconSchema = z.object({
  svgContent: z.string().optional(),
  size: z.number().optional(),
  visible: z.boolean()
});

// Zod schema for EmbeddedVisType
const EmbeddedVisSchema = z.object({
  visName: z.string(),
  dataName: z.string(),
  visIcon: z.string(),
  composeType: z.string(),
  positionX: z.number(),
  positionXAndWidthRatio: z.number().optional(),
  positionY: z.number(),
  positionYAndHeightRatio: z.number().optional(),
  positionR: z.number(),
  positionS: z.number(),
  positionSRatio: z.number().optional(),
  positionMove: z.boolean(),
  editableElementList: z.array(EditableElementSchema),
  visibleLanes: z.array(z.number()).optional(),
  customizedIcon: CustomizedIconSchema.optional(),
  customizedText: z.string().optional(),
});

// Zod schema for TriggerCompType
export const TriggerCompSchema = z.object({
  name: z.string(),
  triggerType: z.string(),
  priority: z.union([z.number(), z.string()]),
  subjectStart: z.string(),
  compareStart: z.string(),
  valueStart: z.union([z.number(), z.string()]),
  subjectEnd: z.string(),
  compareEnd: z.string(),
  valueEnd: z.union([z.number(), z.string()]),
});

// Zod schema for VisIntervalType
const VisIntervalSchema = z.object({
  startFrame: z.number(),
  endFrame: z.number(),
  triggerConfig: TriggerCompSchema,
  relativeStartMoment: z.number(),
  relativeEndMoment: z.number(),
  duration: z.number(),
  isMerged: z.boolean(),
  mergedTriggers: z.array(TriggerCompSchema),
});

// Zod schema for LayerType
const LayerSchema = z.object({
  uuid: z.string(),
  isSelected: z.boolean(),
  visibility: z.boolean(),
  name: z.string(),
  intervalList: z.array(VisIntervalSchema).nullable(),
  triggerCompList: z.array(TriggerCompSchema).nullable(),
  embeddedVis: EmbeddedVisSchema.nullable(),
});

// Zod schema for ConfigurationType
const ConfigurationSchema = z.array(LayerSchema);

// validation function
export function validateConfiguration(json: unknown): json is ConfigurationType {
  try {
    // run Zod validation against the input
    ConfigurationSchema.parse(json);
    return true; // valid
  } catch (error) {
    console.error("Validation failed:", error);
    return false; // invalid
  }
}

// Versioned export envelope (since app 1.2.0). Bump CONFIG_FORMAT_VERSION
// when the layer schema changes incompatibly and add a migration below.
export const CONFIG_FORMAT_VERSION = 1

const ConfigurationEnvelopeSchema = z.object({
  format: z.number().int().positive(),
  appVersion: z.string().optional(),
  video: z.string().optional(),
  exportedAt: z.string().optional(),
  layers: ConfigurationSchema,
});

export interface NormalizedConfiguration {
  layers: LayerType[]
  video?: string
  format: number
}

// Accepts either the legacy bare layer array or the versioned envelope and
// returns the layers in the current in-memory shape, or null if invalid.
export function normalizeConfiguration(json: unknown): NormalizedConfiguration | null {
  if (Array.isArray(json)) {
    return validateConfiguration(json) ? { layers: json as LayerType[], format: 0 } : null
  }
  const parsed = ConfigurationEnvelopeSchema.safeParse(json)
  if (!parsed.success) {
    console.error("Validation failed:", parsed.error)
    return null
  }
  if (parsed.data.format > CONFIG_FORMAT_VERSION) {
    console.error(`Configuration format ${parsed.data.format} is newer than supported ${CONFIG_FORMAT_VERSION}`)
    return null
  }
  return { layers: parsed.data.layers as LayerType[], video: parsed.data.video, format: parsed.data.format }
}
