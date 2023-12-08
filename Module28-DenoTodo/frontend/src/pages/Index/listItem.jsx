import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useContext } from "react";
import { Space, Button, Tag, Input, Radio, Modal } from "antd";

import { TodosContext } from "./index";
import classes from "./listItem.module.css";

const ListItem = ({ item }) => {
  const { loadTodos, messageApi } = useContext(TodosContext);
  const [formData, setFormData] = useState({
    status: item.status,
    text: item.text,
  });

  const [isEdit, setIsEdit] = useState(false);

  const [modal, contextHolder] = Modal.useModal();

  const options = [
    {
      label: "uncomplete",
      value: 0,
    },
    {
      label: "processing",
      value: 1,
    },
    {
      label: "complete",
      value: 2,
    },
  ];

  const onChangeStatus = ({ target: { value } }) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const onChangeText = ({ target: { value } }) => {
    setFormData({
      ...formData,
      text: value,
    });
  };

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleUpdate = () => {
    console.log("Update");
    fetch(`http://localhost:8080/todos/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        messageApi.open({
          type: "success",
          content: "Updated successfully",
        });
        loadTodos();
      })
      .catch((err) => {
        console.log(err);
      });
    setIsEdit(false);
  };

  const handleDelete = () => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <h3>Will you delete this task, make sure?</h3>
          <p className={classes.taskText}>{item.text}</p>
        </>
      ),
      okText: "Submit",
      cancelText: "Cancel",
      onOk: handleDeleteTask,
    });
  };

  const handleDeleteTask = () => {
    console.log(item);
    fetch(`http://localhost:8080/todos/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          console.log(messageApi);

          messageApi.open({
            type: "success",
            content: "operation successful",
          });

          loadTodos();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setIsEdit(false);
    setFormData({
      ...item,
    });
  };

  return (
    <>
      <div className={classes.mainContainer}>
        <div>
          <span style={{ userSelect: "none", paddingRight: "8px" }}>
            {item.text}
          </span>
          {item.status === 0 ? (
            <Tag color="error">Uncomplete</Tag>
          ) : item.status === 1 ? (
            <Tag color="processing">Processing</Tag>
          ) : item.status === 2 ? (
            <Tag color="success">Complete</Tag>
          ) : null}
        </div>

        <Space>
          <Button type="primary" onClick={handleEditClick}>
            Edit
          </Button>
          <Button danger type="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Space>
      </div>
      {isEdit && (
        <div className={classes.editContainer}>
          <div>
            <Input
              className={classes.input}
              value={formData.text}
              placeholder="Please input a task."
              onChange={onChangeText}
            />
            <Radio.Group
              options={options}
              onChange={onChangeStatus}
              value={formData.status}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleUpdate}>
              Save
            </Button>
          </Space>
        </div>
      )}
      {contextHolder}
    </>
  );
};

export default ListItem;
