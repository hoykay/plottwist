# PlotTwist

**See what changed before you sign.**

PlotTwist compares the original job posting with the final offer and shows what changed, what disappeared, what was added, and what stayed the same — with evidence from both documents.

Built for **Build With AI: Basics**.

## What PlotTwist does

Job offers do not always match the role someone originally applied for.

PlotTwist helps make those differences easier to spot by comparing employment terms including:

- Salary
- Work arrangement
- Paid time off
- Bonus
- Job title
- Location
- Working hours
- Probation
- Benefits

Each term is classified as:

- **Changed** — appears in both documents, but the value differs
- **Missing** — appeared in the job posting but is absent from the offer
- **New** — appears in the offer but not in the posting
- **Match** — remains consistent across both documents

Important findings are linked back to source evidence and accompanied by neutral questions the user may want to clarify before signing.

## Input options

PlotTwist supports:

- **Paste text**
- **Upload PDFs**
- **Public job-posting URLs** on a best-effort basis

Some websites may block automated reading. When that happens, users can paste or upload the job posting instead.

## How it works

1. The user provides the original job posting and final offer.
2. Gemini extracts structured employment terms from both sources.
3. PlotTwist's deterministic comparison logic evaluates those extracted terms.
4. Each term is classified as Changed, Missing, New, or Match.
5. The results page presents the differences alongside supporting evidence.
6. PlotTwist surfaces practical questions worth clarifying.

### Why the comparison is deterministic

Gemini is used for **factual extraction** from messy documents.

Gemini does **not** decide whether a term is Changed, Missing, New, or Match.

That classification is handled by PlotTwist's application logic in `lib/compare.ts`, keeping the core comparison behavior predictable and explainable.

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini API
- Zod
- Cheerio
- Vercel

## Run locally

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```text
GEMINI_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run:

```bash
npm run lint
npm run build
```

## Project structure

Key files:

- `app/page.tsx` — homepage, document inputs, validation, loading states, errors, and comparison flow
- `app/results/page.tsx` — findings, evidence, clarification questions, and sample/live results
- `app/api/compare/route.ts` — pasted-text comparison endpoint
- `app/api/compare-pdf/route.ts` — PDF comparison endpoint
- `app/api/read-url/route.ts` — public URL reading endpoint
- `lib/gemini.ts` — Gemini extraction for text
- `lib/pdf-gemini.ts` — Gemini extraction for PDFs
- `lib/compare.ts` — deterministic comparison logic
- `lib/schemas.ts` — structured employment-term schemas
- `lib/url-reader.ts` — safe best-effort public webpage reader
- `devpost/app-map.html` — visual architecture and learning map

## Finding states

| Status | Meaning |
| --- | --- |
| **Changed** | The term appears in both documents but differs |
| **Missing** | The posting included the term but the offer does not |
| **New** | The offer introduces a term absent from the posting |
| **Match** | The term remains consistent across both documents |

## Responsible use

PlotTwist helps users identify employment terms worth reviewing.

It does **not** provide legal advice, negotiate on the user's behalf, or make employment decisions.

## Project principle

> This is what you applied for.  
> This is what you were offered.  
> Here's what changed.