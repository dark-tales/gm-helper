const mongoose = require("mongoose")

const ObstacleSchema = new mongoose.Schema({
partyLvl: {Number},
partySize: {Number},
chasePoint:{Number},
biome: {
    type: String,
    enum: [
        "Aquatic",
        "Arctic",
        "Astral",
        "Desert",
        "Forest",
        "Swamp",
        "Mountain",
        "Plains",
        "Subterranean",
        "Urban",
        "Uncategorized"
    ]},
difficulty: {

}


})

const DilemmaTemplate = mongoose.model("DilemmaTemplate", dilemmaTemplateSchema)
module.exports = DilemmaTemplate