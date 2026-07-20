export type InitialMode = "fresh" | "established";

export type Screen =
  | "welcome"
  | "setup"
  | "today"
  | "walk-overview"
  | "walk-guide"
  | "walk-summary"
  | "garden"
  | "assistant"
  | "activity"
  | "add-plant";

export type WalkStatus = "pending" | "good" | "attention" | "skipped";

export type WalkItem = {
  id: number;
  area: string;
  place: string;
  name: string;
  meta: string;
  prompt: string;
  detail: string;
  status: WalkStatus;
};
