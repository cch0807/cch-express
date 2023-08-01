const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Middleware test 0");
    next();
});
app.use(express.static("public"));

app.get("/", (req, res) => {});

const data = [
    { id: "id-1", name: "name-1", note: "note info 1" },
    { id: "id-2", name: "name-2", note: "note info 2" },
    { id: "id-3", name: "name-3", note: "note info 3" },
];

app.post(
    "/notes",
    (req, res, next) => {
        console.log("Middleware test 1");
        next();
    },
    (req, res, next) => {
        console.log("Middleware test 2");
        next();
    },
    (req, res) => {
        console.log(req.body);
        //data.push(req.body);
        res.sendStatus(201);
    }
);

app.get("/notes", (req, res) => {
    res.send(data);
});

// path parameter
app.get("/notes/:noteId", (req, res) => {
    console.log(req.params);
    const item = data.filter((i) => i.id == req.params.noteId);
    res.send(item);
});

// query parameter
app.get("/note", (req, res) => {
    console.log(req.query);
    const { id } = req.query;
    if (!id) res.send([]);
    const item = data.filter((i) => i.id == req.query.noteId);
    res.send(item);
});

app.listen(port, "172.31.36.178");
