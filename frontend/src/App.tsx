import React from 'react';
import { Col, Layout, Row, Typography } from 'antd';
import { DutyList } from './components/DutyList';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Typography.Title level={3} className="header-title">
          Duty Manager
        </Typography.Title>
      </Header>
      <Content className="app-content">
        <Row justify="center">
          <Col span={24}>
            <DutyList />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
