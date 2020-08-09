import React from "react";

import Hellopoint from "@/pages/webGlSimpleTutorial/HelloPoint1";
import Hellopoint2 from "@/pages/webGlSimpleTutorial/HelloPoint2";
import HelloTriangle from "@/pages/webGlSimpleTutorial/HelloTriangle";
import HelloTriangle2 from "@/pages/webGlSimpleTutorial/HelloTriangle2";
import TriangleMVPMatrix from "@/pages/webGlSimpleTutorial/TriangleMVPMatrix";
import TriangleMVPMatrix2 from "@/pages/webGlSimpleTutorial/TriangleMVPMatrix2";
import TriangleMVPMatrix3 from "@/pages/webGlSimpleTutorial/TriangleMVPMatrix3";
import TerrainViewer from "@/pages/webGlSimpleTutorial/TerrainViewer";
import TerrainViewer2 from "@/pages/webGlSimpleTutorial/TerrainViewer2";
import TerrainViewer4 from "@/pages/webGlSimpleTutorial/TerrainViewer4";
import TerrainViewer5 from "@/pages/webGlSimpleTutorial/TerrainViewer5";
import TerrainViewer6 from "@/pages/webGlSimpleTutorial/TerrainViewer6";
import TerrainViewer7 from "@/pages/webGlSimpleTutorial/TerrainViewer7";

class webGlSimpleTutorial extends React.Component {

  componentDidMount() {
    let domList = document.getElementsByClassName("upload");
    for (let i = 0, l = domList.length; i < l; i++) {
      const el = domList[i];
      el["onmouseover"] = (el) => {
        window.scrollHistory = window.scrollY;
        let body = document.getElementsByTagName("body")[0];
        body.style.position = "fixed";
        body.style.top = -window.scrollHistory + "px";
      };
      el["onmouseout"] = (el) => {
        let body = document.getElementsByTagName("body")[0];
        body.style.position = "static";
        window.scrollTo(0, window.scrollHistory);
      };
    }
  }
  render() {
    return (
      <div id="container">
        <Hellopoint />
        <Hellopoint2 />
        <HelloTriangle />
        <HelloTriangle2 />
        <TriangleMVPMatrix />
        <TriangleMVPMatrix2 />
        <TriangleMVPMatrix3 />
        {/* <TriangleMVPMatrix4/> */}
        <TerrainViewer />
        <TerrainViewer2 />
        {/* <TerrainViewer3 /> */}
        <TerrainViewer4 />
        <TerrainViewer5 />
        <TerrainViewer6 />
        <TerrainViewer7 />
      </div>
    );
  }
}
export default webGlSimpleTutorial;
