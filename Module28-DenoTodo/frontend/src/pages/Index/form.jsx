import { Button, Form, Input } from "antd";
import classes from "./form.module.css";

const HomePage = () => {
  const [form] = Form.useForm();

  const onCreateTodo = () => {};

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
