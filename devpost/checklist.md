---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. A visitor can experience PlotTwist with the sample comparison**
  Becomes usable: PlotTwist runs as a real web app with the intended premium input screen. Clicking `Try a Sample` opens the dedicated results screen with fictional job-posting and offer data, meaningful differences, and visible evidence.
  Why now: This gives us a complete usable journey immediately and establishes the product's visual identity before adding live AI complexity. It also creates a guaranteed demo path that later slices can build on.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Screens and Layout > Input Screen`, `prd.md > Screens and Layout > Results Screen`
  Spec ref: `spec.md > Input Page`, `spec.md > Sample Comparison`, `spec.md > Results Page`, `spec.md > Look and Feel`, `spec.md > File Structure`
  Build: Scaffold the Next.js + TypeScript + Tailwind app inside the existing PlotTwist project, add the intentional editorial styling, create the input page and results route, add fictional sample data, store the sample result for the browser session, and render the sample comparison with document panels, status labels, differences, evidence, and clarification prompts.
  Verify (mechanical): Run the development server with no build errors; open the home page; trigger `Try a Sample`; confirm `/results` renders the fictional comparison and all planned sample findings without console/runtime errors.
  Learner check: Open PlotTwist, click `Try a Sample`, explore the input and results screens, and say what feels right or wrong about the product's look, hierarchy, and overall experience.
  Commit: `Build PlotTwist sample comparison flow`

- [x] **2. Pasted job and offer text produce a real live comparison**
  Becomes usable: A user can paste an original job posting and final offer, click Compare, and receive a real evidence-linked comparison produced from those sources.
  Why now: This proves PlotTwist's unique kernel early. It also tests the biggest architectural assumption: Gemini can extract predictable employment terms while PlotTwist's own deterministic logic correctly classifies Match, Changed, Missing, and New.
  PRD ref: `prd.md > Features and Behavior > Source Input`, `prd.md > Features and Behavior > Comparison`, `prd.md > Features and Behavior > Finding Statuses`, `prd.md > Features and Behavior > Evidence-Linked Findings`
  Spec ref: `spec.md > Compare API Route`, `spec.md > Gemini Extraction`, `spec.md > Comparison Engine`, `spec.md > Data Model`, `spec.md > External Services and Dependencies`
  Build: Install and configure `@google/genai` and Zod, add the server-only Gemini client, define the extraction schema, accept pasted text for both sources, extract structured terms and evidence, validate the model response, compare normalized values with PlotTwist logic, create neutral clarification prompts, return the comparison result, and show it on `/results`.
  Verify (mechanical): Run a controlled pasted-text test containing known salary, work arrangement, PTO, bonus, and probation differences; confirm the API returns valid structured data and the UI correctly classifies the expected Changed, Missing, New, and Match findings without exposing `GEMINI_API_KEY` to browser code.
  Learner check: Paste the provided test job posting and offer yourself, run the comparison, inspect several findings and their evidence, and confirm the result feels useful rather than like a generic AI summary.
  Commit: `Add live evidence linked text comparison`

- [x] **3. PDF job postings and offers can be compared with visible evidence**
  Becomes usable: A user can upload PDFs for the original job posting and/or offer and receive the same structured comparison experience as pasted text.
  Why now: PDF support is central to the intended real-world workflow and evidence highlighting is the main technical uncertainty recorded in the spec. Testing it here prevents us from discovering a demo-breaking limitation at the end.
  PRD ref: `prd.md > Features and Behavior > Source Input`, `prd.md > Features and Behavior > Evidence-Linked Findings`
  Spec ref: `spec.md > SourceInput`, `spec.md > Gemini Extraction`, `spec.md > Evidence Highlighter`, `spec.md > Decisions and Open Issues`
  Build: Add PDF upload support to both source inputs, validate file type and size, send supported PDFs through the server-side Gemini document-understanding flow, preserve readable evidence text, connect extracted evidence to findings, and implement reliable visual highlighting where exact matching is possible with the documented evidence-quote fallback when it is not.
  Verify (mechanical): Compare a fictional test job-posting PDF and offer PDF with known differences; confirm extraction succeeds, expected findings appear, and every important finding either highlights source evidence or displays the exact evidence quote fallback without inventing a location.
  Learner check: Upload the two test PDFs, click through several findings, and check whether the highlighted evidence makes the comparison easy to trust and understand.
  Commit: `Add PDF comparison and evidence highlighting`

- [x] **4. Public job URLs work when readable and fail gracefully when blocked**
  Becomes usable: A user can provide a readable public job-posting URL instead of copying its text, while blocked or unreadable pages never break the comparison experience.
  Why now: URL support adds convenience but is not part of the critical demo path. Building it after text and PDF means the core product remains usable even if websites restrict automated retrieval.
  PRD ref: `prd.md > Features and Behavior > Source Input`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > SourceInput`, `spec.md > Compare API Route`, `spec.md > Public webpage fetching`, `spec.md > Important Failure Modes`
  Build: Add URL input mode, validate normal public HTTP/HTTPS URLs, implement guarded server-side retrieval with a short timeout and response-size limits, extract readable page text, reject unsafe/private destinations, and display the agreed upload/paste fallback when content cannot be read.
  Verify (mechanical): Test one readable public page and one deliberately unreadable/invalid URL; confirm the readable source reaches comparison and the failure case produces the friendly fallback without crashing or losing the user's other input.
  Learner check: Try a public job URL, then try a bad or blocked URL, and confirm the failure message feels clear and tells you exactly what to do next.
  Commit: `Add safe best effort URL input`

- [x] **5. The complete PlotTwist journey feels polished and demo-ready**
  Becomes usable: The entire product—from first visit through loading, comparison, evidence review, errors, empty results, and responsive layouts—feels like one intentional consumer product rather than separate hackathon screens.
  Why now: The unique kernel is already working, so visual refinement now improves the judged experience without hiding unfinished core functionality behind polish.
  PRD ref: `prd.md > Look and Feel`, `prd.md > States and Boundaries`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Notification System`, `spec.md > Results Page`, `spec.md > Important Failure Modes`, `spec.md > Verification Plan`
  Build: Refine typography, spacing, document presentation, status emphasis, loading behavior, transitions, responsive layout, empty results state, validation messages, failure states, results-without-session handling, and final interface copy. Remove remaining starter/default styling and make Sample Data labeling clear without distracting from the result.
  Verify (mechanical): Run lint/build checks; test the core sample flow, live pasted-text flow, PDF flow, results route without session data, an invalid input, and responsive widths; confirm there are no blocking runtime errors, layout overflows, or broken core interactions.
  Learner check: Explore PlotTwist freely as if you were a first-time user, try the main journey and awkward inputs, and note anything that looks unfinished, confusing, or unlike the product you pictured.
  Commit: `Polish PlotTwist end to end experience`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after Slice 1, while visual and interaction feedback can still shape the live-comparison experiencelive-comparison experience
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops: Guided code tour through homepage orchestration, Gemini extraction, deterministic comparison, API routes, and results rendering.
Edit outcome: No additional edit required during the code tour; implementation was already complete and verified.
Reflection: Gemini extracts structured facts while PlotTwist keeps comparison status logic deterministic and evidence-backed.
Activity mode: Guided code tour + generated app map.

## Revisions