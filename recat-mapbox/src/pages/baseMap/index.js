import React, { Component } from "react";
import mapboxGl from "mapbox-gl";
import "./baseMap.scss"

mapboxGl.accessToken = "pk.eyJ1IjoibW9zaHV5aW5nIiwiYSI6ImNrYzJ3d3p1MjA0N3kyd3RnZXFpejlrZ3UifQ.8BVZUdzrBZqO7i5tVqbiUw";

export default class home extends Component {
  map1 = null;
  map2 = null;
  map1dom = <div id="map1"></div>
  map2dom = <div id="map2"></div>
  dom = <div>{this.map1dom}{this.map2dom}</div>
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.map1 = new mapboxGl.Map({
      container: "map1",
      style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }
  render() {
    return this.dom
  }
}
