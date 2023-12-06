"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todos = [];
router.get("/", (req, res, next) => {
    res.status(200).json({
        todos,
    });
});
router.post("/todo", (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().getTime(),
        text: body.text,
    };
    todos.push(newTodo);
    res.status(201).json({
        message: "Create Todo successfully",
    });
});
router.put("/todo/:todoId", (req, res, next) => {
    const params = req.params;
    const tid = Number(params.todoId);
    const body = req.body;
    const todoIndex = todos.findIndex((item) => item.id === tid);
    if (todoIndex > -1) {
        todos[todoIndex] = Object.assign(Object.assign({}, todos[todoIndex]), { text: body.text });
    }
    res.status(404).json({
        code: 4,
        message: "Could not find todo for this id",
    });
});
router.delete("/todo/:todoId", (req, res, next) => {
    const params = req.params;
    const tid = Number(params.todoId);
    todos = todos.filter((item) => item.id !== tid);
    res.status(200).json({
        code: 0,
        data: todos,
    });
});
exports.default = router;
