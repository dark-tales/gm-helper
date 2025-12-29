const mongoose = require("mongoose")

// Settlement Schema
const settlementSchema = new mongoose.Schema({
  id: { type: mongoose.ObjectId },
  title: { type: String, required: true },
  region: { type: String }, 
  attributes : {
    population: { type: Number, min: 0, max: 20, default: 10 },
    culture: { type: Number, min: 0, max: 20, default: 10 },
    stability: { type: Number, min: 0, max: 20, default: 10 },
    reputation: { type: Number, min: 0, max: 20, default: 10 },
    morale: { type: Number, min: 0, max: 20, default: 10 },
    resources: { type: Number, min: 0, max: 20, default: 10 }
  },
  strain: { type: Number, default: 0 },
  strainLevel: { type: String, enum: ['Low', 'Moderate', 'High'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
  ,
  history: [{
    title: { type: String },
    createdAt: { type: Date },
    description: { type: String },
    type: { type: String },
    cost: [{
    attribute: { type: String },
    change: { type: Number }
    }],
    skillCheck: [{
    easy: String,
    medium: String,
    hard: String
    }],
    status: { type: String, enum: ['Ongoing', 'Success', 'Failure']},
    successToComplete: { type: Number },
    roundRemaining: { type: Number },
    eventType: { type: String },
    contact: { type: String },
    contactMotivation: { type: String },
    locationType: { type: String }, 
    specificLocation: { type: String },
    believability: { type: String }, 
    twist: { type: String }, 
    effects: [{
      attribute: String,
      change: Number
      }] 
  }],
  onGoing: [{
    title: { type: String },
    description: { type: String },
    type: { type: String },
    status: { type: String, enum: ['Ongoing', 'Success', 'Failure']},
    cost: [{
      attribute: String,
      change: Number
      }], 
    effects: [{
      attribute: String,
      change: Number
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
  }]
})

const Settlement = mongoose.model("Settlement", settlementSchema)

module.exports = Settlement