import {
  employmentFieldKeys,
  type DocumentExtraction,
  type EmploymentFieldKey,
  type ExtractedTerm,
} from "./schemas";

export type FindingStatus = "match" | "changed" | "missing" | "new";

export type ComparisonFinding = {
  key: EmploymentFieldKey;
  label: string;
  status: FindingStatus;
  postingValue: string;
  offerValue: string;
  postingEvidence: string;
  offerEvidence: string;
  summary: string;
  clarification?: string;
};

export type ComparisonResult = {
  findings: ComparisonFinding[];
  counts: {
    match: number;
    changed: number;
    missing: number;
    new: number;
  };
};

function clean(value: string) {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNumbers(value: string): number[] {
  return value
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/g)
    ?.map(Number) ?? [];
}

function salaryMatches(posting: string, offer: string) {
  const postingNumbers = extractNumbers(posting);
  const offerNumbers = extractNumbers(offer);

  if (postingNumbers.length === 0 || offerNumbers.length === 0) {
    return clean(posting) === clean(offer);
  }

  const offerValue = offerNumbers[0];

  if (postingNumbers.length >= 2 && offerNumbers.length === 1) {
    const min = Math.min(postingNumbers[0], postingNumbers[1]);
    const max = Math.max(postingNumbers[0], postingNumbers[1]);

    return offerValue >= min && offerValue <= max;
  }

  if (postingNumbers.length === 1 && offerNumbers.length === 1) {
    return postingNumbers[0] === offerNumbers[0];
  }

  return clean(posting) === clean(offer);
}

function ptoMatches(posting: string, offer: string) {
  const postingDays = extractNumbers(posting)[0];
  const offerDays = extractNumbers(offer)[0];

  if (postingDays !== undefined && offerDays !== undefined) {
    return postingDays === offerDays;
  }

  return clean(posting) === clean(offer);
}

function workArrangementMatches(posting: string, offer: string) {
  const normalizeArrangement = (value: string) => {
    const normalized = clean(value);

    if (normalized.includes("hybrid")) return "hybrid";
    if (
      normalized.includes("remote") ||
      normalized.includes("work from home")
    ) {
      return "remote";
    }
    if (
      normalized.includes("on-site") ||
      normalized.includes("onsite") ||
      normalized.includes("in office") ||
      normalized.includes("in-office")
    ) {
      return "on-site";
    }

    return normalized;
  };

  return (
    normalizeArrangement(posting) === normalizeArrangement(offer)
  );
}

function benefitsMatch(posting: string, offer: string) {
  const normalizeBenefits = (value: string) =>
    clean(value)
      .split(/[,;/]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .sort();

  const postingBenefits = normalizeBenefits(posting);
  const offerBenefits = normalizeBenefits(offer);

  if (postingBenefits.length === 0 || offerBenefits.length === 0) {
    return clean(posting) === clean(offer);
  }

  return JSON.stringify(postingBenefits) === JSON.stringify(offerBenefits);
}

function valuesMatch(
  key: EmploymentFieldKey,
  posting: ExtractedTerm,
  offer: ExtractedTerm,
) {
  const postingValue =
    posting.normalizedValue || posting.displayValue;

  const offerValue =
    offer.normalizedValue || offer.displayValue;

  switch (key) {
    case "salary":
      return salaryMatches(postingValue, offerValue);

    case "pto":
      return ptoMatches(postingValue, offerValue);

    case "workArrangement":
      return workArrangementMatches(postingValue, offerValue);

    case "benefits":
      return benefitsMatch(postingValue, offerValue);

    default:
      return clean(postingValue) === clean(offerValue);
  }
}

function buildSummary(
  status: FindingStatus,
  label: string,
) {
  switch (status) {
    case "changed":
      return `${label} differs between the original posting and the final offer.`;

    case "missing":
      return `${label} appeared in the original posting but is not mentioned in the final offer.`;

    case "new":
      return `${label} appears in the final offer but was not mentioned in the original posting.`;

    case "match":
      return `${label} matches the original job posting.`;
  }
}

function buildClarification(
  key: EmploymentFieldKey,
  status: FindingStatus,
  postingValue: string,
  offerValue: string,
): string | undefined {
  if (status === "match") {
    return undefined;
  }

  if (status === "missing") {
    return `Could you clarify whether ${postingValue} is still included, since it appeared in the original job posting but is not mentioned in the offer?`;
  }

  if (status === "new") {
    return `Could you clarify the ${offerValue} term that appears in the offer but was not mentioned in the original job posting?`;
  }

  switch (key) {
    case "salary":
      return `Could you clarify why the offered compensation (${offerValue}) differs from the compensation shown in the original posting (${postingValue})?`;

    case "workArrangement":
      return `Could you clarify why the work arrangement changed from ${postingValue} to ${offerValue}?`;

    case "pto":
      return `Could you clarify why the PTO in the offer (${offerValue}) differs from what was advertised (${postingValue})?`;

    case "bonus":
      return `Could you clarify how the bonus terms in the offer (${offerValue}) relate to what was advertised (${postingValue})?`;

    case "probation":
      return `Could you clarify the probation terms in the offer and how they differ from the original posting?`;

    case "title":
      return `Could you clarify why the offered job title (${offerValue}) differs from the title in the original posting (${postingValue})?`;

    default:
      return `Could you clarify why this term changed from "${postingValue}" to "${offerValue}"?`;
  }
}

export function compareDocuments(
  posting: DocumentExtraction,
  offer: DocumentExtraction,
): ComparisonResult {
  const postingTerms = new Map(
    posting.terms.map((term) => [term.key, term]),
  );

  const offerTerms = new Map(
    offer.terms.map((term) => [term.key, term]),
  );

  const findings: ComparisonFinding[] = [];

  for (const key of employmentFieldKeys) {
    const postingTerm = postingTerms.get(key);
    const offerTerm = offerTerms.get(key);

    if (!postingTerm || !offerTerm) {
      continue;
    }

    if (!postingTerm.present && !offerTerm.present) {
      continue;
    }

    let status: FindingStatus;

    if (postingTerm.present && !offerTerm.present) {
      status = "missing";
    } else if (!postingTerm.present && offerTerm.present) {
      status = "new";
    } else if (valuesMatch(key, postingTerm, offerTerm)) {
      status = "match";
    } else {
      status = "changed";
    }

    findings.push({
      key,
      label: postingTerm.label || offerTerm.label,
      status,
      postingValue: postingTerm.present
        ? postingTerm.displayValue
        : "Not mentioned",
      offerValue: offerTerm.present
        ? offerTerm.displayValue
        : "Not mentioned",
      postingEvidence: postingTerm.evidence,
      offerEvidence: offerTerm.evidence,
      summary: buildSummary(
  status,
  postingTerm.label || offerTerm.label,
),
      clarification: buildClarification(
        key,
        status,
        postingTerm.present
          ? postingTerm.displayValue
          : "Not mentioned",
        offerTerm.present
          ? offerTerm.displayValue
          : "Not mentioned",
      ),
    });
  }

  const priority: Record<FindingStatus, number> = {
    changed: 0,
    missing: 1,
    new: 2,
    match: 3,
  };

  findings.sort(
    (a, b) => priority[a.status] - priority[b.status],
  );

  return {
    findings,
    counts: {
      changed: findings.filter(
        (finding) => finding.status === "changed",
      ).length,
      missing: findings.filter(
        (finding) => finding.status === "missing",
      ).length,
      new: findings.filter(
        (finding) => finding.status === "new",
      ).length,
      match: findings.filter(
        (finding) => finding.status === "match",
      ).length,
    },
  };
}