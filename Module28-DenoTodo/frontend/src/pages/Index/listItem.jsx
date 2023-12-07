import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Space, Button, Tag, Input, Radio, Modal } from "antd";

import classes from "./listItem.module.css";

const ListItem = ({ item }) => {
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

  const onChangeStatus = (e) => {
    console.log(e);
  };

  const handleEditClick = () => {
    console.log("IsEdit");
    setIsEdit(true);
  };

  const handleUpdate = () => {
    console.log("Update");
    setIsEdit(false);
  };

  const handleDelete = () => {
    console.log(11231);
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <h3>Will you delete this task, make sure?</h3>
          <p className={classes.taskText}>{item.text}</p>
        </>
      ),
      okText: "Save",
      cancelText: "Cancel",
    });
  };

  const handleDeleteTask = () => {};

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
              placeholder="Please input a task."
            />
            <Radio.Group
              options={options}
              onChange={onChangeStatus}
              value={item.status}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <Space>
            <Button onClick={() => setIsEdit(false)}>Cancel</Button>
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
