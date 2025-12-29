const mongoose = require("mongoose")

// Opportunity event Template Schema (for predefined events)
const opportunityTemplateSchema = new mongoose.Schema({
  id: { type: mongoose.ObjectId },
  type: { type: String, default: 'Opportunity', required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['Ongoing', 'Success', 'Failure']},
  description: { type: String, required: true },
  strainLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  cost: [{
    attribute: { type: String, enum: ['population', 'culture', 'stability', 'reputation', 'morale', 'culture'] },
    change: { type: Number }
  }],
  effects: [{
    attribute: { type: String, enum: ['population', 'culture', 'stability', 'reputation', 'morale', 'culture'] },
    change: { type: Number }
  }],
  skillCheck: [{
    easy: String,
    medium: String,
    hard: String
  }],
  currentSuccess: { type: Number },
  successToComplete: { type: Number },
  roundRemaining: { type: Number },
  roundTotal: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const OpportunityTemplate = mongoose.model("OpportunityTemplate", opportunityTemplateSchema)
module.exports = OpportunityTemplate