import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pgHost = process.env.PG_HOST;
const pgUser = process.env.PG_USER;
const pgPort = process.env.PG_PORT;
const pgPassword = process.env.PG_PASSWORD;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  host: "localhost",
  user: "cch",
  port: 5432,
  password: "puepue1101",
  database: "db_test",
});

const db = [{ user: "user-1", password: "puepue1101" }];

export async function getNotes() {
  const value = "dXNlci0xOnB1ZXB1ZTExMDE=";

  let decodedText = Buffer.from(value, "base64").toString("utf8");
  console.log("Base64 Decoded Text : ", decodedText);
  const arr = decodedText.split(":");
  const id = arr[0];
  const pw = arr[1];

  res.send({ id: id, pw: pw });

  //   const client = await pool.connect();
  //   const res = await client.query(`select * from notes;`);
  //   console.log(res.rows);
  //   client.release();
  //   return res.rows;
}

// await getNotes();

export async function getNote(id) {
  const client = await pool.connect();
  const res = await client.query(`select * from notes where uuid='${id}';`);
  console.log(res.rows);
  client.release();
  return res.rows;
}

// await getNote("946d24ee-297b-4dc3-8733-6b11fc211c4b");

export async function addNotes(title, contents) {
  const client = await pool.connect();
  const res = await client.query(
    `insert into notes (title, contents) values ('${title}', '${contents}' )`
  );
  console.log(res.rows);
  client.release();
  return res.rows;
}

// await addNotes("title3", "content3");

export async function updateNotes(id, title, contents) {
  const client = await pool.connect();
  const res = await client.query(
    `update notes set title = '${title}',contents = '${contents}' where uuid='${id}'`
  );
  console.log(res.rows);
  client.release();
  return res.rows;
}

// await updateNotes("946d24ee-297b-4dc3-8733-6b11fc211c4b", "title2", "content2");

export async function deleteNote(id) {
  const client = await pool.connect();
  const res = await client.query(`delete from notes where uuid='${id}';`);
  console.log(res.rows);
  client.release();
  return res.rows;
}

// deleteNote("946d24ee-297b-4dc3-8733-6b11fc211c4b");
