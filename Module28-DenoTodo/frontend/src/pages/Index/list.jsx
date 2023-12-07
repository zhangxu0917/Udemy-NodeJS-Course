import { List, Button, Space } from "antd";
import classes from "./list.module.css";
import ListItem from "./listItem";

const data = [
  {
    id: 1,
    text: "This is a test task.",
    status: 0,
  },
  {
    id: 2,
    text: "This is a test task.",
    status: 1,
  },
  {
    id: 3,
    text: "This is a test task.",
    status: 2,
  },
];

const TaskList = () => {
  return (
    <>
      <List
        className={classes.listContainer}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item.id} style={{ display: "block" }}>
            <ListItem item={item} />
          </List.Item>
        )}
      ></List>
    </>
  );
};

export default TaskList;
