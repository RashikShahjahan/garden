import type { WalkItem } from "./types";

export const initialWalkItems: WalkItem[] = [
  { id: 1, area: "Patio", place: "Container", name: "Cherry tomato", meta: "Established · Flowering", prompt: "Check the soil one finger deep. How does the plant look?", detail: "Containers dry faster, and today will be warm before the rain arrives.", status: "pending" },
  { id: 2, area: "Patio", place: "3 containers", name: "Herb pots", meta: "Basil, mint & parsley", prompt: "Look for drooping leaves and check the top layer of soil.", detail: "A quick check is enough. Water only if the soil feels dry.", status: "pending" },
  { id: 3, area: "Raised bed", place: "Leafy greens patch", name: "Kale & lettuce", meta: "Young plants", prompt: "Look under two or three leaves. Do you see fresh holes or insects?", detail: "You noticed a few small holes during the last walk.", status: "attention" },
  { id: 4, area: "Back border", place: "In-ground", name: "Hydrangea", meta: "Established · Flowering", prompt: "Compare the leaves with your last check. Are they still upright?", detail: "No action is expected unless the leaves are wilting before midday.", status: "pending" },
];

export const gardenAreas = [
  { name: "Patio", type: "Containers", light: "Mostly sunny", note: "Check first on warm days", plants: [
    { name: "Cherry tomato", detail: "One plant · Flowering", status: "Check today", tone: "check" },
    { name: "Herb pots", detail: "Basil, mint & parsley", status: "Doing well", tone: "good" },
  ] },
  { name: "Raised bed", type: "Mixed vegetables", light: "Mostly sunny", note: "Rain should cover watering", plants: [
    { name: "Kale & lettuce", detail: "One patch · Young plants", status: "Follow up", tone: "attention" },
    { name: "Sweet peppers", detail: "Three plants · Established", status: "Doing well", tone: "good" },
  ] },
  { name: "Back border", type: "In-ground", light: "Partly sunny", note: "No care due today", plants: [
    { name: "Hydrangea", detail: "One shrub · Flowering", status: "Doing well", tone: "good" },
    { name: "Coneflowers", detail: "One patch · Flowering", status: "Doing well", tone: "good" },
  ] },
];

export const startingThreads = [
  { id: 1, title: "Kale leaf holes", context: "Kale & lettuce · Raised bed", time: "Today", preview: "A few small holes can come from..." },
  { id: 2, title: "Watering before rain", context: "Whole garden", time: "Yesterday", preview: "Check the patio containers first..." },
  { id: 3, title: "Hydrangea afternoon wilt", context: "Hydrangea · Back border", time: "Jul 15", preview: "Temporary afternoon wilt can be..." },
];
