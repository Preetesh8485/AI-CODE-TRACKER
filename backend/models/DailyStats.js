import mongoose from "mongoose";
const DailySchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    date:{
        type:Date,
        default:Date.now
    },
    platforms:{
        leetcode: {
        solved: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
      },
      gfg: {
        solved: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
      },
      codingNinjas: {
        solved: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
      }
    },
    topics: {
      type: Map,
      of: Number,
      default: {}
    }
},{timestamps:true});
DailySchema.index({ userId: 1, date: -1 });
const DailyStats = mongoose.models.DailyStats || mongoose.model("DailyStats", DailySchema);
export default DailyStats;