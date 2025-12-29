const mongoose = require("mongoose")

// Event Template Schema (for predefined events)
const eventTemplateSchema = new mongoose.Schema({
  id: { type: mongoose.ObjectId },
  type: { type: String, default: 'Automatic', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  strainLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  effects: [{
    attribute: { type: String, enum: ['population', 'culture', 'stability', 'reputation', 'morale', 'culture'] },
    change: { type: Number }
  }],
  triggerConditions: [{
    attribute: { type: String, enum: ['population', 'culture', 'stability', 'reputation', 'morale', 'culture'] },
    threshold: { type: Number },
    operator: { type: String, enum: ['<=', '>=', '=='] }
  }],
  createdAt: { type: Date, default: Date.now }
});

const EventsTemplate = mongoose.model("EventsTemplate", eventTemplateSchema)

module.exports = EventsTemplate