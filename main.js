require("dotenv").config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const db = process.env.DB_DATABASE;

const port = process.env.EXPRESS_PORT;

const express = require("express");
const app = express();

const mysql = require("mysql2");
const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort,
    database: db,
});
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
    // const item = data.filter((i) => i.id == req.params.noteId);
    const item = data.find((i) => i.id == req.params.noteId);
    res.send(item);
});

// query parameter
app.get("/note", (req, res) => {
    console.log(req.query);
    const { id } = req.query;
    if (!id) res.send([]);

    // const item = data.filter((i) => i.id == req.query.noteId);
    const item = data.find((i) => i.id == req.query.noteId);
    res.send(item);
});

app.put("/user", (req, res) => {
    // 1. array findIndex 같은 id 를 찾음
    // 2. 찾은 index 값을 가지고 원하는 데이터 변경

    const { id, note } = req.body;
    if (!id || !note) res.sendStatus(400);

    const idx = data.findIndex((i) => (i.id = id));
    data[idx].note = note;
    console.log(data);
    res.sendStatus(204);
});

app.delete("/user/:userId", (req, res) => {
    const filtered = data.filter((item) => item.id !== req.params.userId);
    console.log(filtered);
    res.sendStatus(204);
});

// pool.query(`SHOW DATABASES;`, function (err, rows) {
//     console.log(rows);
// });

// pool.query(`CREATE DATABASE db_test;`, function (err, rows) {
//     console.log(rows);
// });

// pool.query(
//     `CREATE TABLE notes(
//     uuid BINARY(16) DEFAULT (UUID_TO_BIN(UUID())),
//     title VARCHAR(255) NOT NULL,
//     contents TEXT NOT NULL,
//     created TIMESTAMP NOT NULL DEFAULT NOW()
// );`,
//     function (err, rows, fields) {
//         console.log(rows);
//     }
// );

// pool.query(`SHOW TABLES;`, function (err, rows) {
//     console.log(rows);
// });

// pool.query(
//     `INSERT INTO notes (title, contents) VALUES ('My First Note', 'something');`,
//     function (err, rows) {
//         console.log(rows);
//     }
// );

// pool.query(`select * from notes;`, function (err, rows) {
//     console.log(rows);
// });

function getNotes() {
    pool.query(
        `SELECT BIN_TO_UUID(uuid, true) as uuid,title,contents,created from notes`,
        function (err, rows, fileds) {
            console.log(rows);
        }
    );
}

getNotes();

app.listen(port, "0.0.0.0");
