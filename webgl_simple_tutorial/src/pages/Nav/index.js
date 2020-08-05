import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";

import WebGlSimpleTutorial from "@/pages/webGlSimpleTutorial/"
import TheBookOfShaders from "@/pages//theBookOfShaders"
import "./index.css";
const { Header, Content, Footer } = Layout;
class Nav extends React.Component {
  constructor(){
    super();
    this.state = {
      dom: <WebGlSimpleTutorial />,
      path:'webgl 简单示例'
    }
  }
  
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu defaultSelectedKeys={["0"]}>
            <Menu.Item key="0" >webgl 简单示例</Menu.Item>
            <Menu.Item key="1" >The Book of Shaders</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item></Breadcrumb.Item>
          </Breadcrumb>

          <div className="site-layout-content">
            {this.state.dom}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©2020 Created by Moshuying
        </Footer>
      </Layout>
    );
  }
}
export default Nav;
