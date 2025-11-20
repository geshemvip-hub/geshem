import { Maneuver } from './types';

// F2B Aerobatics Schedule based on provided score sheet
export const F2B_MANEUVERS: Maneuver[] = [
  // "Release within 1 minute" removed as per request
  { id: 2, name: "המראה וטיסה אופקית", kFactor: 2, icon: "PlaneTakeoff" }, // Take-off
  { id: 3, name: "חיצוי כפול", kFactor: 8, icon: "RefreshCcw" }, // Reverse Wingover
  { id: 4, name: "שלוש לולאות רצופות פנימיות", kFactor: 6, icon: "Circle" }, // 3 Inside Loops
  { id: 5, name: "טיסה הפוכה (שתי הקפות)", kFactor: 2, icon: "Repeat" }, // Inverted Flight
  { id: 6, name: "שלוש לולאות רצופות חיצוניות", kFactor: 6, icon: "CircleDashed" }, // 3 Outside Loops
  { id: 7, name: "שתי לולאות פנימיות מרובעות רצופות", kFactor: 12, icon: "Square" }, // 2 Inside Square Loops
  { id: 8, name: "שתי לולאות חיצוניות מרובעות רצופות", kFactor: 12, icon: "BoxSelect" }, // 2 Outside Square Loops
  { id: 9, name: "שתי לולאות משולשות רצופות", kFactor: 14, icon: "Triangle" }, // 2 Triangular Loops
  { id: 10, name: "שתי שמיניות אופקיות", kFactor: 7, icon: "Infinity" }, // 2 Horizontal Eights
  { id: 11, name: "שתי שמיניות אופקיות מרובעות", kFactor: 18, icon: "LayoutGrid" }, // 2 Square Horizontal Eights
  { id: 12, name: "שתי שמיניות אנכיות", kFactor: 10, icon: "GitCommitVertical" }, // 2 Vertical Eights
  { id: 13, name: "שמינית אנכית משולשת", kFactor: 10, icon: "Hourglass" }, // Hourglass / Triangular Eight
  { id: 14, name: "שתי שמיניות מעל הראש רצופות", kFactor: 10, icon: "MoveVertical" }, // 2 Overhead Eights
  { id: 15, name: "דמוי עלי תלתן", kFactor: 8, icon: "Clover" }, // Four Leaf Clover
  { id: 16, name: "נחיתה", kFactor: 5, icon: "PlaneLanding" }, // Landing
];

export const FLIGHT_TIME_MINUTES = 7;
export const TOTAL_FLIGHT_TIME_MS = FLIGHT_TIME_MINUTES * 60 * 1000;