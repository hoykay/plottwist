---
doc: prd
status: approved
---

# PlotTwist — Product Requirements

PlotTwist helps a job seeker compare the original job posting with the final job offer and see important differences before signing.

Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey

1. The user opens PlotTwist and immediately understands that the product checks whether the final offer still matches the job they originally applied for.

2. The first screen centers on two inputs:
   - Original job posting
   - Final job offer

3. For the original job posting, the user can provide the source by:
   - uploading a document, or
   - entering the job-posting URL.

4. For the final offer, the user can provide the source by:
   - uploading the offer document, or
   - entering a document link.

5. Once both sources are available, the user starts the comparison.

6. PlotTwist moves to a separate dedicated results screen.

7. The results screen displays the original job posting and the final offer side by side.

8. Relevant passages inside both documents are highlighted so the user can see the evidence behind each finding.

9. PlotTwist identifies important employment terms and shows whether each one:
   - matches,
   - changed,
   - is missing from the final offer, or
   - is new in the final offer.

10. A summary/differences panel appears beside the documents on larger screens or below them when space is limited.

11. The panel explains the important differences and reminds the user about items they may have overlooked.

12. The user can use those findings to decide what they want to clarify before signing.

Success means the user can immediately understand what changed and can verify each important finding against the original source text.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## Screens and Layout

### 1. Input Screen

The input screen should be simple and focused.

At the top:
- PlotTwist branding
- A clear headline explaining the purpose
- A short supporting sentence

The center of the page contains the main interaction:
- Original Job Posting input
- Final Job Offer input

The two inputs should be visually balanced and clearly labeled.

The user should be able to upload a document or provide the relevant URL/link.

A clear primary action starts the comparison.

The upload area is the visual focus of the screen rather than a large marketing-style homepage.

### 2. Results Screen

The results screen is a separate dedicated screen.

The main layout contains:
- Original job posting on the left
- Final offer on the right
- Highlighted evidence inside both documents
- A summary/differences panel beside or below the documents

The documents should remain visible while the user reviews the findings.

The result should feel like a professional document-review experience rather than a generic AI-generated summary.

Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`.

## Look and Feel

PlotTwist should feel:

- Trustworthy
- Editorial
- Premium
- Professional
- Friendly
- Clean
- Intentionally designed

The interface should use a clean, warm-white background rather than a dark theme.

Established color direction:

- Warm white background: `#FAFAF8`
- Ink / near-black text: `#171717`
- Deep navy primary accent: `#23314D`
- Muted cobalt secondary accent: `#4B5E8A`
- Soft gray borders and dividers: `#E7E5E1`
- Changed findings: muted burgundy `#A64B4B`
- Missing findings: warm ochre `#B9822E`
- New findings: dusty blue `#5277A3`
- Matching findings: cool slate `#6F7782`

Green should not be used as the main success/match color.

Typography should combine:
- a refined serif character for major headings, and
- a clean sans-serif character for interface text and document information.

The interface should use strong hierarchy, generous whitespace, restrained color, subtle document highlights, and elegant dividers.

Avoid:
- generic AI gradients
- excessive glass effects
- unnecessary rounded cards
- cluttered dashboards
- loud colors
- an obvious “vibe-coded” appearance

Source: `scope.md > Inspiration & Identity`.

## Features and Behavior

### Source Input

The user can provide:
- an original job posting
- a final job offer

Each source must be clearly identified so the user always knows which document is which.

The user can use a supported file upload or a relevant URL/link.

The comparison cannot begin until both required sources are available.

### Comparison

PlotTwist compares important employment terms that appear in the two sources.

Relevant terms may include:
- salary
- job title
- remote/hybrid/on-site arrangement
- PTO
- bonus
- benefits
- location
- working hours
- probation terms

The output should focus on meaningful differences rather than producing a long generic document summary.

### Finding Statuses

Each meaningful term can appear as:

- **Match** — the terms agree.
- **Changed** — the final offer contains a materially different term.
- **Missing** — something stated in the job posting is not found in the offer.
- **New** — an important term appears in the offer that was not present in the posting.

