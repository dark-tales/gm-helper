const express = require("express")
const router = express.Router() 
// import models
const AllCharacter = require("../../models/characters/allChar.js")

// Get Character  
router.get("/", async (req, res) => {
    try {
        const newCharacter = await AllCharacter.find({}) // fetch all characters
        res.status(200).json(newCharacter)
    } catch (e) {
        console.error("Error fetching character:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Save current Character
router.post("/", async (req, res) => {
    try {
        const newCharacter = new AllCharacter(req.body)
        await newCharacter.save()
        res.status(201).json({message: "Character saved successfully!", newCharacter: newCharacter})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This Character already exist"})
        }
        console.error("Error adding Character:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Delete a Character
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    await AllCharacter.findByIdAndDelete(id)
    res.status(200).json({ message: 'Character deleted successfully!'})
})

module.exports = router