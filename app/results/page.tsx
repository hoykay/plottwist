"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "changed" | "missing" | "new" | "match";

type Finding = {
  id: string;
  label: string;
  icon: string;
  status: Status;
  postingValue: string;
  offerValue: string;
  explanation: string;
  postingEvidence: string;
  offerEvidence: string;
  clarification?: string;
};

const findings: Finding[] = [
  {
    id: "salary",
    label: "Salary",
    icon: "$",
    status: "changed",
    postingValue: "$100,000 – $120,000",
    offerValue: "$95,000",
    explanation:
      "The offered salary is below the range shown in the original job posting.",
    postingEvidence:
      "The salary range for this position is $100,000 – $120,000 annually.",
    offerEvidence:
      "Your starting base salary will be $95,000 annually, subject to standard deductions.",
    clarification:
      "Could you clarify why the offered base salary is below the range shown in the original job posting?",
  },
  {
    id: "work",
    label: "Work arrangement",
    icon: "⌂",
    status: "changed",
    postingValue: "Fully remote",
    offerValue: "Hybrid · 3 days in office",
    explanation:
      "The posting described the role as fully remote, while the offer requires regular office attendance.",
    postingEvidence:
      "This position is fully remote and may be performed from anywhere within the United States.",
    offerEvidence:
      "Employees are expected to work from the New York office three days each week.",
    clarification:
      "The posting described this role as fully remote. Could you clarify the hybrid requirement in the offer?",
  },
  {
    id: "bonus",
    label: "Annual bonus",
    icon: "%",
    status: "missing",
    postingValue: "Up to 15%",
    offerValue: "Not mentioned",
    explanation:
      "An annual performance bonus appeared in the job posting but is not mentioned in the offer.",
    postingEvidence:
      "Eligible employees may receive an annual performance bonus of up to 15%.",
    offerEvidence:
      "No annual bonus terms were found in the offer.",
    clarification:
      "Is the annual performance bonus mentioned in the job posting still part of the compensation package?",
  },
  {
    id: "probation",
    label: "Probation period",
    icon: "⌛",
    status: "new",
    postingValue: "Not mentioned",
    offerValue: "6 months",
    explanation:
      "The offer introduces a six-month probation period that did not appear in the original posting.",
    postingEvidence:
      "No probation period was found in the original job posting.",
    offerEvidence:
      "Your employment will begin with a six-month probationary period.",
    clarification:
      "Could you explain how the six-month probation period works and whether any terms change during that period?",
  },
  {
    id: "pto",
    label: "Paid time off (PTO)",
    icon: "□",
    status: "match",
    postingValue: "20 days per year",
    offerValue: "20 days per year",
    explanation:
      "The paid-time-off allowance matches what appeared in the original posting.",
    postingEvidence:
      "Employees receive 20 days of paid time off each year.",
    offerEvidence:
      "You will be entitled to 20 days of paid time off per calendar year.",
  },
  {
    id: "health",
    label: "Health insurance",
    icon: "+",
    status: "match",
    postingValue: "Comprehensive plan",
    offerValue: "Comprehensive plan",
    explanation:
      "The health insurance terms are consistent with the original posting.",
    postingEvidence:
      "We offer comprehensive health, dental, and vision insurance.",
    offerEvidence:
      "You will be eligible for comprehensive medical, dental, and vision coverage.",
  },
];

const statusStyle: Record<
  Status,
  { label: string; background: string; text: string }
> = {
  changed: {
    label: "Changed",
    background: "#f5e9c9",
    text: "#89611c",
  },
  missing: {
    label: "Missing",
    background: "#f5d9d7",
    text: "#93423f",
  },
  new: {
    label: "New",
    background: "#dce8f3",
    text: "#3f6487",
  },
  match: {
    label: "Match",
    background: "#e7e8e8",
    text: "#5f666e",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const style = statusStyle[status];

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background: style.background,
        color: style.text,
      }}
    >
      {style.label}
    </span>
  );
}

