import React from "react";
import Random2D from "@/pages/theBookOfShaders/random2D"
import Random2DChaos from "@/pages/theBookOfShaders/Random2DChaos";
import ClassicsShaderGoto10 from '@/pages/theBookOfShaders/classics_shader_goto10'
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
        <Random2D />
        <Random2DChaos />
        <ClassicsShaderGoto10 />
      </div>
    );
  }
}
export default webGlSimpleTutorial
