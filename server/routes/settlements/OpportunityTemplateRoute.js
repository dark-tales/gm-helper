const express = require("express")
const router = express.Router() 
// import models
const OpportunityTemplate = require("../../models/settlements/opportunityTemplate")

// Route to get a single random opportunity event template by strain level
router.get('/random/:strainLevel', async (req, res) => {
    try {
        const { strainLevel } = req.params;
        const templates = await OpportunityTemplate.find({ strainLevel });

        if (templates.length === 0) {
            return res.status(404).json({ error: 'No opportunity event templates found for this strain level.' });
        }

        const randomIndex = Math.floor(Math.random() * templates.length);
        const randomTemplate = templates[randomIndex];
        res.json(randomTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Delete an Event
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    await OpportunityTemplate.findByIdAndDelete(id)
    res.status(200).json({ message: 'Event deleted successfully!'})
})

module.exports = router