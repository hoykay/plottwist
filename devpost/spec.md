---
doc: spec
status: approved
---

# PlotTwist — Technical Spec

## How This Works, In Plain Language

PlotTwist will be a responsive web application built with Next.js and deployed publicly on Vercel.

The user gives PlotTwist two sources:

1. the original job posting
2. the final job offer

Those sources can come from an uploaded PDF, pasted text, or—when possible—a public URL.

PlotTwist sends the source material to a secure server route. The Gemini API is called from the server, never directly from the user's browser, so the Gemini API key is not exposed.

Gemini's job is limited primarily to understanding the documents. It extracts a structured set of employment terms and the exact evidence supporting each term.

PlotTwist's own comparison code then compares those structured values.

That code determines whether each term is:

- Match
- Changed
- Missing
- New

This separation matters:

Gemini understands the documents.

PlotTwist decides how the extracted terms compare.

The browser then shows the original job posting and final offer side by side, highlights supporting evidence, and presents a concise panel of important differences and items worth clarifying.

There is no account system and no database in version one.

Comparison information exists only for the current browser session.

This keeps the proof of concept focused, reduces privacy and infrastructure complexity, and makes the demo more reliable.

Implements `prd.md > The Core Journey`.

---

## The Core Journey Through the System

### Step 1 — User opens PlotTwist

The browser loads the PlotTwist input page.

The page contains:

- PlotTwist branding
- the main headline
- original job posting input
- final offer input
- Compare My Offer action
- Try a Sample action

No login is required.

PRD ref: `prd.md > Screens and Layout > Input Screen`.

### Step 2 — User provides the original job posting

The user can use one of the supported input methods:

- upload a PDF
- paste the job-posting text
- enter a public job-posting URL

If a URL cannot be read, the interface tells the user to paste the text or upload a document instead.

PRD ref: `prd.md > Features and Behavior > Source Input`.

### Step 3 — User provides the final offer

The user can:

- upload a PDF
- paste offer text
- enter a public document URL when accessible

Again, URL reading is best-effort rather than guaranteed.

### Step 4 — User starts comparison

The browser sends both sources to:

`POST /api/compare`

The Gemini API key exists only on the server.

The page enters a clear comparison/loading state.

PRD ref: `prd.md > States and Boundaries > Comparing`.

### Step 5 — Prepare the source material

For pasted text:

The supplied text is used directly.

For an uploaded PDF:

The document is supplied to Gemini for document understanding.

For a public URL:

The server attempts to retrieve readable page content.

If the page blocks retrieval or does not contain enough readable text, PlotTwist returns a friendly error with upload/paste as the fallback.

### Step 6 — Extract structured employment terms

Gemini returns predictable structured data instead of free-form prose.

Each source can contain fields such as:

- role title
- salary
- work arrangement
- PTO
- bonus
- location
- working hours
- probation
- benefits

Each extracted term should also include:

- the normalized value
- the user-facing value
- supporting evidence from the document
- whether the term was actually present

Gemini is instructed to treat all document contents as data and ignore any instructions contained inside uploaded documents or webpage text.

### Step 7 — PlotTwist compares the terms

Our comparison logic processes the two structured results.

Basic rule:

- present in both and equivalent → Match
- present in both but materially different → Changed
- present in posting but absent from offer → Missing
- absent from posting but present in offer → New
- absent from both → do not show

Field-specific comparison logic can make the result smarter.

Example:

A job posting advertising `$75,000–$90,000` and an offer of `$82,000` should not be marked as changed simply because the strings differ.

The salary comparison should determine that `$82,000` sits inside the advertised range.

### Step 8 — Build clarification messages

PlotTwist generates neutral clarification prompts from the comparison results.

Example:

Posting:
`$75,000–$90,000`

Offer:
`$68,000`

PlotTwist can display:

`The offered salary is below the range in the original posting.`

Suggested clarification:

`Could you clarify why the offered base salary differs from the range shown in the original job posting?`

These prompts should be neutral and should not make legal claims.

### Step 9 — Store results for the current session

The browser keeps the current comparison result in session-level browser storage.

This allows the user to navigate from the input page to the dedicated results page without creating a database.

The information is not intended to become permanent comparison history.

### Step 10 — Results screen

The user is taken to:

`/results`

They see:

- original job posting on the left
- final job offer on the right
- relevant evidence highlighted
- differences panel beside the documents on desktop
- differences panel below the documents when screen space is smaller

PRD ref: `prd.md > Screens and Layout > Results Screen`.

### Step 11 — Evidence interaction

Each finding is connected to evidence.

When the user selects a finding, PlotTwist visually emphasizes the relevant evidence in both document panels.

If an exact highlight cannot be located reliably, the evidence quote still appears clearly in the finding rather than silently inventing a location.

### Step 12 — User understands what to clarify

