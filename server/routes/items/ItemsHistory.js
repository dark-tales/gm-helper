const express = require("express")
const router = express.Router() 
// import models
const ItemsHistory = require("../../models/items/itemHistory")

// Get hook history 
router.get("/", async (req, res) => {
    try {
        const newItemHistory = await ItemsHistory.find({}) // fetch all hooks
        res.status(200).json(newItemHistory)
    } catch (e) {
        console.error("Error fetching Items:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Save current item to history
router.post("/", async (req, res) => {
    try {
        const newItemHistory = new ItemsHistory(req.body)
        await newItemHistory.save()
        res.status(201).json({message: "Item saved successfully!", newItemHistory: newItemHistory})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({message: "This item already exist"})
        }
        console.error("Error adding hook:", e)
        res.status(500).json({message: "Server error", error: e.message})
    }
})

// Modify current history hook
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { body } = req; // Get the raw request body

    // 1. Create an update object to explicitly handle boolean fields
    const updateData = {
        // Copy all other fields from req.body directly
        ...body,
        // Explicitly set boolean fields based on their presence in req.body
        // `!!` converts a truthy/falsy value to a strict boolean (true/false)
        item_search: !!body.started,
        item_found: !!body.succeed,
    };

    // 2. Remove the original string fields if they exist, to avoid conflicts
    //    This is good practice but Mongoose might ignore them anyway if schema type is Boolean
    delete updateData.started;
    delete updateData.succeed;

    try {
        const updatedHook = await ItemsHistory.findByIdAndUpdate(
            id,
            updateData, // Use our carefully constructed updateData object
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedHook) {
            return res.status(404).send('Item History not found.');
        }

        // Redirect after successful update
        // res.redirect("http://localhost:5173/");
        res.status(201).json({message: "Item updated successfully!"})
    } catch (error) {
        console.error("Error updating Story Hook History:", error);
        // You might want to redirect with an error message or render an error page
        res.status(500).send("Server error during update.");
    }
})

// Delete a hook
router.delete("/:id", async (req, res) => {
    const {id} = req.params
    await ItemsHistory.findByIdAndDelete(id)
    res.status(200).json({ message: 'Item deleted successfully!'})
})

module.exports = router