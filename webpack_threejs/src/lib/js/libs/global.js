window.BaseUrl = "http://127.0.0.1:4571/";
window.uniforms = {
    ratio: { value: 0.0 },
    time: { value: 1.0 }
}
window.guiMenu={
    cameraPosition:''
}
let up = window.uniforms
let animation = ()=>{
    up.time.value+=1
    up.ratio.value > 3
        ? (up.ratio.value = 0)
        : (up.ratio.value += 0.00702)
    requestAnimationFrame(animation)
}
animation()