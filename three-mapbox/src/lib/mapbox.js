import mapboxgl from "mapbox-gl"

mapboxgl.accessToken = 'pk.eyJ1IjoibW9zaHV5aW5nIiwiYSI6ImNrYzJ3d3p1MjA0N3kyd3RnZXFpejlrZ3UifQ.8BVZUdzrBZqO7i5tVqbiUw'
let container = document.createElement("div")
container.id = "mapbox"
container.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`
document.body.appendChild(container)
const Map = mapboxgl.Map
window.mapboxgl = mapboxgl

/**
 * 创建mapbox
 * @param {[number]}center
 * @return {Map}
 */
function createMap(center) {
    return new mapboxgl.Map({
        container: 'mapbox',
        center: [106.58140789775808, 29.542006974191196],
        style: 'mapbox://styles/mapbox/dark-v9',
        hash: true
    })
}

export {createMap, mapboxgl}