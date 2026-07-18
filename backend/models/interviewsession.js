import mongoose from "mongoose";

const questionHistoryEntrySchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    intent: {
      type: String,
      enum: ["resume_verification", "jd_coverage", "probe", "baseline"],
      default: "baseline",
    },
    knowledgeIds: [{ type: String }],
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    evaluation: {
      score: { type: Number, min: 0, max: 100 },
      correctness: { type: Number, min: 0, max: 10 },
      depth: { type: Number, min: 0, max: 10 },
      clarity: { type: Number, min: 0, max: 10 },
      coveredConcepts: [{ type: String }],
      missedConcepts: [{ type: String }],
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      recommendedAction: {
        type: String,
        enum: ["simplify", "probe", "increase_difficulty", "change_topic"],
      },
    },
    askedAt: { type: Date, default: Date.now },
    answeredAt: { type: Date },
  },
  { _id: false }
);

const skillStateEntrySchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100, default: 0 },
    questionsAsked: { type: Number, default: 0 },
    evidence: [{ type: String }],
    confidence: { type: Number, min: 0, max: 1, default: 0 },
  },
  { _id: false }
);

const resumeClaimSchema = new mongoose.Schema(
  {
    claim: { type: String, required: true },
    topic: { type: String },
    status: {
      type: String,
      enum: ["unverified", "verified", "partially_verified", "questionable"],
      default: "unverified",
    },
    evidence: [{ type: String }],
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },

    // Output of interview_planner.py — shape varies by role, kept flexible
    interviewPlan: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    currentQuestion: {
      type: questionHistoryEntrySchema,
      default: null,
    },
    questionHistory: {
      type: [questionHistoryEntrySchema],
      default: [],
    },

    // Keyed by skill/topic name, e.g. skillState.get("Docker")
    skillState: {
      type: Map,
      of: skillStateEntrySchema,
      default: {},
    },

    resumeClaims: {
      type: [resumeClaimSchema],
      default: [],
    },
    topicsCovered: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["planned", "in_progress", "paused", "completed", "abandoned"],
      default: "planned",
    },
  },
  { timestamps: true }
);

interviewSessionSchema.index({ userId: 1, status: 1 });

const InterviewSession =
  mongoose.models.InterviewSession ||
  mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;