import { NextResponse } from "next/server";

import { compareDocuments } from "@/lib/compare";
import { extractComparisonPdfs } from "@/lib/pdf-gemini";

const MAX_COMBINED_PDF_BYTES = 4_000_000;

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
    const formData = await request.formData();

    const postingPdf = formData.get("postingPdf");
    const offerPdf = formData.get("offerPdf");

    if (!(postingPdf instanceof File) || !(offerPdf instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload both the original job posting and final offer.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      postingPdf.type !== "application/pdf" ||
      offerPdf.type !== "application/pdf"
    ) {
      return NextResponse.json(
        {
          error: "PlotTwist currently supports PDF uploads only.",
        },
        {
          status: 400,
        },
      );
    }

    if (postingPdf.size === 0 || offerPdf.size === 0) {
      return NextResponse.json(
        {
          error: "One of the uploaded PDFs appears to be empty.",
        },
        {
          status: 400,
        },
      );
    }

    if (postingPdf.size + offerPdf.size > MAX_COMBINED_PDF_BYTES) {
      return NextResponse.json(
        {
          error:
            "These PDFs are too large to compare together. Please use smaller files under 4 MB combined.",
        },
        {
          status: 413,
        },
      );
    }

    const [postingArrayBuffer, offerArrayBuffer] = await Promise.all([
      postingPdf.arrayBuffer(),
      offerPdf.arrayBuffer(),
    ]);

    const extraction = await extractComparisonPdfs(
      Buffer.from(postingArrayBuffer),
      Buffer.from(offerArrayBuffer),
    );

    const comparison = compareDocuments(
      extraction.posting,
      extraction.offer,
    );

    if (comparison.findings.length === 0) {
      return NextResponse.json(
        {
          error:
            "We couldn't find enough employment terms in these PDFs to compare.",
        },
        {
          status: 422,
        },
      );
    }

    return NextResponse.json({
      comparison,
      sourceType: "pdf",
      sources: {
        postingName: postingPdf.name,
        offerName: offerPdf.name,
      },
    });
  } catch (error) {
    console.error("PlotTwist PDF comparison failed:", error);

    const status = getErrorStatus(error);

    if (status === 429 || status === 503) {
      return NextResponse.json(
        {
          error:
            "PlotTwist's document analysis is temporarily busy. Please try again shortly.",
          code: "MODEL_BUSY",
        },
        {
          status,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "PlotTwist couldn't complete this PDF comparison. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}