import mongoose from "mongoose";

const leetcodeStatsSchema = new mongoose.Schema(
  {
    solved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  { _id: false }
);

const codingNinjasStatsSchema = new mongoose.Schema(
  {
    solved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    ninja: { type: Number, default: 0 },
  },
  { _id: false }
);

const gfgStatsSchema = new mongoose.Schema(
  {
    solved: { type: Number, default: 0 },
    school: { type: Number, default: 0 },
    basic: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  { _id: false }
);

const dailySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: { type: Date, required: true },
    platforms: {
      leetcode: { type: leetcodeStatsSchema, default: () => ({}) },
      gfg: { type: gfgStatsSchema, default: () => ({}) },
      codingNinjas: { type: codingNinjasStatsSchema, default: () => ({}) },
    },
    topics: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

dailySchema.index({ userId: 1, date: 1 }, { unique: true });
dailySchema.index({ userId: 1, date: -1 });

const DailyStats =
  mongoose.models.DailyStats || mongoose.model("DailyStats", dailySchema);

export default DailyStats;