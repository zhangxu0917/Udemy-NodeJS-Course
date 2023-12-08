import { Button, Form, Input } from "antd";
import { useContext } from "react";
import { TodosContext } from "./index";

import classes from "./form.module.css";

const HomePage = (props) => {
  const [form] = Form.useForm();
  const { loadTodos } = useContext(TodosContext);

  const onCreateTodo = (value) => {
    fetch("http://localhost:8080/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: value.task,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadTodos();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.formContainer}>
      <h2>Create a task</h2>
      <Form
        form={form}
        name="submit_form"
        layout="inline"
        onFinish={onCreateTodo}
        className={classes.form}
      >
        <Form.Item
          name="task"
          className={classes.taskFormItem}
          rules={[{ required: true, message: "Please input your task!" }]}
        >
          <Input placeholder="Please input todo item" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HomePage;
