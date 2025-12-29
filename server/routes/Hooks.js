const express = require("express")
const router = express.Router() 
// import models
const StoryHook = require("../models/hook")

// Get all hooks 
router.get("/", async (req, res) => {
    try {
        const storyHooks = await StoryHook.find({}) // fetch all hooks
        res.status(200).json(storyHooks)
    } catch (e) {
        console.error("Error fetching hooks:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Post a new hook
router.post("/", async (req, res) => {
    try {
        const newHook = new StoryHook(req.body)
        console.log(newHook)
        await newHook.save()
        // res.redirect("http://localhost:5173/")
        res.status(201).json({message: "Hook added successfully!", storyHooks: newHook})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This hook already exist"})
        }
        console.error("Error adding hook:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Delete a hook
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    const hook = await StoryHook.findByIdAndDelete(id)
    res.status(200).json(hook)
})

module.exports = router