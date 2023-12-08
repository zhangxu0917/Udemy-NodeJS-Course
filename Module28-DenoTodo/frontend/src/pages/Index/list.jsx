import { List, Button, Space } from "antd";
import classes from "./list.module.css";
import ListItem from "./listItem";

const TaskList = ({ todos }) => {
  return (
    <>
      <List
        className={classes.listContainer}
        bordered
        dataSource={todos}
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
