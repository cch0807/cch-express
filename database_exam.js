import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const db = process.env.DB_DATABASE;

const port = process.env.EXPRESS_PORT;

const app = express();

const mysql = mysql;
const pool = mysql
    .createPool({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        port: dbPort,
        database: db,
    })
    .promise();
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
        function (err, rows, fields) {
            console.log(rows);
        }
    );
}

// getNotes();

function getNote(uuid) {
    pool.query(
        `SELECT BIN_TO_UUID(uuid, true) as uuid, title, contents, created from notes where uuid=UUID_TO_BIN('${uuid}',1);`,
        function (err, rows, fields) {
            // console.log(...rows);
            console.log(rows[0]);
        }
    );
}

getNote("320d11ee-b88b-f1f7-9e13-12fc6fb5ea29");

function addNotes(title, contents) {
    pool.query(
        `INSERT INTO notes (title, contents) VALUES ('${title}','${contents}');`,
        function (err, rows, fields) {
            console.log(err);
            console.log(rows);
        }
    );
}

// addNotes("Note2", "something");
// getNotes();

function updateNote(uuid, title, contents) {
    pool.query(
        `UPDATE notes SET title='${title}', contents='${contents}' WHERE uuid=UUID_TO_BIN('${uuid}',1);`,
        function (err, rows, fields) {
            console.log(rows);
        }
    );
}

// updateNote(
//     "321611ee-14cb-7afb-9e13-12fc6fb5ea29",
//     "change-Note2",
//     "change-something"
// );

// getNotes();

function deleteNote(uuid) {
    pool.query(
        `DELETE FROM notes WHERE uuid=UUID_TO_BIN('${uuid}',1)`,
        function (err, rows, fields) {
            console.log(rows);
        }
    );
}

// deleteNote("321611ee-14cb-7afb-9e13-12fc6fb5ea29");
// getNotes();

app.listen(port, "0.0.0.0");

exports.getNotes = getNotes;
exports.getNote = getNote;
exports.addNotes = addNotes;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
