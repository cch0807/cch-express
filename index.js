import express from "express";
import dotenv from "dotenv";

import {
    getNotes,
    getNote,
    addNotes,
    updateNote,
    deleteNote,
} from "./database_exam.js";

dotenv.config();

const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/notes", async (req, res) => {
    const result = await getNotes();
    res.send(result);
});

app.get("/note/:noteId", async (req, res, next) => {
    try {
        const noteId = req.params.noteId;
        if (!noteId) throw new Error(`400@No path parameter`);
        const result = await getNote(noteId);
        // if(!result) throw new Error(`400@No data`)
        if (!result) res.send({});
        if (result.length === 0) res.send({});
        res.send(...result);
    } catch (err) {
        next(err);
    }
});

app.post("/notes", async (req, res, next) => {
    try {
        const { title, contents } = req.body;
        if (!title || !contents) res.sendStatus(400);

        const result = await addNotes(title, contents);
        if (typeof result.affectedRows === "undefined")
            throw new Error(`400@not created`);
        if (result.affectedRows !== 1) throw new Error(`400@not created`);

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.put("/notes", async (req, res, next) => {
    try {
        const { uuid, title, contents } = req.body;
        if (!uuid || !title || !contents) res.sendStatus(400);
        const result = await updateNote(uuid, title, contents);
        if (result.affectedRows !== 1) throw new Error(`400@not created`);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.delete("/note/:noteId", async (req, res, next) => {
    try {
        const noteId = req.params.noteId;
        if (!noteId) res.sendStatus(400);
        const result = await deleteNote(noteId);
        if (result.affectedRows !== 1) throw new Error(`400@not deleted`);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(port, host);
