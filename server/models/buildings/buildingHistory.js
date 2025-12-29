const mongoose = require("mongoose")

// ITEMS schema and model

const buildingsHistorySchema = new mongoose.Schema({
    id: {
            type: mongoose.ObjectId
        },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "Social",
            "Residential",
            "Commercial",
            "Industrial",
            "Religious",
            "Magical",
            "Military",
            "Administrative",
            "Utility",
            "Criminal",
            "Academic",
            "Hospitality",
            "Civic",
            "Ruin",
            "Containment",
            "Medical",
            "Agricultural",
            "Transit",
            "Obscure",
            "Cultural",
            "Resource"
            ]
    },
    summary: {
        type: String,
        required: true,
    },
    exterior: {
        type: String,
        required: true,
    },
    interior_ground_floor: {
        type: String,
        required: true,
    },
    interior_upper_levels: {
        type: String
    },
    usefulness_hints: {
        type: [String],
        required: true,
    },
    activities_suggested: {
        type: [String],
        required: true,
    },
    primary_materials: {
        type: [String],
        required: true,
    },
    sound: {
        type: [String],
        required: true,
    },
    smell: {
        type: [String],
        required: true,
    },
    touch: {
        type: [String],
        required: true,
    },
    sight: {
        type: [String],
        required: true,
    },
    history_clues: {
        type: [String],
        required: true,
    },
    notable_decorations: {
        type: [String],
        required: true,
    },
    objects_laying_around: {
        type: [String],
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    currentNotes: {
        type: String
    },
    building_founded: {
        type: Boolean
    },
    building_visited: {
        type: Boolean
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
})

const buildingHistory = mongoose.model("buildingHistory", buildingsHistorySchema)

module.exports = buildingHistory