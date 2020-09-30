import THREE from './lib/'

export default class Control {
  constructor(){
  }
  init(map,poi_map,threeDomId,center,reactComponent){
    let size = [3840,1296]
    this.map = map
    this.poi_map = poi_map
    this.center = center
    this.three = new THREE(map,size,threeDomId,center,reactComponent)
    this.three.loaded()
  }
}