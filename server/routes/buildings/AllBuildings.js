const express = require("express")
const router = express.Router() 
// import models
const AllBuilding = require("../../models/buildings/buildings")

// Get Building  
router.get("/", async (req, res) => {
    try {
        const newCharacter = await AllBuilding.find({}) // fetch all buildings
        res.status(200).json(newCharacter)
    } catch (e) {
        console.error("Error fetching building:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Save current Building
router.post("/", async (req, res) => {
    try {
        const newCharacter = new AllBuilding(req.body)
        await newCharacter.save()
        res.status(201).json({message: "Building saved successfully!", newCharacter: newCharacter})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This Building already exist"})
        }
        console.error("Error adding Building:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Delete a Building
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    await AllBuilding.findByIdAndDelete(id)
    res.status(200).json({ message: 'Building deleted successfully!'})
})

module.exports = router