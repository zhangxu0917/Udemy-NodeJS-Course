import React from "react";
import { Layout } from "antd";
import classes from "./index.module.css";
const { Header } = Layout;

const headerStyle = {};

const Index = () => {
  return (
    <Header className={classes.header}>
      <span className={classes.headerText}>Todos</span>
    </Header>
  );
};

export default Index;
