const express = require("express")
const router = express.Router() 
// import models
const AllCharacterHistory = require("../../models/characters/charHistory.js")

// Get Character history 
router.get("/", async (req, res) => {
    try {
        const newCharHistory = await AllCharacterHistory.find({}) // fetch all hooks
        res.status(200).json(newCharHistory)
    } catch (e) {
        console.error("Error fetching Character:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Save current Character
router.post("/", async (req, res) => {
    try {
        const newCharHistory = new AllCharacterHistory(req.body)
        await newCharHistory.save()
        res.status(201).json({message: "Character saved successfully!", newCharHistory: newCharHistory})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This Character already exist"})
        }
        console.error("Error adding Character:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Modify current history hook
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedChar = await AllCharacterHistory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!updatedChar) {
            return res.status(404).send('Character history not found.');
        }
        res.status(201).json({message: "Character updated successfully!"})
    } catch (error) {
        console.error("Error updating Character History:", error)
        // You might want to redirect with an error message or render an error page
        res.status(500).send("Server error during update.")
    }
})

// Delete a hook
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    await AllCharacterHistory.findByIdAndDelete(id)
    res.status(200).json({ message: 'Hook deleted successfully!'})
})

module.exports = router