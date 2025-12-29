const mongoose = require("mongoose")

// Rumor Template Schema 
const rumorTemplateSchema = new mongoose.Schema({
  id: { type: mongoose.ObjectId },
  type: { type: String, default: 'Rumor', required: true },
  eventType: { type: String, required: true, enum: ['Treasure Hunt', 'Social / Political Intrigue', 'Exploration', 'Bounty / Monster Hunt'] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  contact: { type: String, required: true },
  contactMotivation: { type: String, required: true },
  locationType: { type: String, required: true, enum: ['Specific NPC Property', 'Dangerous Dungeon / Ruin', 'Generic Locale', 'Unique Geographical Feature'] },
  specificLocation: { type: String, required: true },
  believability: { type: String, required: true, enum: ['Completely False', 'Partially True', 'Completely True'] },
  twist: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const RumorTemplate = mongoose.model("RumorTemplate", rumorTemplateSchema)

module.exports = RumorTemplate