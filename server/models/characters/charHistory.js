const mongoose = require("mongoose")

// STORY HOOKS Schema and model
const allCharHistorySchema = new mongoose.Schema({
    id: {
        type: mongoose.ObjectId
    },
    name: {
        type: String,
        required: true,
    },
    commonAncestries : {
        type: String,
        default: null,
        enum: [
            "",
            "Dwarf",
            "Elf",
            "Gnome",
            "Goblin",
            "Halfling",
            "Human",
            "Leshy",
            "Orc"
            ]
    },
    uncommonAncestries  : {
        type: String,
        default: null,
        enum: [
            "",
            "Amurrun",
            "Azarketi",
            "Fetchling",
            "Hobgoblin",
            "Iruxi",
            "Kholo",
            "Kitsune",
            "Kobold",
            "Nagaji",
            "Tengu",
            "Tripkee",
            "Vanara",
            "Ysoki", 
            ]
    },
    rareAncestries  : {
        type: String,
        default: null,
        enum: [
            "",
            "Anadi",
            "Android",
            "Automaton", 
            "Conrasu",
            "Fleshwarp",
            "Ghoran",
            "Goloma",
            "Kashrishi",
            "Poppet",
            "Shisk",
            "Shoony",
            "Skeleton",
            "Sprite",
            "Strix",
            "Vishkanya"
            ]
    },
    versatileAncestries : {
        type: String,
        default: null,
        enum: [
            "",
            "Aiuvarin",
            "Beastkin",
            "Changeling",
            "Dhampir",
            "Dromaar",
            "Geniekin",
            "Nephilim"
        ]
    },
    ancestry_description: {
        type: String,
        required: true,
    },
    ancestry_rarity: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    },
    edict: {
        type: String,
        required: true,
    },
    anathema: {
        type: String,
        required: true,
    },
    main_attribute: {
        type: String,
        required: true,
    },
    main_skill: {
        type: String,
        required: true,
    },
    lore_skill: {
        type: String,
        required: true,
    },
    best_social_approach: {
        type: String,
        required: true,
    },
    worst_social_approach: {
        type: String,
        required: true,
    },
    social_penalty: {
        type: String,
        required: true,
    },
    physical_traits: {
        type: [String],
        required: true,
    },
    psychological_traits: {
        type: [String],
        required: true,
    },
    quirks: {
        type: [String],
        required: true,
    },
    dark_secret: {
        type: String,
        required: true,
    },
    character_arc: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    currentNotes: {
        type: String
    },
    currentAttitude: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const AllCharacterHistory = mongoose.model("AllCharacterHistory", allCharHistorySchema)

module.exports = AllCharacterHistory