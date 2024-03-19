const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  const todoList = JSON.parse(fs.readFileSync("todolist.json"));
  const resp = {
    message: "OK",
    status: 200,
    data: todoList,
  };
  res.json(resp);
});

app.post("/todo", (req, res) => {
  const newTodoList = req.body;
  const list = JSON.parse(fs.readFileSync("todolist.json"));
  const latestId = list?.todoList?.slice(-1)[0]?.id;
  if (!latestId) {
    const brandNewTodo = {
      id: 1,
      task: newTodoList.todo,
      complete: false,
    };
    list.todoList.push(brandNewTodo);
    fs.writeFileSync("todolist.json", JSON.stringify(list));
    const resp = {
      message: "OK",
      status: 200,
      data: brandNewTodo,
    };
    return res.json(resp);
  }
  const newTodoObj = {
    id: latestId + 1,
    task: newTodoList.todo,
    complete: false,
  };
  list.todoList.push(newTodoObj);
  fs.writeFileSync("todolist.json", JSON.stringify(list));
  const resp = {
    message: "OK",
    status: 200,
    data: newTodoObj,
  };
  res.json(resp);
});

app.delete("/delete-todo", (req, res) => {
  const body = req.body;
  const list = JSON.parse(fs.readFileSync("todolist.json"));
  const index = list.todoList.findIndex((todo) => todo.id === body.id);
  if (index === -1) {
    const resp = {
      message: "OK",
      status: 200,
      data: { message: "Id not found" },
    };
    return res.json(resp);
  }
  list.todoList.splice(index, 1);
  fs.writeFileSync("todolist.json", JSON.stringify(list));
  const resp = {
    message: "OK",
    status: 200,
    data: list,
  };
  res.json(resp);
});

app.patch("/update-status", (req, res) => {
  const body = req.body;
  const list = JSON.parse(fs.readFileSync("todolist.json"));
  const index = list.todoList.findIndex((todo) => todo.id === body.id);
  list.todoList[index].complete = !list.todoList[index].complete;
  fs.writeFileSync("todolist.json", JSON.stringify(list));
  const resp = {
    message: "OK",
    status: 200,
    data: list,
  };
  res.json(resp);
});

app.listen(3000, () => {
  console.log("Online");
});
