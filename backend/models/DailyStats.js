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

dailySchema.virtual("total").get(function () {
  const result = { solved: 0, easy: 0, medium: 0, hard: 0 };
  const { leetcode, gfg, codingNinjas } = this.platforms || {};

  if (leetcode) {
    result.solved += leetcode.solved || 0;
    result.easy += leetcode.easy || 0;
    result.medium += leetcode.medium || 0;
    result.hard += leetcode.hard || 0;
  }

  if (gfg) {
    result.solved += gfg.solved || 0;
    result.easy += (gfg.easy || 0) + (gfg.school || 0) + (gfg.basic || 0);
    result.medium += gfg.medium || 0;
    result.hard += gfg.hard || 0;
  }

  if (codingNinjas) {
    result.solved += codingNinjas.solved || 0;
    result.easy += codingNinjas.easy || 0;
    result.medium += codingNinjas.moderate || 0;
    result.hard += (codingNinjas.hard || 0) + (codingNinjas.ninja || 0);
  }

  return result;
});

dailySchema.set("toJSON", { virtuals: true });
dailySchema.set("toObject", { virtuals: true });

const DailyStats =
  mongoose.models.DailyStats || mongoose.model("DailyStats", dailySchema);

export default DailyStats;