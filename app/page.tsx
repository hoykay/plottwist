"use client";

import Link from "next/link";
import { useState } from "react";

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

function FileIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
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
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  const [mode, setMode] = useState<InputMode>("upload");

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
        <label className="group flex min-h-[205px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-[#cbc7bf] bg-[#fbfaf7] px-6 text-center transition hover:border-[#9a968d] hover:bg-[#f8f6f1]">
          <input type="file" accept=".pdf" className="hidden" />

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#efede7] text-[#23314d] transition group-hover:bg-[#e8e5de]">
            <UploadIcon />
          </div>

          <p className="font-medium text-[#222222]">Drop a PDF here</p>
          <p className="mt-1 text-sm text-[#8a877f]">or click to browse</p>

          <span className="mt-5 text-xs text-[#aaa69d]">PDF · Max 10 MB</span>
        </label>
      )}

      {mode === "paste" && (
        <textarea
          placeholder="Paste the document text here..."
          className="min-h-[205px] w-full resize-none rounded-[18px] border border-[#dedbd4] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#242424] outline-none transition placeholder:text-[#aaa69d] focus:border-[#23314d]"
        />
      )}

      {mode === "link" && (
        <div className="flex min-h-[205px] flex-col justify-center rounded-[18px] border border-[#dedbd4] bg-[#fbfaf7] p-5">
          <label className="mb-2 text-sm font-medium text-[#3b3935]">
            Public document or job-posting link
          </label>
          <input
            type="url"
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

          <a
            href="#how-it-works"
            className="text-sm font-medium text-[#696761] transition hover:text-[#171717]"
          >
            How it works
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <div className="mx-auto max-w-[820px] text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#e5e1d9] bg-[#fdfcf9] px-3 py-1.5 text-xs font-medium text-[#6e6a63]">
            <FileIcon />
            Job offer comparison
          </div>

          <h1 className="font-serif text-[44px] font-medium leading-[1.03] tracking-[-0.045em] text-[#171717] sm:text-[58px] lg:text-[68px]">
            Did the offer match the job you{" "}
            <span className="italic text-[#a64b4b]">applied for?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-7 text-[#74716a] sm:text-[17px]">
            Compare the original job posting with your final offer. See what changed,
            what disappeared, and what to clarify before you sign.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-[#68655f] sm:mt-12">
          <span className="flex items-center gap-2">
            <CheckIcon />
            Evidence linked
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon />
            Clear differences
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon />
            No account required
          </span>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <SourceCard
            number="1"
            title="Original job posting"
            subtitle="The role as it was advertised when you applied."
          />

          <SourceCard
            number="2"
            title="Final offer"
            subtitle="The offer letter or terms you actually received."
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <button className="w-full max-w-[330px] rounded-xl bg-[#23314d] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(35,49,77,0.14)] transition hover:bg-[#1c2942]">
            Compare my offer
          </button>

          <Link
            href="/results"
            className="text-sm font-semibold text-[#a64b4b] underline decoration-[#d8b8b8] underline-offset-4 transition hover:text-[#833939]"
          >
            Try a sample
          </Link>

          <p className="mt-2 text-center text-xs leading-5 text-[#9b978f]">
            PlotTwist does not provide legal advice. It helps you identify differences
            worth reviewing.
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
    </main>
  );
}