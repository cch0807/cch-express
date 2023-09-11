import express from "express";
import {
  getNotes,
  getNote,
  addNotes,
  updateNotes,
  deleteNote,
} from "./postgresql_exam.js";
const app = express();
const port = process.env.PORT || 3000; // 포트 설정, 환경 변수에 포트가 설정되어 있으면 해당 포트를 사용하고, 그렇지 않으면 3000 포트를 사용합니다.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 루트 경로에 "Hello, World!"를 출력하는 라우트를 추가합니다.
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
const db = [{ user: "user-1", password: "puepue1101" }];

app.get("/notes", async (req, res) => {
  const value = "dXNlci0xOnB1ZXB1ZTExMDE=";

  let decodedText = Buffer.from(value, "base64").toString("utf8");
  console.log("Base64 Decoded Text : ", decodedText);
  const arr = decodedText.split(":");
  const id = arr[0];
  const pw = arr[1];

  res.send({ id: id, pw: pw });
  //   const result = await getNotes();
  //   res.send(result);
});

app.get("/note/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) res.sendStatus(400);
  if (id.length !== 36) res.sendStatus(400);
  const result = await getNote(id);
  if (result.length === 0) res.send({});
  res.send(result[0]);
});

app.post("/notes", async (req, res) => {
  const { title, contents } = req.body;

  const result = await addNotes(title, contents);

  res.sendStatus(201);
});

app.put("/note/:id", async (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  if (!id) res.sendStatus(400);
  if (id.length !== 36) res.sendStatus(400);
  await updateNotes(id, title, contents);
  const result = await getNote(id);
  res.send(result);
});

app.delete("/note/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) res.sendStatus(400);
  if (id.length !== 36) res.sendStatus(400);
  await deleteNote(id);
  res.sendStatus(204);
});

// 서버를 시작하고 지정된 포트에서 듣기 시작합니다.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
