# 在react中使用mapboxgl

根据mapbox官网教程中的示例编写[教程地址](https:-docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/)

根据国内需要配置了高德地图感谢GISer_飘逸的梦的教程[GISer_飘逸的梦](https:-blog.csdn.net/qq_33460928/article/details/108264466)

修改`src/components/mapbox/index.js:47:0`的最后两位参数即可修改地图样式

- wprd0{1-4}
- scl=1&style=7 为矢量图（含路网和注记）
- scl=2&style=7 为矢量图（含路网但不含注记）
- scl=1&style=6 为影像底图（不含路网，不含注记）
- scl=2&style=6 为影像底图（不含路网、不含注记）
- scl=1&style=8 为影像路图（含路网，含注记）
- scl=2&style=8 为影像路网（含路网，不含注记）


最终效果
![example](./example.png)
