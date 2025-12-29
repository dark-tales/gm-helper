const mongoose = require("mongoose")

// STORY HOOKS Schema and model
const hookHistorySchema = new mongoose.Schema({
    id: {
        type: mongoose.ObjectId
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "Physical",             
            "Discovery",
            "Environmental",
            "Investigation", 
            "Ambush", 
            "Magical",
            "Social",
            "Uncategorized"
        ]
    },
    biome: {
        type: String,
        required: true,
        enum: [
            "Aquatic",
            "arctic",
            "Astral",
            "Desert",
            "Forest",
            "Swamp",
            "Mountain",
            "Plains",
            "Subterranean",
            "Urban",
            "Uncategorized"
        ]
    },
    current_difficulty: {
        type: String,
    },
    potential_outcomes: {
        type: [String],
        required: true,
    },
    plot_twist: {
        type: [String],
        required: true,
    },
    loot: {
        type: [String],
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    currentNotes: {
        type: String
    },
    event_started: {
        type: Boolean
    },
    event_succeed: {
        type: Boolean
    },
})

const StoryHookHistory = mongoose.model("StoryHookHistory", hookHistorySchema)

module.exports = StoryHookHistory