function DocumentPanel({
  title,
  type,
  selected,
}: {
  title: string;
  type: "posting" | "offer";
  selected: Finding;
}) {
  const evidence =
    type === "posting" ? selected.postingEvidence : selected.offerEvidence;

  return (
    <article className="rounded-[18px] border border-[#e5e2db] bg-white p-5 shadow-[0_10px_28px_rgba(35,49,77,0.035)]">
      <div className="mb-5 flex items-center justify-between border-b border-[#efede8] pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#97938b]">
            {type === "posting" ? "Original" : "Final"}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-[#292824]">{title}</h3>
        </div>

        <span className="text-xs text-[#aaa69d]">
          {type === "posting" ? "job-posting.pdf" : "offer-letter.pdf"}
        </span>
      </div>

      <div className="min-h-[390px] rounded-xl border border-[#ece9e3] bg-[#fbfaf7] p-5">
        <h4 className="font-serif text-xl font-semibold text-[#232323]">
          Senior Product Manager
        </h4>

        <p className="mt-5 text-[13px] leading-7 text-[#65625c]">
          We&apos;re looking for a Senior Product Manager to join our growing product
          team.
        </p>

        <p className="mt-4 text-[13px] leading-7 text-[#65625c]">
          This role offers meaningful ownership, close collaboration with design and
          engineering, and the opportunity to shape products used by thousands of
          customers.
        </p>

        <div className="my-5 rounded-lg border border-[#e7d7a6] bg-[#fff4cf] px-3 py-2.5">
          <p className="text-[13px] font-medium leading-6 text-[#5f512c]">
            {evidence}
          </p>
        </div>

        <p className="text-[13px] leading-7 text-[#65625c]">
          You&apos;ll work cross-functionally to define product direction, understand
          customer needs, and deliver thoughtful improvements across the product
          experience.
        </p>

        <div className="mt-6 space-y-2">
          <div className="h-2 w-full rounded-full bg-[#e8e5df]" />
          <div className="h-2 w-[88%] rounded-full bg-[#ebe8e2]" />
          <div className="h-2 w-[72%] rounded-full bg-[#efede8]" />
        </div>
      </div>
    </article>
  );
}

export default function ResultsPage() {
  const [selectedId, setSelectedId] = useState(findings[0].id);
  const selected =
    findings.find((finding) => finding.id === selectedId) ?? findings[0];

  const changedCount = findings.filter(
    (finding) => finding.status !== "match",
  ).length;

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-[#ebe8e2] bg-[#fafaf8]/95">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-serif text-[27px] font-semibold tracking-[-0.035em]"
          >
            Plot<span className="text-[#a64b4b]">Twist</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-[#23314d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2942]"
          >
            + New comparison
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1380px] px-5 pb-20 pt-9 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="mb-7 flex gap-7 border-b border-[#e8e5df] text-sm">
            <button className="border-b-2 border-[#a64b4b] pb-3 font-semibold text-[#a64b4b]">
              Overview
            </button>
            <button className="pb-3 text-[#77736b]">All findings (6)</button>
            <button className="pb-3 text-[#77736b]">
              Things to clarify ({changedCount})
            </button>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#97938b]">
            Sample comparison
          </p>

          <h1 className="font-serif text-[38px] font-medium leading-tight tracking-[-0.035em] text-[#171717] sm:text-[48px]">
            We found{" "}
            <span className="text-[#4b5e8a]">{changedCount} changes</span> worth
            reviewing.
          </h1>

          <p className="mt-2 text-sm text-[#7c7870]">
            6 employment terms compared.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Changed", "2", "#f5e9c9", "#89611c"],
            ["Missing", "1", "#f5d9d7", "#93423f"],
            ["New", "1", "#dce8f3", "#3f6487"],
            ["Match", "2", "#e7e8e8", "#5f666e"],
          ].map(([label, count, bg, color]) => (
            <div
              key={label}
              className="rounded-[16px] border border-[#ebe8e2] bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ background: bg, color }}
                >
                  {count}
                </span>

                <div>
                  <p className="text-sm font-semibold text-[#292824]">{label}</p>
                  <p className="mt-0.5 text-[11px] text-[#97938b]">
                    {label === "Changed"
                      ? "Different from posting"
                      : label === "Missing"
                        ? "Not mentioned in offer"
                        : label === "New"
                          ? "Added in offer"
                          : "Same as posted"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-[#262521]">
                Findings
              </h2>
              <span className="text-xs text-[#97938b]">Select to inspect</span>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[#e5e2db] bg-white">
              {findings.map((finding, index) => (
                <button
                  key={finding.id}
                  onClick={() => setSelectedId(finding.id)}
                  className={`flex w-full items-center gap-3 px-4 py-4 text-left transition ${
                    index !== findings.length - 1
                      ? "border-b border-[#efede8]"
                      : ""
                  } ${
                    selected.id === finding.id
                      ? "bg-[#f7f4ee]"
                      : "bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      background: statusStyle[finding.status].background,
                      color: statusStyle[finding.status].text,
                    }}
                  >
                    {finding.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-[#252420]">
                        {finding.label}
                      </p>
                      <StatusBadge status={finding.status} />
                    </div>

                    <p className="mt-1 truncate text-xs text-[#89857d]">
                      {finding.postingValue} → {finding.offerValue}
                    </p>
                  </div>

                  <span className="text-[#aaa69d]">›</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-[#262521]">
                Source documents
              </h2>

              <span className="rounded-full bg-[#f1efea] px-3 py-1.5 text-xs font-medium text-[#706c64]">
                Evidence highlighted
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <DocumentPanel
                title="Job posting"
                type="posting"
                selected={selected}
              />
              <DocumentPanel
                title="Offer letter"
                type="offer"
                selected={selected}
              />
            </div>

            <section className="mt-5 rounded-[20px] border border-[#e5e2db] bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="font-serif text-2xl font-semibold text-[#262521]">
                      {selected.label}
                    </h2>
                    <StatusBadge status={selected.status} />
                  </div>

                  <p className="max-w-[760px] text-sm leading-6 text-[#6f6b63]">
                    {selected.explanation}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#ebe8e2] bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#99958d]">
                    Job posting
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#33312d]">
                    {selected.postingValue}
                  </p>
                </div>

                <div className="rounded-xl border border-[#ebe8e2] bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#99958d]">
                    Offer letter
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#33312d]">
                    {selected.offerValue}
                  </p>
                </div>
              </div>

              {selected.clarification && (
                <div className="mt-5 rounded-[14px] border border-[#ead7d5] bg-[#fbefee] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a4a46]">
                    Something to clarify
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#5f4542]">
                    {selected.clarification}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        <section className="mt-10 rounded-[22px] border border-[#e4e1da] bg-[#f6f4ef] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#918d85]">
            Things to clarify
          </p>

          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.025em] text-[#282723]">
            Questions worth asking before you sign.
          </h2>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {findings
              .filter((finding) => finding.clarification)
              .map((finding, index) => (
                <div
                  key={finding.id}
                  className="flex gap-4 rounded-[16px] border border-[#e5e2db] bg-white p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ebe8e2] text-sm font-semibold text-[#5f5b54]">
                    {index + 1}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-[#2f2d29]">
                      {finding.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#77736b]">
                      {finding.clarification}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <p className="mt-7 text-center text-xs leading-5 text-[#9c9890]">
          Sample data for demonstration. PlotTwist highlights differences and does
          not provide legal advice.
        </p>
      </section>
    </main>
  );
}