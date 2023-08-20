const e = require("express");
const express = require("express");
const { auth } = require("../middleware/auth");
const { NotesModel } = require("../model/notesModel");

const NotesRouter = express.Router();
NotesRouter.use(auth);

NotesRouter.post("/create", async (req, res) => {
  try {
    const NewNotes = new NotesModel(req.body);
    await NewNotes.save();
    res.send({ msg: "New Note has been added" });
  } catch (error) {
    res.send(error);
  }
});

NotesRouter.get("/", async (req, res) => {
  try {
    const notes = await NotesModel.find({ userId: req.body.userId });
    if (notes) {
      res.send(notes);
    } else {
      res.send("No notes are present");
    }
  } catch (error) {
    res.send(error);
  }
});

NotesRouter.patch("/update/:note_id", async (req, res) => {
  const { note_id } = req.params;
  const note = await NotesModel.find({ _id: note_id, userId: req.body.userId });
  try {
    if (!note) {
      res.send("You are not Authorized");
    } else {
      await NotesModel.findByIdAndUpdate({ _id: note_id }, req.body);
      res.send({ msg: "Notes has been Updated" });
    }
  } catch (error) {
    res.send(error);
  }
});

NotesRouter.delete("/delete/:note_id", async (req, res) => {
  const { note_id } = req.params;
  const note = await NotesModel.find({ _id: note_id, userId: req.body.userId });
  try {
    if (!note) {
      res.send("You are not Authorized");
    } else {
      await NotesModel.findByIdAndDelete({ _id: note_id });
      res.send({ msg: "Notes is Deleted" });
    }
  } catch (error) {
    res.send(error);
  }
});
module.exports = {
  NotesRouter,
};
