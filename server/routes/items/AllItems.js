const express = require("express")
const router = express.Router() 
// import models
const AllItem = require("../../models/items/items")

// Get all Items 
router.get("/", async (req, res) => {
    try {
        const newItems = await AllItem.find({}) // fetch all items
        res.status(200).json(newItems)
    } catch (e) {
        console.error("Error fetching item:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Save new Item
router.post("/", async (req, res) => {
    try {
        const newItem = new AllItem(req.body)
        await newItem.save()
        res.status(201).json({message: "Item saved successfully!", newItem: newItem})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This Item already exist"})
        }
        console.error("Error adding Item:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Delete a Character
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    await AllItem.findByIdAndDelete(id)
    res.status(200).json({ message: 'Item deleted successfully!'})
})

module.exports = router