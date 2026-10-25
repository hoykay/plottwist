import { NextResponse } from "next/server";
import { z } from "zod";

import { readPublicJobUrl } from "@/lib/url-reader";

const requestSchema = z.object({
  url: z.string().trim().url("Please enter a valid public URL."),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please enter a valid public job-posting URL.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await readPublicJobUrl(parsed.data.url);

    return NextResponse.json({
      text: result.text,
      finalUrl: result.finalUrl,
    });
  } catch (error) {
    console.error("PlotTwist URL reader failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PlotTwist couldn't read this page. Try pasting the job posting instead.",
      },
      {
        status: 422,
      },
    );
  }
}