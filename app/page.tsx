"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type InputMode = "upload" | "paste" | "link";

function UploadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SourceCard({
  number,
  title,
  fieldName,
  subtitle,
}: {
  number: string;
  title: string;
  fieldName: string;
  subtitle: string;
}) {
  const [mode, setMode] = useState<InputMode>("upload");
  const [selectedFileName, setSelectedFileName] = useState("");

  return (
    <section className="rounded-[24px] border border-[#e4e1db] bg-[#fdfcf9] p-5 shadow-[0_12px_32px_rgba(35,49,77,0.035)] sm:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#23314d] text-sm font-semibold text-white">
          {number}
        </div>

        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#171717]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#77756f]">{subtitle}</p>
        </div>
      </div>

      <div className="mb-5 flex rounded-xl bg-[#f1efea] p-1">
        {(["upload", "paste", "link"] as InputMode[]).map((item) => {
          const label =
            item === "upload" ? "Upload" : item === "paste" ? "Paste text" : "Link";

          return (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`flex-1 rounded-[9px] px-3 py-2 text-sm font-medium transition ${
                mode === item
                  ? "bg-white text-[#171717] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-[#77756f] hover:text-[#171717]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {mode === "upload" && (
        <label className="group flex min-h-[155px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-[#cbc7bf] bg-[#fbfaf7] px-6 text-center transition hover:border-[#9a968d] hover:bg-[#f8f6f1]">
          <input
  type="file"
  name={fieldName === "postingText" ? "postingPdf" : "offerPdf"}
  accept="application/pdf,.pdf"
  onChange={(event) =>
  setSelectedFileName(event.target.files?.[0]?.name ?? "")
}
  className="hidden"
/>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#efede7] text-[#23314d] transition group-hover:bg-[#e8e5de]">
            <UploadIcon />
          </div>

          <p className="font-medium text-[#222222]">
  {selectedFileName || "Drop a PDF here"}
</p>
          <p className="mt-1 text-sm text-[#8a877f]">or click to browse</p>

          <span className="mt-5 text-xs text-[#aaa69d]">PDF · Max 10 MB</span>
        </label>
      )}

      {mode === "paste" && (
        <textarea
        name={fieldName}
          placeholder="Paste the document text here..."
          className="min-h-[155px] w-full resize-none rounded-[18px] border border-[#dedbd4] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#242424] outline-none transition placeholder:text-[#aaa69d] focus:border-[#23314d]"
        />
      )}

      {mode === "link" && (
        <div className="flex min-h-[155px] flex-col justify-center rounded-[18px] border border-[#dedbd4] bg-[#fbfaf7] p-5">
          <label className="mb-2 text-sm font-medium text-[#3b3935]">
            Public document or job-posting link
          </label>
          <input
            type="url"
            name={fieldName === "postingText" ? "postingUrl" : "offerUrl"}
            placeholder="https://..."
            className="w-full rounded-xl border border-[#dedbd4] bg-white px-4 py-3 text-sm text-[#242424] outline-none transition placeholder:text-[#aaa69d] focus:border-[#23314d]"
          />
          <p className="mt-3 text-xs leading-5 text-[#96928a]">
            Some job websites may block automated reading. You can always upload or
            paste the text instead.
          </p>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const router = useRouter();

const [isComparing, setIsComparing] = useState(false);
const [compareError, setCompareError] = useState("");
const [loadingStep, setLoadingStep] = useState(1);
const [comparisonFailed, setComparisonFailed] = useState(false);

async function handleCompare(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const postingText = String(
    formData.get("postingText") ?? "",
  ).trim();

  const offerText = String(
    formData.get("offerText") ?? "",
  ).trim();

  const postingPdf = formData.get("postingPdf");
  const offerPdf = formData.get("offerPdf");
  
  const postingUrl = String(
  formData.get("postingUrl") ?? "",
).trim();

const offerUrl = String(
  formData.get("offerUrl") ?? "",
).trim();

  const hasPostingPdf =
    postingPdf instanceof File && postingPdf.size > 0;

  const hasOfferPdf =
    offerPdf instanceof File && offerPdf.size > 0;
    
    const hasPostingUrl = postingUrl.length > 0;
const hasOfferUrl = offerUrl.length > 0;

  const hasPostingText = postingText.length >= 80;
  const hasOfferText = offerText.length >= 80;

  const isPdfComparison = hasPostingPdf && hasOfferPdf;
  const isTextComparison = hasPostingText && hasOfferText;
  const isUrlComparison = hasPostingUrl && hasOfferUrl;

  const isJobUrlWithOfferText =
  hasPostingUrl && hasOfferText;

  if (
  !isPdfComparison &&
  !isTextComparison &&
  !isUrlComparison &&
  !isJobUrlWithOfferText
) {
    setCompareError(
      "Please add enough content to both documents. Pasted text should be at least 80 characters. You can also upload two PDFs or use a public job-posting link with a pasted offer.",
    );
    return;
  }

  setCompareError("");
setComparisonFailed(false);
setLoadingStep(1);
setIsComparing(true);

await new Promise((resolve) => setTimeout(resolve, 300));
setLoadingStep(2);

try {
    let response: Response;

    if (isPdfComparison) {
      const pdfFormData = new FormData();

      pdfFormData.append("postingPdf", postingPdf);
      pdfFormData.append("offerPdf", offerPdf);

      response = await fetch("/api/compare-pdf", {
        method: "POST",
        body: pdfFormData,
      });
    } else if (isJobUrlWithOfferText) {
  const postingUrlResponse = await fetch("/api/read-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: postingUrl,
    }),
  });

  const postingUrlData = await postingUrlResponse.json();

  if (!postingUrlResponse.ok) {
    throw new Error(
      postingUrlData.error ||
        "PlotTwist couldn't read the job posting URL. Try pasting the text instead.",
    );
  }

  response = await fetch("/api/compare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postingText: postingUrlData.text,
      offerText,
    }),
  });
} else if (isUrlComparison) {
  const [postingUrlResponse, offerUrlResponse] = await Promise.all([
    fetch("/api/read-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: postingUrl,
      }),
    }),
    fetch("/api/read-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: offerUrl,
      }),
    }),
  ]);

  const postingUrlData = await postingUrlResponse.json();
  const offerUrlData = await offerUrlResponse.json();

  if (!postingUrlResponse.ok) {
    throw new Error(
      postingUrlData.error ||
        "PlotTwist couldn't read the job posting URL. Try pasting the text instead.",
    );
  }

  if (!offerUrlResponse.ok) {
    throw new Error(
      offerUrlData.error ||
        "PlotTwist couldn't read the offer URL. Try pasting the text instead.",
    );
  }

  response = await fetch("/api/compare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postingText: postingUrlData.text,
      offerText: offerUrlData.text,
    }),
  });
} else {
      response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postingText,
          offerText,
        }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "PlotTwist couldn't complete the comparison.",
      );
    }

    setLoadingStep(3);
await new Promise((resolve) => setTimeout(resolve, 500));

setLoadingStep(4);
await new Promise((resolve) => setTimeout(resolve, 500));

sessionStorage.setItem("plottwist-mode", "live");

    sessionStorage.setItem(
      "plottwist-live-result",
      JSON.stringify(data),
    );

    router.push("/results");
  } catch (error) {
    setComparisonFailed(true);

    setCompareError(
      error instanceof Error
        ? error.message
        : "PlotTwist couldn't complete the comparison.",
    );
  } finally {
    setIsComparing(false);
  }
}
if (comparisonFailed && compareError) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fafaf8]">
      <div className="mx-auto flex min-h-screen max-w-[1180px] items-center justify-center px-5 py-12">
        <section className="w-full max-w-[520px] rounded-[24px] border border-[#e7e5e1] bg-white px-8 py-10 text-center shadow-[0_18px_50px_rgba(35,49,77,0.08)] sm:px-12">
          <div className="font-serif text-[30px] font-semibold tracking-[-0.04em] text-[#171717]">
            Plot<span className="text-[#a64b4b]">Twist</span>
          </div>

          <div className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#fbeaea] text-xl text-[#a64b4b]">
            !
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#171717]">
            We couldn&apos;t complete this comparison.
          </h1>

          <p className="mx-auto mt-4 max-w-[390px] text-sm leading-6 text-[#6f6b63]">
            {compareError}
          </p>

          <button
            type="button"
            onClick={() => {
              setComparisonFailed(false);
              setCompareError("");
            }}
            className="mt-8 rounded-xl bg-[#23314D] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b2740]"
          >
            Back to comparison
          </button>
        </section>
      </div>
    </main>
  );
}

if (isComparing) {
  const loadingSteps = [
    {
      step: 1,
      title: "Reading your documents",
      detail: "Your inputs have been received.",
    },
    {
      step: 2,
      title: "Extracting key terms",
      detail: "Finding salary, PTO, bonus, work arrangement, and more.",
    },
    {
      step: 3,
      title: "Comparing terms",
      detail: "Checking what changed, disappeared, or was added.",
    },
    {
      step: 4,
      title: "Preparing your results",
      detail: "Linking each finding to its supporting evidence.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <div className="mx-auto flex min-h-screen max-w-[1180px] items-center justify-center px-5 py-12">
        <section className="w-full max-w-[520px] rounded-[24px] border border-[#e7e5e1] bg-white px-8 py-10 shadow-[0_18px_50px_rgba(35,49,77,0.08)] sm:px-12">
          <div className="text-center">
            <div className="font-serif text-[30px] font-semibold tracking-[-0.04em] text-[#171717]">
              Plot<span className="text-[#a64b4b]">Twist</span>
            </div>

            <h1 className="mt-8 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#171717]">
              Comparing your documents...
            </h1>

            <p className="mx-auto mt-4 max-w-[360px] text-sm leading-6 text-[#6f6b63]">
              We&apos;re extracting key details, checking for differences, and
              gathering the evidence behind each finding.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {loadingSteps.map((item) => {
              const isComplete = loadingStep > item.step;
              const isActive = loadingStep === item.step;

              return (
                <div
                  key={item.step}
                  className={`flex items-center gap-4 transition-opacity ${
                    isActive || isComplete ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isComplete
                        ? "bg-[#23314D] text-white"
                        : isActive
                          ? "border-2 border-[#4B5E8A] bg-white"
                          : "bg-[#e7e5e1]"
                    }`}
                  >
                    {isComplete ? (
                      <span className="text-sm font-semibold">✓</span>
                    ) : isActive ? (
                      <span className="h-3 w-3 animate-pulse rounded-full bg-[#4B5E8A]" />
                    ) : null}
                  </div>

                  <div>
                    <p
                      className={`text-sm ${
                        isActive || isComplete
                          ? "font-semibold text-[#292824]"
                          : "font-medium text-[#6f6b63]"
                      }`}
                    >
                      {item.title}
                    </p>

                    {(isActive || isComplete) && (
                      <p className="mt-1 text-xs text-[#96928a]">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-xl bg-[#f4f6f8] px-4 py-3 text-center text-xs text-[#6f7782]">
            Your documents are only used to create this comparison.
          </div>
        </section>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-[#ece9e3]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-serif text-[27px] font-semibold tracking-[-0.035em] text-[#171717]"
          >
            Plot<span className="text-[#a64b4b]">Twist</span>
          </Link>

          <nav className="flex items-center gap-6">
  <a
    href="#how-it-works"
    className="text-sm font-medium text-[#696761] transition hover:text-[#171717]"
  >
    How it works
  </a>

  <a
    href="#about"
    className="text-sm font-medium text-[#696761] transition hover:text-[#171717]"
  >
    About
  </a>

  <a
    href="#tips"
    className="text-sm font-medium text-[#696761] transition hover:text-[#171717]"
  >
    Tips
  </a>
</nav>
        </div>
      </header>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
  <div className="text-left">
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#96928a]">
      Compare the posting with the offer
    </p>

    <h1 className="max-w-[620px] font-serif text-[46px] font-medium leading-[1.02] tracking-[-0.04em] text-[#171717] sm:text-[58px]">
      You worked hard
      <br />
      to get the offer.
      <br />
      <span className="text-[#a64b4b]">
        Now make sure it&apos;s
        <br />
        what you expected.
      </span>
    </h1>

    <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-[#6f6b63]">
      Compare the original job posting with your final offer. See what changed,
      what disappeared, and what to clarify before you sign.
    </p>

    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#6f6b63]">
      <span className="flex items-center gap-2">
        <CheckIcon />
        Clear differences
      </span>

      <span className="flex items-center gap-2">
        <CheckIcon />
        Side-by-side evidence
      </span>

      <span className="flex items-center gap-2">
        <CheckIcon />
        Practical next steps
      </span>
    </div>
  </div>

  <div className="relative mx-auto flex min-h-[330px] w-full max-w-[420px] items-center justify-center">
    <div className="absolute h-[260px] w-[260px] rounded-full bg-[#fbefe7]" />

    <div className="relative flex items-end gap-4">
      <div className="-rotate-6 rounded-[18px] border border-[#d8d5cf] bg-white p-5 shadow-[0_18px_40px_rgba(35,49,77,0.10)]">
        <div className="mb-4 flex items-center justify-between gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#23314D]">
            Job posting
          </span>
          <span className="h-2 w-2 rounded-full bg-[#b9822e]" />
        </div>

        <div className="space-y-2">
          <div className="h-2 w-28 rounded-full bg-[#d9dde4]" />
          <div className="h-2 w-32 rounded-full bg-[#e6e3dd]" />
          <div className="h-2 w-24 rounded-full bg-[#e6e3dd]" />
          <div className="mt-4 h-7 rounded-md bg-[#fff0c7]" />
          <div className="h-2 w-28 rounded-full bg-[#e6e3dd]" />
          <div className="h-2 w-20 rounded-full bg-[#e6e3dd]" />
        </div>
      </div>

      <div className="rotate-6 rounded-[18px] border border-[#d8d5cf] bg-white p-5 shadow-[0_18px_40px_rgba(35,49,77,0.10)]">
        <div className="mb-4 flex items-center justify-between gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#23314D]">
            Offer
          </span>
          <span className="h-2 w-2 rounded-full bg-[#a64b4b]" />
        </div>

        <div className="space-y-2">
          <div className="h-2 w-24 rounded-full bg-[#d9dde4]" />
          <div className="h-2 w-32 rounded-full bg-[#e6e3dd]" />
          <div className="mt-4 h-7 rounded-md bg-[#fbe0df]" />
          <div className="h-2 w-28 rounded-full bg-[#e6e3dd]" />
          <div className="h-2 w-20 rounded-full bg-[#e6e3dd]" />
          <div className="h-2 w-24 rounded-full bg-[#e6e3dd]" />
        </div>
      </div>
    </div>

    <div className="absolute bottom-5 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-[5px] border-[#23314D] bg-[#fafaf8] shadow-md">
      <span className="text-2xl">⌕</span>
    </div>
  </div>
</div>

        <form
        id="compare-form"
  onSubmit={handleCompare}
  className="..."
>
  <div className="grid gap-5 lg:grid-cols-2">
          <SourceCard
            number="1"
            title="Original job posting"
            fieldName="postingText"
            subtitle="The role as it was advertised when you applied."
          />

          <SourceCard
            number="2"
            title="Final offer"
            fieldName="offerText"
            subtitle="The offer letter or terms you actually received."
          />
         </div>
        </form>

        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <button
  type="submit"
  form="compare-form"
  disabled={isComparing}
  className="w-full max-w-[320px] rounded-xl bg-[#23314D] px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b2740] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4B5E8A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isComparing ? "Comparing your offer..." : "Compare my offer →"}
</button>

{compareError && (
  <p className="mt-3 text-center text-sm text-[#a64b4b]">
    {compareError}
  </p>
)}

          <button
  type="button"
  onClick={() => {
  sessionStorage.setItem("plottwist-mode", "sample");
  sessionStorage.removeItem("plottwist-live-result");
  router.push("/results");
}}
className="w-full max-w-[260px] rounded-xl border border-[#c9827d] bg-white px-7 py-3 text-sm font-semibold text-[#a64b4b] transition hover:bg-[#fff7f5] focus:outline-none focus:ring-2 focus:ring-[#d8b0aa] focus:ring-offset-2"
>
  Try a sample
</button>

          <p className="mt-2 text-center text-xs leading-5 text-[#9b978f]">
Private by design. Your documents are only used to create this comparison.            worth reviewing.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-[#ece9e3] bg-[#f6f4ef] px-5 py-16 sm:px-8"
      >
        <div className="mx-auto max-w-[900px]">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#8a867e]">
            How it works
          </p>

          <div className="mt-9 grid gap-7 text-center sm:grid-cols-3">
            {[
              [
                "01",
                "Add both documents",
                "Upload, paste, or link the original posting and your final offer.",
              ],
              [
                "02",
                "PlotTwist compares the terms",
                "Salary, work arrangement, PTO, bonus, probation, title, and more.",
              ],
              [
                "03",
                "Review the evidence",
                "See what changed and the exact source language behind every finding.",
              ],
            ].map(([number, title, body]) => (
              <div key={number}>
                <span className="font-serif text-2xl italic text-[#a64b4b]">
                  {number}
                </span>
                <h3 className="mt-3 font-serif text-xl font-medium text-[#222222]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#77736b]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
  id="about"
  className="border-t border-[#ece9e3] bg-white px-5 py-16 sm:px-8"
>
  <div className="mx-auto max-w-[900px]">
    <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#96928a]">
      About PlotTwist
    </p>

    <h2 className="mx-auto mt-4 max-w-[680px] text-center font-serif text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
      Know what changed before you sign.
    </h2>

    <p className="mx-auto mt-5 max-w-[680px] text-center text-sm leading-7 text-[#6f6b63]">
      PlotTwist compares the job posting you applied for with the offer you
      actually received. It highlights changed, missing, new, and matching
      employment terms and links important findings back to the evidence.
    </p>

    <p className="mx-auto mt-3 max-w-[680px] text-center text-sm leading-7 text-[#96928a]">
      PlotTwist is designed to help you review and ask better questions. It
      does not provide legal advice or make decisions for you.
    </p>
  </div>
</section>

<section
  id="tips"
  className="border-t border-[#ece9e3] bg-[#f6f4ef] px-5 py-16 sm:px-8"
>
  <div className="mx-auto max-w-[900px]">
    <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#96928a]">
      Tips
    </p>

    <h2 className="mt-4 text-center font-serif text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
      Get the clearest comparison.
    </h2>

    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-[18px] border border-[#e7e5e1] bg-white p-6">
        <span className="font-serif text-xl italic text-[#a64b4b]">01</span>
        <h3 className="mt-3 font-semibold text-[#292824]">
          Use the full documents
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#77736b]">
          Include the complete posting and offer so important terms are not
          missed.
        </p>
      </div>

      <div className="rounded-[18px] border border-[#e7e5e1] bg-white p-6">
        <span className="font-serif text-xl italic text-[#a64b4b]">02</span>
        <h3 className="mt-3 font-semibold text-[#292824]">
          Review the evidence
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#77736b]">
          Open each finding and check the exact language PlotTwist used for the
          comparison.
        </p>
      </div>

      <div className="rounded-[18px] border border-[#e7e5e1] bg-white p-6">
        <span className="font-serif text-xl italic text-[#a64b4b]">03</span>
        <h3 className="mt-3 font-semibold text-[#292824]">
          Clarify important changes
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#77736b]">
          Use the suggested questions as a starting point before accepting or
          signing your offer.
        </p>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}