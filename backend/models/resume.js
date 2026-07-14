import mongoose from "mongoose";
const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true,
    },

    fileType: {
        type: String,
        enum: ["pdf", "docx"],
        required: true
    },

    rawText: {
        type: String,
        default: "",
    }
    ,
    parsedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
},

    atsReport: {
    type: mongoose.Schema.Types.Mixed,
    default: null
},
}, {
    timestamps: true,
})
const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
export default Resume;