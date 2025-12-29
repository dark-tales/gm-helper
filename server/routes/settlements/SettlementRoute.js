const express = require("express")
const router = express.Router() 
// import models
const Settlement = require("../../models/settlements/settlement")

// Get all settlement 
router.get("/", async (req, res) => {
    try {
        const settlement = await Settlement.find({}) // fetch all settlement
        res.status(200).json(settlement)
    } catch (e) {
        console.error("Error fetching settlement:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Modify current history hook
router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const { _id, ...updateData } = req.body

    try {
        const updatedSettlement = await Settlement.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        )
        if (!updatedSettlement) {
            return res.status(404).send('Settlement not found.');
        }
        // This allows the Svelte app to verify the update and refresh its local state.
        res.status(200).json(updatedSettlement);
    } catch (error) {
        console.error("Error updating Settlement:", error)
        // You might want to redirect with an error message or render an error page
        res.status(500).send("Server error during update.")
    }
})

// Post a new Settlement
router.post("/", async (req, res) => {
    try {
        const newSettlement = new Settlement(req.body)
        console.log(newSettlement)
        await newSettlement.save()
        // res.redirect("http://localhost:5173/")
        res.status(201).json({message: "Hook added successfully!", settlement: newSettlement})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This hook already exist"})
        }
        console.error("Error adding hook:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

module.exports = router