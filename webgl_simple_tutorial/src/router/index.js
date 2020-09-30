import React from "react";
import WebGlSimpleTutorial from "@/pages/webGlSimpleTutorial/";
import TheBookOfShaders from "@/pages/theBookOfShaders/";
import Header from "@/pages/HeaderNav/"

const routeConfig = [
  {
    path: "/",
    name: "webGl简单教程",
    component: <WebGlSimpleTutorial />,
    exact: true,
  },
  {
    path: "/TheBookOfShaders",
    name: "TheBookOfShaders",
    component: <TheBookOfShaders />,
  },
];

export default () => <Header routeConfig={routeConfig} />
