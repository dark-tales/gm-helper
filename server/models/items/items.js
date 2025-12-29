const mongoose = require("mongoose")

// ITEMS schema and model

const allItemsSchema = new mongoose.Schema({
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
            "Adventuring Gear",
            "Alchemical Items",
            "Animals and Gear",
            "Apex Items",
            "Armor",
            "Artifacts",
            "Assistive Items",
            "Blighted Boons",
            "Censers",
            "Consumables",
            "Contracts",
            "Cursed Items",
            "Customizations",
            "Figureheads",
            "Grafts",
            "Grimoires",
            "Intelligent Items",
            "Materials",
            "Relics",
            "Runes",
            "Shields",
            "Siege Weapons",
            "Snares",
            "Spellhearts",
            "Staves",
            "Vehicles",
            "Wands",
            "Weapons",
            "Worn Item"
        ]
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    item_history: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    hidden_place: {
        type: String,
        required: true,
    },
    tips: {
        type: [String],
        required: true,
    },
    author: {
        type: [String],
        required: true,
    },
})

const AllItem = mongoose.model("AllItems", allItemsSchema)

module.exports = AllItem