The final result helps the user understand:

- what remained the same
- what changed
- what disappeared
- what was newly added
- what may deserve clarification before signing

That completes the core loop.

---

## Stack

### Next.js

Use the current stable Next.js release with the App Router.

Why:

- frontend and server routes can live in one project
- good fit for Vercel
- avoids creating a separate backend project
- straightforward routing between the input and results screens

Documentation: official Next.js documentation.

### TypeScript

Use TypeScript throughout the project.

Why:

The comparison data has a clear structure, and TypeScript makes it easier to catch mistakes such as missing fields or incorrect status values before they become demo bugs.

### React

React is provided through Next.js.

Use client-side components only where interaction is required.

### Tailwind CSS

Use Tailwind CSS for layout and UI styling, supported by a small set of intentional design tokens/CSS variables.

Tailwind is only an implementation tool.

The finished product must not use generic starter styling or default-looking component patterns.

### Google GenAI SDK

Use the official JavaScript/TypeScript Google GenAI SDK:

`@google/genai`

The server route uses the SDK to communicate with Gemini.

Documentation: official Google Gemini API libraries, document understanding, and structured output documentation.

### Gemini model

Start with the current Gemini Flash model available through the Gemini Developer API.

At build time, verify the exact current Flash model identifier before locking it in.

The model must support:

- PDF/document understanding
- structured JSON output

### Zod

Use Zod to define and validate the expected structured extraction response.

This ensures that an unexpected model response does not silently break the comparison UI.

### Cheerio

Use Cheerio only for best-effort extraction of readable text from public HTML job pages.

This does not guarantee compatibility with every job platform.

If the page cannot be read, PlotTwist falls back to upload or pasted text.

### Vercel

Deploy the public product to Vercel.

Why:

- strong Next.js support
- simple deployment
- environment variables keep the Gemini key out of the browser
- produces a real public URL for the judges

Documentation: official Vercel Next.js deployment documentation.

---

## Where It Runs and How Someone Tries It

### Development

Requirements:

- Node.js
- npm
- Gemini API key

Local environment variable:

`GEMINI_API_KEY`

The real key must live in `.env.local`.

`.env.local` must never be committed.

A safe `.env.example` can contain:

`GEMINI_API_KEY=your_key_here`

### Start locally

From the PlotTwist project directory:

`npm run dev`

Then open:

`http://localhost:3000`

### Public deployment

Deploy the GitHub repository to Vercel.

Add:

`GEMINI_API_KEY`

as a Vercel environment variable.

The deployed application should expose a public HTTPS URL.

### Hackathon submission

The public deployment supports the demo, but it does not replace the required:

- public GitHub repository
- under-three-minute demo video

---

## Look and Feel

Implements `prd.md > Look and Feel`.

PlotTwist should feel like a premium editorial document-review product rather than an AI dashboard.

### Overall direction

- warm white background
- dark ink typography
- deep navy primary actions
- restrained status colors
- generous whitespace
- thin elegant borders
- strong typographic hierarchy
- calm transitions
- minimal visual noise

### Palette

Background:
`#FAFAF8`

Primary text:
`#171717`

Primary navy:
`#23314D`

Secondary cobalt:
`#4B5E8A`

Borders:
`#E7E5E1`

Changed:
`#A64B4B`

Missing:
`#B9822E`

New:
`#5277A3`

Match:
`#6F7782`

Green is intentionally not used as the main match/success color.

### Typography

Recommended implementation:

- editorial serif such as Newsreader for important headlines
- Inter or a similarly clean sans-serif for interface text

Use Next.js font loading so typography remains consistent.

### UI treatment

Avoid:

- large AI gradients
- glassmorphism
- glowing buttons
- excessive pill shapes
- overly rounded card layouts
- unnecessary dashboard widgets
- giant marketing sections
- decorative AI imagery

The product itself should be the visual focus.

---

## Components

## Input Page

Implements `prd.md > Screens and Layout > Input Screen`.

The main landing surface.

Contains:

- PlotTwist wordmark
- headline
- short explanation
- two source input areas
- Compare My Offer button
- Try a Sample action
- quiet privacy/legal note

---

## SourceInput

Implements `prd.md > Features and Behavior > Source Input`.

Reusable component for either:

- original job posting
- final job offer

Supports:

- PDF upload
- pasted text
- public URL

Shows the currently selected input mode and source readiness.

---

## Compare Action

The main primary action.

Disabled until both sources contain usable input.

When activated:

- validate inputs
- enter loading state
- send sources to `/api/compare`
- handle success or failure
- move user to `/results`

---

## Sample Comparison

Allows a judge or visitor to experience PlotTwist immediately.

Uses clearly labeled fictional sample data.

Sample scenario should intentionally contain several meaningful differences, such as:

