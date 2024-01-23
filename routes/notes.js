const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  res.json([]);
});

// ROUTE 1: Get All the Notes using: GET "/api/auth/getuser". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // Validation checks... (unchanged)

      const savedNote = await new Note({
        title,
        description,
        tag,
        user: req.user.id,
      }).save();
      res.json({
        _id: savedNote._id,
        user: savedNote.user,
        title: savedNote.title,
        description: savedNote.description,
        tag: savedNote.tag,
        date: savedNote.date,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  // Create a newNote Object
  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  try {
    // Find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the user is authorized to update the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed" });
    }

    // Update the note and return the updated note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({
      _id: note._id,
      user: note.user,
      title: note.title,
      description: note.description,
      tag: note.tag,
      date: note.date,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the user is authorized to delete the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed" });
    }

    // Delete the note and return the deleted note
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({
      Success: "Note has been deleted",
      note: {
        _id: note._id,
        user: note.user,
        title: note.title,
        description: note.description,
        tag: note.tag,
        date: note.date,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
