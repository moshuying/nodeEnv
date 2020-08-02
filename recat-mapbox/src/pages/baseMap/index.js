import React, { Component } from "react";
import mapboxGl from "mapbox-gl";
import "./baseMap.scss";

mapboxGl.accessToken =
  "pk.eyJ1IjoibW9zaHV5aW5nIiwiYSI6ImNrYzJ3d3p1MjA0N3kyd3RnZXFpejlrZ3UifQ.8BVZUdzrBZqO7i5tVqbiUw";
export default class home extends Component {
  map1 = null;
  map2 = null;
  map1dom = (<div id="map1"></div>);
  map2dom = (<div id="map2" style={{opacity:"0"}}></div>);
  showMap = "";
  size = [3840, 1296];
  center = [120.74861755955942, 31.160702143438556];
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.map1 = new mapboxGl.Map({
      container: "map1",
      style: "mapbox://styles/mapbox/dark-v10", // stylesheet location
      center: this.center, // starting position [lng, lat]
      zoom: 15, // starting zoom
    });
    // this.map2 = new mapboxGl.Map({
    //   container: "map2",
    //   style: "mapbox://styles/mapbox/light-v10", // stylesheet location
    //   center: this.center, // starting position [lng, lat]
    //   zoom: 15, // starting zoom
    //   doubleClickZoom: false,
    //   trackResize: false, //禁止地图响应浏览器屏幕大小缩放
    // });
    this.map1.on("load", () => {
      window.Control.init(
        this.map1,
        this.map2,
        "world_canvas",
        this.center,
        this
      );
      // this.mapListener();
    });
  }
  mapListener() {
    this.showMap = "index-mapbox showmap";
    this.map1.on("move", () => {
      this.map2.jumpTo({
        center: this.map1.getCenter(),
        bearing: this.map1.getBearing(),
        pitch: this.map1.getPitch(),
        zoom: this.map1.getZoom(),
      });
    });
    this.map1.on("click", (e) => {
      console.log(
        `center:${JSON.stringify(
          e.target.getCenter().toArray()
        )},\nbearing:${e.target.getBearing()},\npitch:${e.target.getPitch()},\nzoom:${e.target.getZoom()}`
      );
    });
  }
  render() {
    return (
      <div id="base-map" className={this.showMap}>
        {this.map1dom}
        <div className="three-canvas">
          <canvas
            id="world_canvas"
            style={{ width: "100%", height: "100%" }}
          ></canvas>
          <canvas
            id="deckgl-overlay"
            style={{ width: "100%", height: "100%" }}
          ></canvas>
        </div>
        {this.map2dom}
      </div>
    );
  }
}
