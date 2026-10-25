import { NextResponse } from "next/server";
import { z } from "zod";

import { compareDocuments } from "@/lib/compare";
import { extractComparisonSources } from "@/lib/gemini";

const requestSchema = z.object({
  postingText: z
    .string()
    .trim()
    .min(80, "The job posting is too short to compare.")
    .max(50000, "The job posting is too long."),
  offerText: z
    .string()
    .trim()
    .min(80, "The offer is too short to compare.")
    .max(50000, "The offer is too long."),
});

function getErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const candidate = error as {
    status?: unknown;
    statusCode?: unknown;
  };

  if (typeof candidate.status === "number") {
    return candidate.status;
  }

  if (typeof candidate.statusCode === "number") {
    return candidate.statusCode;
  }

  return undefined;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please provide a complete job posting and offer.",
          details: parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { postingText, offerText } = parsed.data;

    const extraction = await extractComparisonSources(
      postingText,
      offerText,
    );

    const comparison = compareDocuments(
      extraction.posting,
      extraction.offer,
    );

    if (comparison.findings.length === 0) {
      return NextResponse.json(
        {
          error:
            "We couldn't find enough employment terms to compare. Try using the full job posting and offer.",
        },
        {
          status: 422,
        },
      );
    }

    return NextResponse.json({
      comparison,
      sources: {
        postingText,
        offerText,
      },
    });
  } catch (error) {
    console.error("PlotTwist comparison failed:", error);

    const status = getErrorStatus(error);

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "PlotTwist is temporarily receiving too many comparison requests. Please try the comparison again shortly.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "PlotTwist couldn't complete this comparison. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}