The visual importance should prioritize changed, missing, and new findings over matches.

### Evidence-Linked Findings

Every important comparison finding should be supported by visible evidence.

The original source passage and the corresponding offer passage should be highlighted.

The user should be able to understand why PlotTwist produced a finding without having to trust an unsupported AI summary.

This evidence-linked comparison is a core product behavior.

### Summary and Differences

The results screen includes a concise summary of the important findings.

It should help the user notice details they may have overlooked before signing.

The summary should not replace the source evidence; it should make the evidence easier to understand.

### Things to Clarify

PlotTwist should surface important changed, missing, or newly introduced terms that may be worth clarifying before signing.

It should describe the discrepancy neutrally.

PlotTwist does not determine whether an employment term is legally valid or invalid.

Source: `scope.md > The Unique Kernel`, `scope.md > The POC Boundary`.

## States and Boundaries

### First Use

The user sees a clean input screen with two clearly labeled source areas and understands what information is needed.

### Ready to Compare

Once both required sources are available, the user can begin the comparison.

### Comparing

The interface should clearly indicate that PlotTwist is processing the two sources so the user understands that something is happening.

### Successful Result

The user reaches the dedicated results screen and can see:
- both sources
- highlighted evidence
- finding statuses
- the summary of important differences

### Unreadable Input

If PlotTwist cannot read a source, it should show a calm, human-readable notification explaining what happened and what the user can try next.

Example experience:

“We couldn’t read this job posting. Check the link or upload the document instead.”

### Insufficient Information

If the provided source does not contain enough information for a meaningful comparison, PlotTwist should explain that clearly.

Example experience:

“This offer doesn’t contain enough information to compare yet. Try uploading the full offer letter.”

Technical error codes should not be shown to the user.

## Product Decisions

- PlotTwist uses a separate results screen because the comparison deserves a focused, premium review experience.
- Evidence remains visible beside the findings because trust is central to the product.
- The product prioritizes changed, missing, and new terms rather than drawing attention to ordinary matches.
- The design uses a clean white editorial direction rather than a typical AI/SaaS aesthetic.
- Green is intentionally avoided as a primary status color.
- The POC does not include accounts or login because they do not improve the core comparison experience.
- PlotTwist highlights discrepancies rather than making legal judgments.

## What We're Building

The proof of concept must allow the user to:

- provide an original job posting
- provide a final job offer
- begin a comparison
- move to a dedicated results screen
- view the two sources side by side
- see highlighted supporting evidence
- see meaningful terms classified as match, changed, missing, or new
- understand the important differences through a summary
- see items they may want to clarify before signing
- receive useful notifications when an input cannot be used

The full journey should feel smooth, cohesive, and polished enough to resemble a real consumer product rather than a hackathon prototype.

## Deferred From the POC

- Accounts and login — unnecessary for demonstrating the core value.
- Saved comparison history — requires persistence that does not improve the main demo.
- Job application tracking — broadens the product beyond offer comparison.
- Salary benchmarking — useful later but not necessary to identify discrepancies.
- Negotiation chatbot — would weaken PlotTwist's focused product identity.
- Recruiter/employer tools — the first version is for job seekers.
- Browser extensions — unnecessary for the core proof.
- External job-platform integrations — add complexity without strengthening the core demo.
- Mobile app — a responsive web product is enough for the proof of concept.

## Possible Later Enhancements

PlotTwist could later support saved comparisons, user accounts, exportable reports, salary benchmarking, job tracking, and direct integrations with job platforms.

Those features should only be considered after the core comparison experience is proven useful.

## Non-Goals

- PlotTwist is not a general AI career assistant.
- PlotTwist is not a resume builder.
- PlotTwist is not an interview coach.
- PlotTwist is not a job-search engine.
- PlotTwist is not a legal-advice product.
- PlotTwist does not decide whether an employer acted lawfully.
- PlotTwist does not negotiate with the employer on the user's behalf.

## Open Questions

No product-defining questions currently block the technical specification.

Technical decisions about document processing, URL handling, comparison logic, and implementation will be decided in `4-spec`.