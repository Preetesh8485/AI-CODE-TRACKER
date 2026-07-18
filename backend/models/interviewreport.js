import mongoose from "mongoose";

const skillBreakdownEntrySchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
  },
  { _id: false }
);

const resumeClaimResultSchema = new mongoose.Schema(
  {
    claim: { type: String, required: true },
    status: {
      type: String,
      enum: ["verified", "partially_verified", "questionable"],
      required: true,
    },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

// Before/after comparison: what the ATS predicted vs. what the interview
// actually surfaced as evidence (see Phase 12 in the build plan).
const jdReadinessGapSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    atsPrediction: { type: String, default: "" }, // e.g. "Missing"
    interviewEvidence: { type: String, default: "" }, // e.g. "62%"
    recommendedResource: { type: String, default: "" },
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      unique: true,
    },

    overallPerformance: {
      technicalScore: { type: Number, min: 0, max: 100 },
      communicationScore: { type: Number, min: 0, max: 100 },
      problemSolvingScore: { type: Number, min: 0, max: 100 },
    },

    skillBreakdown: {
      strongest: { type: [skillBreakdownEntrySchema], default: [] },
      weakest: { type: [skillBreakdownEntrySchema], default: [] },
    },

    resumeClaims: {
      verified: { type: [resumeClaimResultSchema], default: [] },
      partiallyVerified: { type: [resumeClaimResultSchema], default: [] },
      questionable: { type: [resumeClaimResultSchema], default: [] },
    },

    jdReadiness: {
      conceptGaps: { type: [jdReadinessGapSchema], default: [] },
      recommendedLearningPath: { type: [String], default: [] },
      questionsToPractice: { type: [String], default: [] },
    },
    rawReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

const InterviewReport =
  mongoose.models.InterviewReport ||
  mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReport;