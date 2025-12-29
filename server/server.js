// js server file

// load URI from .env file
require("dotenv").config()

// register require dependencies
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

// start server on port 5000
const app = express()

// allow cross-origin request
const allowedOrigins = [
    process.env.CORS_ORIGIN
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our allowed list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're sending cookies or authorization headers
    optionsSuccessStatus: 204 // For preflight requests
};
app.use(cors(corsOptions));


const methodOverride = require('method-override') 

// add hook routes
const hooksRoute = require("./routes/Hooks")
const hookHistoryRoute = require("./routes/HookHistory") 
// add Characters routes
const allCharRoute = require("./routes/characters/AllCharacters")
const charHistoryRoute = require("./routes/characters/CharacterHistory")
// add Items routes
const allItemsRoute = require("./routes/items/AllItems")
const itemsHistory = require("./routes/items/ItemsHistory")
// add Building routes
const allBuildingRoute = require("./routes/buildings/AllBuildings")
const buildingHistoryRoute = require("./routes/buildings/BuildingHistory")
// add all settlements routes
const settlementRoute = require("./routes/settlements/SettlementRoute")
const eventsTemplateRoute = require("./routes/settlements/EventTemplateRoute")
const opportunityTemplateRoute = require("./routes/settlements/OpportunityTemplateRoute")
const dilemmaTemplateRoute = require("./routes/settlements/DilemmaTemplateRoute")
const rumorTemplateRoute = require("./routes/settlements/RumorRoute")

    
// parse JSON payload
app.use(express.json())
// allow extended body
app.use(express.urlencoded({extended:true}))
// allow method overide
app.use(methodOverride('_method'))
// replace hook routes
app.use("/api/hooks", hooksRoute)
app.use("/api/hook-history", hookHistoryRoute)
// replace characters routes
app.use("/api/all-characters", allCharRoute)
app.use("/api/characters-history", charHistoryRoute)
// replace items routes
app.use("/api/items", allItemsRoute)
app.use("/api/items-history", itemsHistory)
// replace building routes
app.use("/api/buildings",allBuildingRoute)
app.use("/api/buildings-history",buildingHistoryRoute)
// replace all settlements routes
app.use("/api/settlements", settlementRoute)
app.use("/api/events", eventsTemplateRoute)
app.use("/api/opportunity", opportunityTemplateRoute)
app.use("/api/dilemma", dilemmaTemplateRoute)
app.use("/api/rumor", rumorTemplateRoute)



// MongoDB connection
const mongoURI = process.env.MONGO_URI
const PORT = process.env.PORT
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// listen on port 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

