const mongoose = require("mongoose")

// Dilemma event Template Schema (for predefined events)
const dilemmaTemplateSchema = new mongoose.Schema({
  id: { type: mongoose.ObjectId },
  type: { type: String, default: 'Dilemma', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  strainLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  choice1: {
    description: { type: String, required: true },
    effects: [{
    attribute: { type: String, enum: ['population', 'culture', 'stability', 'reputation', 'morale', 'resources'] },
    change: { type: Number }
    }]
  },
  choice2: {
    description: { type: String, required: true },
    effects: [{
    attribute: { type: String, enum: ['population', 'culture', 'stability', 'reputation', 'morale', 'resources'] },
    change: { type: Number }
    }]
  },
  decision: {Number},
  createdAt: { type: Date, default: Date.now }
});

const DilemmaTemplate = mongoose.model("DilemmaTemplate", dilemmaTemplateSchema)
module.exports = DilemmaTemplate