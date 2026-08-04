import type { ExecutionStatus } from "../domain/types.js";

export interface OutcomeCopy {
  outcome: string;
  broadcast: string;
  explanation: string;
  nextStep: string;
}

export interface OutcomeInput {
  status: ExecutionStatus;
  broadcastMade: boolean;
  errorCode?: string;
  reasons?: readonly string[];
}

const MISSING_LABEL_CODES: ReadonlySet<string> = new Set(["blocked-missing-required-label"]);

export function describeOutcome(input: OutcomeInput): OutcomeCopy {
  switch (input.status) {
    case "confirmed":
      return {
        outcome: "Confirmed",
        broadcast: input.broadcastMade ? "Sent once" : "Not repeated",
        explanation: input.broadcastMade
          ? "The transfer was submitted once and reached a completed state."
          : "A prior execution was already sent and has now reached a completed state.",
        nextStep: "No action needed. The receipt comment links the Sepolia transaction.",
      };
    case "duplicate":
      return {
        outcome: "Existing payment found",
        broadcast: "Not repeated",
        explanation:
          "A prior execution already covers this payment. The existing proof was returned instead of sending another transfer.",
        nextStep: "No action needed. Review the existing receipt for the original transaction.",
      };
    case "blocked":
      return {
        outcome: "Stopped before broadcast",
        broadcast: "Not attempted",
        explanation: "Policy stopped this run before KeeperHub was asked to transfer anything.",
        nextStep: blockedNextStep(input.reasons ?? []),
      };
    case "pending":
      return {
        outcome: "Waiting for confirmation",
        broadcast: "Outcome uncertain",
        explanation: "A transfer was submitted but its terminal state is not confirmed yet.",
        nextStep:
          "Do not re-run yet. Check the execution ID and the receipt, then re-run only after the outcome is known.",
      };
    case "manual-review":
      return {
        outcome: "Manual review required",
        broadcast: "Outcome uncertain",
        explanation: input.broadcastMade
          ? "A transfer was submitted but its outcome could not be confirmed."
          : "The run stopped because a prior execution has an uncertain or conflicting outcome.",
        nextStep:
          "Review the recorded execution ID and receipt evidence before taking any further action. Skirwith will not broadcast again automatically.",
      };
    case "failed":
      return {
        outcome: "Failed safely",
        broadcast: input.broadcastMade ? "Sent once" : "Not attempted",
        explanation: input.broadcastMade
          ? "The transfer was submitted but reached a failed terminal state."
          : "The run failed before any transfer was submitted.",
        nextStep: failedNextStep(input.errorCode),
      };
  }
}

function blockedNextStep(reasons: readonly string[]): string {
  if (reasons.some((code) => MISSING_LABEL_CODES.has(code))) {
    return "Add the required payout label, then re-run after a new merge event.";
  }
  if (reasons.length > 0) {
    return "Check the reasons listed in the run, update the trusted config or event, then re-run after a new merge event.";
  }
  return "Check the trusted configuration, then re-run after a new merge event.";
}

function failedNextStep(errorCode: string | undefined): string {
  switch (errorCode) {
    case "PROVIDER_SIMULATION_FAILED":
      return "The simulated transfer would revert. Check wallet funding, allowance, and token before re-running.";
    case "PROVIDER_AUTH_FAILED":
      return "KeeperHub could not authenticate. Verify the configured API key, then re-run.";
    case "PROVIDER_RATE_LIMITED":
      return "KeeperHub temporarily limited this request. Wait before re-running and confirm any existing receipt first.";
    default:
      return "Check the error code and any existing receipt before re-running.";
  }
}