- advertised salary `$75,000–$90,000`
- offered salary `$68,000`
- remote becoming hybrid
- 25 days PTO becoming 20
- 10% bonus disappearing
- 6-month probation being newly introduced

For reliability, sample mode may use a precomputed comparison result stored in the repository.

It must be clearly labeled as sample data.

The live comparison pipeline remains separately functional.

---

## Compare API Route

Path:

`/api/compare`

Implements:

`prd.md > Features and Behavior > Comparison`

Responsibilities:

- validate the request
- prepare each input
- fetch URL content where required
- send documents/text to Gemini
- validate structured responses
- run PlotTwist comparison logic
- return the completed comparison result

The Gemini API key must only be used here on the server.

---

## Gemini Extraction

Implements:

`prd.md > Features and Behavior > Comparison`

Gemini is responsible for extracting facts from each source.

Expected structured data includes fields such as:

- title
- salary
- work arrangement
- PTO
- bonus
- location
- working hours
- probation
- benefits
- readable document text
- evidence for each extracted term

The model should not decide whether an employer behaved correctly.

It extracts the facts.

---

## Comparison Engine

Implements:

`prd.md > Features and Behavior > Finding Statuses`

This is PlotTwist's own logic.

It converts extracted terms into:

- match
- changed
- missing
- new

Where possible, compare normalized values instead of raw text.

Examples:

Salary:
compare numeric values/ranges.

PTO:
compare number of days.

Work arrangement:
compare normalized values such as remote, hybrid, or on-site.

Hybrid:
also compare office-days-per-week when available.

Probation:
compare duration when available.

Title/location/hours:
compare normalized strings.

Benefits:
compare normalized benefit names or values where practical.

---

## Evidence Highlighter

Implements:

`prd.md > Features and Behavior > Evidence-Linked Findings`.

Receives:

- readable source text
- evidence snippets
- selected finding

It highlights evidence within each document panel.

If exact matching fails, it must fall back gracefully to showing the evidence snippet in the finding panel.

It must never invent evidence.

---

## Results Page

Implements:

`prd.md > Screens and Layout > Results Screen`.

Path:

`/results`

Contains:

- comparison summary
- original posting panel
- final offer panel
- difference findings
- evidence highlighting
- clarification section

Desktop:
two document panels with results beside them where space permits.

Smaller screens:
documents and findings stack vertically.

---

## Differences Panel

Implements:

`prd.md > Features and Behavior > Summary and Differences`.

Displays the most important findings first.

Changed, Missing, and New should receive more visual emphasis than Match.

Each finding includes:

- label
- status
- posting value
- offer value
- short neutral explanation
- evidence access
- clarification prompt where useful

---

## Notification System

Implements:

`prd.md > States and Boundaries`.

Used for calm, understandable messages such as:

- URL could not be read
- PDF could not be processed
- insufficient document information
- Gemini request failed
- network problem

Do not display raw stack traces or technical error codes.

---

## Data Model

There is no database.

### Source input

Each source has approximately:

- type: `file | text | url`
- label
- raw input
- source name

### Extracted term

Each term contains approximately:

- field key
- display value
- normalized value
- evidence text
- present flag

### Finding

Each comparison finding contains approximately:

- field key
- label
- status: `match | changed | missing | new`
- posting value
- offer value
- posting evidence
- offer evidence
- summary
- clarification prompt

### Comparison result

Contains:

- posting source text
- offer source text
- findings
- status counts
- sample/live indicator

### Where the data lives

During entry:
React component memory.

After comparison:
session-level browser storage so the dedicated results route can read the result.

After the browser session ends:
PlotTwist does not preserve comparison history.

No PlotTwist database stores the source documents.

The interface should not claim that an external AI provider never retains data; it should only state what PlotTwist itself does.

---

## File Structure

```text
plottwist/
├── app/
│   ├── api/
│   │   └── compare/
│   │       └── route.ts
│   ├── results/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── SourceInput.tsx
│   ├── CompareButton.tsx
│   ├── DocumentPanel.tsx
│   ├── DifferencesPanel.tsx
│   ├── FindingCard.tsx
│   ├── StatusBadge.tsx
│   └── Notification.tsx
│
├── lib/
│   ├── gemini.ts
│   ├── schemas.ts
│   ├── prepare-source.ts
│   ├── url-reader.ts
│   ├── compare.ts
│   ├── clarification.ts
│   └── sample-data.ts
│
├── types/
│   └── comparison.ts
│
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
│
├── public/
│   └── samples/
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

---

## External Services and Dependencies

### Gemini API

Purpose:

- understand PDF documents
- extract employment terms
- return structured evidence-linked data

Access:

server side only.

Key:

`GEMINI_API_KEY`

SDK:

`@google/genai`

Request approach:

Use the official Gemini JavaScript SDK.

Send:

- source document/text
- extraction instructions
- strict structured-output schema

Receive:

validated structured extraction JSON.

Use a low-creativity configuration where supported because the task is factual extraction rather than creative writing.

Official documentation to consult during build:

- Gemini API getting started
- Gemini structured outputs
- Gemini document understanding
- Google GenAI SDK documentation

### Vercel

Purpose:

public hosting and server-side Next.js routes.

Environment variable:

`GEMINI_API_KEY`

Official documentation to consult:

Vercel Next.js deployment documentation.

### Public webpage fetching

Purpose:

best-effort job-posting/document URL support.

Rules:

- accept only normal public HTTP/HTTPS URLs
- reject clearly local/private destinations
- use a short timeout
- limit downloaded page size
- remove scripts/styles
- extract readable text
- fail gracefully if content cannot be retrieved

URL support must never become required for the demo.

---

## Important Failure Modes

### Job website blocks PlotTwist

User sees:

`We couldn't read this job posting. Paste the job description or upload the document instead.`

