import { z } from "zod";

export const employmentFieldKeys = [
  "title",
  "salary",
  "workArrangement",
  "pto",
  "bonus",
  "location",
  "workingHours",
  "probation",
  "benefits",
] as const;

export type EmploymentFieldKey = (typeof employmentFieldKeys)[number];

export const extractedTermSchema = z.object({
  key: z.enum(employmentFieldKeys),
  label: z.string(),
  present: z.boolean(),
  displayValue: z.string(),
  normalizedValue: z.string(),
  evidence: z.string(),
});

export const documentExtractionSchema = z.object({
  documentType: z.enum(["job_posting", "offer"]),
  terms: z.array(extractedTermSchema),
});

export const pairedExtractionSchema = z.object({
  posting: documentExtractionSchema,
  offer: documentExtractionSchema,
});

export type ExtractedTerm = z.infer<typeof extractedTermSchema>;
export type DocumentExtraction = z.infer<typeof documentExtractionSchema>;
export type PairedExtraction = z.infer<typeof pairedExtractionSchema>;

const termJsonSchema = {
  type: "object",
  properties: {
    key: {
      type: "string",
      enum: [...employmentFieldKeys],
    },
    label: {
      type: "string",
    },
    present: {
      type: "boolean",
    },
    displayValue: {
      type: "string",
    },
    normalizedValue: {
      type: "string",
    },
    evidence: {
      type: "string",
    },
  },
  required: [
    "key",
    "label",
    "present",
    "displayValue",
    "normalizedValue",
    "evidence",
  ],
  additionalProperties: false,
} as const;

export const documentExtractionJsonSchema = {
  type: "object",
  properties: {
    documentType: {
      type: "string",
      enum: ["job_posting", "offer"],
    },
    terms: {
      type: "array",
      items: termJsonSchema,
    },
  },
  required: ["documentType", "terms"],
  additionalProperties: false,
} as const;

export const pairedExtractionJsonSchema = {
  type: "object",
  properties: {
    posting: documentExtractionJsonSchema,
    offer: documentExtractionJsonSchema,
  },
  required: ["posting", "offer"],
  additionalProperties: false,
} as const;