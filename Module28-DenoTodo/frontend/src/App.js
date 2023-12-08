import { Layout, Space } from "antd";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Index";

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header />
          <Content style={{ padding: "40px 20%" }}>
            <Router>
              <Routes>
                <Route path="/" exact element={<HomePage />} />
              </Routes>
            </Router>
          </Content>
        </Layout>
      </Space>
    </div>
  );
}

export default App;