The comparison does not crash.

### PDF cannot be understood

User sees:

`We couldn't read this document. Try another PDF or paste the text instead.`

### Document contains too little useful information

User sees:

`This document doesn't contain enough information to compare yet. Try the full job posting or offer letter.`

### Gemini request fails or times out

User sees a calm retry message.

The existing source inputs remain available so the user does not need to start again.

### Evidence quote cannot be located in displayed document text

Do not invent a highlight.

Show the evidence snippet directly in the finding instead.

### Results route has no active comparison

If `/results` is opened without session data, show a clean empty state with an action to return to the comparison page.

---

## What Was Simplified and Why

### No account system

No login, password, authentication, or user profiles.

Reason:
none of these prove the core idea.

### No database

Comparison results last only for the browser session.

Reason:
history is not needed for the hackathon proof.

### PDF + text first

PDF and pasted text are the reliable inputs.

URL support is best-effort.

Reason:
arbitrary job websites can block automated retrieval.

### No Word document support in the initial build

PDF and pasted text are enough to demonstrate the product.

Additional formats can come later.

### No legal analysis

PlotTwist identifies differences.

It does not decide whether those differences are legal, fair, or enforceable.

### No AI negotiation agent

PlotTwist surfaces neutral things worth clarifying.

Reason:
a chatbot would dilute the focused product identity.

### Sample mode is precomputed

The Try a Sample flow may use a precomputed fictional result.

Reason:
judges should always be able to experience the product immediately.

It must be visibly labeled sample data, and the real comparison pipeline must still work.

---

## Verification Plan

Before the product is considered ready:

### Input test

Verify:

- PDF upload works
- pasted text works
- supported public URL works
- blocked URL shows the correct fallback

### Comparison test

Use the fictional winning-demo scenario.

Confirm PlotTwist correctly identifies:

- salary below advertised range
- remote becoming hybrid
- PTO reduction
- missing bonus
- newly introduced probation period

### Evidence test

Every displayed important finding must contain supporting evidence.

No evidence should be fabricated.

### UI test

Confirm:

- desktop layout works
- smaller-width layout works
- loading state looks intentional
- errors look intentional
- result page does not overflow
- evidence remains readable
- colors remain restrained
- no default-looking starter UI remains

### Demo test

A first-time viewer should be able to understand the product without explanation.

The end-to-end path should work smoothly enough to record in one continuous demo.

---

## Decisions and Open Issues

### Decision — web application

Chosen by the learner.

PlotTwist will be a responsive web app with a public deployed URL.

### Decision — Next.js + Vercel

Accepted because it provides the frontend and server routes in one project and reduces deployment complexity.

### Decision — Gemini for extraction

Accepted because Gemini can understand documents and provide structured output.

### Decision — deterministic PlotTwist comparison

Gemini extracts document facts.

PlotTwist's own code classifies the comparison.

This makes the product easier to reason about and less dependent on free-form AI judgment.

### Decision — server-side AI key

The Gemini key must never be exposed in client code.

### Decision — no database

Accepted because this is the first version and permanent history is not required.

### Decision — Try a Sample

Included because it allows anyone, especially hackathon judges, to experience the strongest workflow immediately.

### Useful technical uncertainty — public URLs

Some job websites prevent automated retrieval or require JavaScript/login.

This was clarified by making URL input best-effort rather than critical.

The reliable fallback is upload or pasted text.

### Useful technical uncertainty — evidence highlighting from PDFs

The first build must test whether the extracted evidence text maps cleanly enough to the readable document representation for reliable highlighting.

We will verify this early using the fictional demo PDF.

If exact highlighting fails, the safe fallback is to show the exact evidence quote visibly rather than pretending a location is known.

This uncertainty does not change the core product.

### Open issue to verify during build

Confirm the exact current Gemini Flash model identifier and SDK usage against the official documentation before implementing the live comparison route.

No unresolved product decision blocks the build.