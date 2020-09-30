import React from "react";
import {Layout, Menu, Breadcrumb} from "antd";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./index.css";

const {Header, Content, Footer} = Layout;

export default class HeaderNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo"/>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={["0"]}>
              <Menu.Item key="0">
                <Link to="/">webgl 简单示例</Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/theBookOfShaders">theBookOfShaders</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{padding: "0 50px"}}>
            <Breadcrumb style={{margin: "16px 0"}}>
              <Breadcrumb.Item />
            </Breadcrumb>
            <div className="site-layout-content">
              {this.props.routeConfig.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  children={route.component}
                />
              ))}
            </div>
          </Content>
          <Footer style={{textAlign: "center"}}>
            ©2020 Created by Moshuying
          </Footer>
        </Layout>
      </Router>
    );
  }
}
