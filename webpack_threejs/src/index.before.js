window.BaseUrl = "http://127.0.0.1:4571/";
import * as THREE from "three";
import { DirectionalLight } from "three/src/lights/DirectionalLight";
import dat from "three/examples/jsm/libs/dat.gui.module";
import Stats from "three/examples/jsm/libs/stats.module";
import { Sky } from "three/examples/jsm/objects/Sky";
import { Water } from "three/examples/jsm/objects/Water2.js";
import { CubeGeometry } from "three/src/Three.Legacy";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BackSide } from "three";

import ChooseShader from "./lib/js/libs/choose.shader"
let cho 
let renderer = new THREE.WebGLRenderer({ antialias: true }),
  xRayRenderScene,
  xRayComposer,
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  ),
  scene = new THREE.Scene(),
  gui,
  stats,
  params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0,
    pause: false,
    pauseXRay: false,
    floorBoard: false,
    cubeShader: false,
    gotoNext:'default'
  },
  windowSize = {
    multiplyingPower: 1,
  },
  animate,
  xRayScene = new THREE.Scene(),
  uniforms1 = { time: { value: 1.0 } };
window.uniforms2 = { ratio: { value: 0.0 } };
let positionBox,positionBoxClone;
let sky,
  sun = new THREE.Vector3(),
  waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000),
  water,
  pmremGenerator;
//天空相关
let parameters = {
  inclination: 0.49,
  azimuth: 0.205,
};
let floorBoard,
  floorBoardShaderMaterial = new THREE.RawShaderMaterial({
    uniforms: window.uniforms2,
    vertexShader: [
      "precision mediump float;",
      "precision mediump int;",
      "uniform mat4 modelViewMatrix;",
      "uniform mat4 projectionMatrix;",
      "attribute vec3 position;",
      "varying vec3 vPosition;",
      "void main() {",
      "  vPosition = position;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}",
    ].join("\n"),
    fragmentShader: [
      "precision mediump float;",
      "precision mediump int;",
      "uniform float ratio;",
      "varying vec3 vPosition;",
      "void main() {",
      "  vec3 center = vec3( 0.0,0.0,0.0 );",
      "  float dist=  distance(vPosition,center)/2000.0;",
      "  dist = clamp(dist,0.0,1.0);",
      "  float color = 1.0-dist ;",
      "  gl_FragColor =  vec4( ratio*0.33, color*ratio*0.7,color*ratio*0.7,dist);",
      "}",
    ].join("\n"),
    side: THREE.DoubleSide,
  });
let sceneShaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms1,
  vertexShader: [
    "varying vec2 vUv;",
    "void main(){",
    "vUv = uv;",
    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "gl_Position = projectionMatrix * mvPosition;",
    "}",
  ].join("\n"),
  fragmentShader: [
    "uniform float time;",
    "varying vec2 vUv;",
    "void main( void ) {",
    "vec2 position = - 1.0 + 2.0 * vUv;",
    "float red = abs( sin( position.x * position.y + time / 5.0 ) );",
    "float green = abs( sin( position.x * position.y + time / 4.0 ) );",
    "float blue = abs( sin( position.x * position.y + time / 3.0 ) );",
    "gl_FragColor = vec4(red, 1, 2,0.7);",
    "}",
  ].join("\n"),
  transparent: true,
  side: THREE.DoubleSide,
});
let clock = new THREE.Clock();
//声明raycaster和mouse变量 响应快一点可以把变量提出去
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
class App {
  constructor() {
    this.initData();
    this.domElement();

    const that = this;
    animate = function () {
      !params.pauseXRay && xRayComposer.render(); //渲染透视场景
      renderer.render(scene, camera);
      stats.update();
      uniforms1.time.value += clock.getDelta() * 5;
      !params.pause &&
        (that.animateCircle(),
        that.positionWorld(),
        window.uniforms2.ratio.value > 3
          ? (window.uniforms2.ratio.value = 0)
          : (window.uniforms2.ratio.value += 0.00702));
      requestAnimationFrame(animate);
    };
    animate();
  }
  initData() {
    this.loadeModels = { count: 0, finished: false };

    this.createModels = {};
    this.circleParams = {
      maxLevel: 10, //总体最大缩放级别
      currentDelay: 3,
      currentLevel1: 0.3, //光圈的缩放级别
      currentLevel2: 0.3,
      currentSpeed1: 0.03, //光圈的变化速度
      currentSpeed2: 0.03,
      opacity: 1, //整体透明度
      startDelay: 0, //延迟启动计时
      startDelayFlag: 5, //延迟启动的界限
      segments: 20,
      animate: true, //是否运行动画
    };

    this.initRender();
    this.initScene();
    this.initWater();
    this.initSky();
    this.initCamera();
    this.initModel();
    this.addCircle();

    this.updateSun();
    this.initControls();
    this.initGui();
    this.initStats();
    this.onWindowResize();
  }
  //添加光圈
  addCircle() {
    let { Group, Mesh, RingBufferGeometry, ShaderMaterial } = THREE;
    xRayRenderScene = new RenderPass(xRayScene, camera);
    xRayComposer = new EffectComposer(renderer);
    xRayComposer.renderToScreen = false;
    xRayComposer.addPass(xRayRenderScene);
    let inner = 150;
    let outer = 170;
    let url = BaseUrl + "src/lib/textures/circle";
    this.textureLoader = new THREE.TextureLoader();
    let texture1 = this.textureLoader.load(`${url}/c1.png`);
    let texture2 = this.textureLoader.load(`${url}/c2.png`);
    let depthTexture = this.textureLoader.load(`${url}/depthTexture.jpg`);

    let circle1 = new Mesh(
      new RingBufferGeometry(inner, outer + 1, 30, 30, 0),
      new ShaderMaterial({
        uniforms: {
          uTexture: {
            value: texture1,
          },
          uXRayTexture: {
            value: xRayComposer.renderTarget2.texture,
          },
          uColor: {
            value: new THREE.Color(0x9cf3ad),
          },
          uTransparent: {
            value: 1,
          },
        },
        vertexShader: [
          "varying highp vec2 vUv;",
          "varying vec2 vScreenPos;",
          "void main() {",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x,position.y+1.0,position.z, 1.0 );",
          "vScreenPos.x = (gl_Position.x/gl_Position.w)/2.0 + 0.5;",
          "vScreenPos.y = (gl_Position.y/gl_Position.w)/2.0 + 0.5;",
          "vUv = uv;",
          "}",
        ].join("\n"),
        fragmentShader: [
          "varying vec2 vScreenPos;",
          "varying highp vec2 vUv;",
          "uniform sampler2D uTexture;",
          "uniform sampler2D uXRayTexture;",
          "uniform vec3 uColor;",
          "uniform float uTransparent;" + "void main() {",
          "vec4 xRayTex = texture2D( uXRayTexture, vScreenPos );",
          "vec4 tex = texture2D( uTexture, vUv );",
          "vec4 finalColor = (xRayTex.w)*vec4(uColor,-1)+tex;",
          "gl_FragColor = vec4(finalColor.xyz,finalColor.w*uTransparent);",
          "}",
        ].join("\n"),
        transparent: true,
        side: THREE.DoubleSide,
      })
    );
    this.circle1lod = new Group();
    this.circle2lod = new Group();
    this.circle1lod.add(circle1);
    let lowCircle1 = new Mesh(
      new THREE.RingBufferGeometry(inner, outer + 1, 40, 10, 0),
      new THREE.MeshBasicMaterial({
        map: texture1,
        transparent: true,
        side: THREE.DoubleSide,
      })
    );
    this.circle1lod.add(lowCircle1);
    this.depthCamera = new THREE.OrthographicCamera(
      -5184 * 5,
      5184 * 5,
      5184 * 5,
      -5184 * 5,
      0,
      400
    );
    const depthProjMatrixInverse = this.depthCamera.projectionMatrixInverse;
    const depthMatrixWorldInverse = this.depthCamera.matrixWorldInverse;
    const depthMatrixWorld = this.depthCamera.matrixWorld.multiply(
      depthProjMatrixInverse
    );
    const depthProjMatrix = this.depthCamera.projectionMatrix.multiply(
      depthMatrixWorldInverse
    );
    let circleMat = new ShaderMaterial({
      uniforms: {
        uDepthProjMatrixInverse: {
          value: depthProjMatrixInverse,
        },
        uDepthMatrixWorldInverse: {
          value: depthMatrixWorldInverse,
        },
        uDepthProjMatrix: {
          value: depthProjMatrix,
        },
        uDepthMatrixWorld: {
          value: depthMatrixWorld,
        },
        uDepthMap: {
          value: depthTexture,
        },
        uMainTexture: {
          value: texture2,
        },
        uCircleColor: {
          value: new THREE.Color(0x00eaff),
        },
        uTransparent: {
          value: 1,
        },
      },
      vertexShader:
        "uniform mat4 uDepthProjMatrixInverse;\n" +
        "    uniform mat4 uDepthMatrixWorldInverse;\n" +
        "    uniform mat4 uDepthProjMatrix;\n" +
        "    uniform mat4 uDepthMatrixWorld;\n" +
        "    uniform sampler2D uDepthMap;\n" +
        "    varying vec2 vUv;\n" +
        "\n" +
        "    void main() {\n" +
        "        vec4 depthPos = uDepthProjMatrix  * modelMatrix * vec4( position, 1.0 );\n" +
        "        vec2 depthScreenPos;\n" +
        "        depthScreenPos.x = (depthPos.x/depthPos.w)*.5+.5;\n" +
        "        depthScreenPos.y = (depthPos.y/depthPos.w)*.5+.5;\n" +
        "        float circleDepth = (depthPos.z/depthPos.w)*.5+.5;\n" +
        "        float depth = texture2D(uDepthMap,depthScreenPos).x;\n" +
        "        depth-=.02;\n" +
        "        vUv = uv;\n" +
        "        vec4 newPos = uDepthMatrixWorld*vec4(depthPos.x,depthPos.y,((depth-.5)/.5)*depthPos.w,depthPos.w);\n" +
        "        gl_Position = projectionMatrix * viewMatrix * vec4( newPos );\n" +
        "    }",
      fragmentShader:
        "    uniform sampler2D uDepthMap;\n" +
        "    uniform vec3 uCircleColor;\n" +
        "    uniform float uTransparent;\n" +
        "    uniform sampler2D uMainTexture;\n" +
        "    varying vec2 vUv;\n" +
        "    void main() {\n" +
        "        gl_FragColor = vec4(uCircleColor,uTransparent);\n" +
        "    }",
      transparent: true,
      side: THREE.DoubleSide,
    });
    let circle2 = new Mesh(
      new RingBufferGeometry(outer + 19, outer + 20, 3000, 10, 0),
      circleMat
    );
    let lowCircle2 = new Mesh(
      new RingBufferGeometry(outer, outer + 20, 40, 10, 0),
      new THREE.MeshBasicMaterial({
        map: texture2,
        transparent: true,
        side: THREE.DoubleSide,
      })
    );
    let smoothCircle2 = new Mesh(
      new RingBufferGeometry(outer, outer + 19.1, 3000, 2, 0),
      new THREE.MeshBasicMaterial({
        map: texture2,
        transparent: true,
        side: THREE.DoubleSide,
      })
    );
    // 旋转贴图
    circle1.rotateX(Math.PI / 2);
    lowCircle1.rotateX(Math.PI / 2);
    circle2.rotateX(Math.PI / 2); // 细亮线
    lowCircle2.rotateX(Math.PI / 2);
    smoothCircle2.rotateX(Math.PI / 2);

    circle1.position.setY(100);
    circle2.position.setY(110);
    lowCircle1.position.setY(99);
    lowCircle2.position.setY(100);
    smoothCircle2.position.setY(99);

    this.circle2lod.add(circle2);
    this.circle2lod.add(lowCircle2);
    this.circle2lod.add(smoothCircle2);

    circle1.name = "innerCircle";
    lowCircle1.name = "lowInnerCircle";
    circle2.name = "outerCircle";
    lowCircle2.name = "lowOuterCircle";
    smoothCircle2.name = "smoothCircle2";
    this.createModels["innerCircle"] = circle1;
    this.createModels["lowInnerCircle"] = lowCircle1;
    this.createModels["outerCircle"] = circle2;
    this.createModels["lowOuterCircle"] = lowCircle2;
    this.createModels["smoothCircle2"] = smoothCircle2;

    let group = new Group();
    group.add(this.circle1lod);
    group.add(this.circle2lod);
    group.name = "circleGroup";
    this.createModels["circleGroup"] = group;
    scene.add(group);
  }
  //光圈动画
  animateCircle() {
    if (!this.circleParams.animate) return;
    if (this.circleParams.startDelay >= this.circleParams.startDelayFlag) {
      //判断是否到达动画结尾
      if (this.circleParams.currentLevel1 >= this.circleParams.maxLevel) {
        //停止动画
        this.circleParams.currentLevel1 = 0.001;
        this.circleParams.currentLevel2 = 0.001;
        this.circleParams.opacity = 1;
        this.circleParams.startDelay = 0;
        window.uniforms2.ratio.value = 0;
      } else {
        //继续动画
        this.circleParams.currentLevel1 += this.circleParams.currentSpeed1;
        // raycaster.setFromCamera({x:1,y:1},camera)
        if (
          this.circleParams.currentLevel1 >=
          this.circleParams.maxLevel -
            this.circleParams.currentSpeed1 * this.circleParams.segments
        ) {
          this.circleParams.opacity -= 1 / this.circleParams.segments;
        }
        //延迟启动内圈
        this.circleParams.currentLevel2 += this.circleParams.currentSpeed2;
        // if (this.circleParams.currentLevel1 >= this.circleParams.currentDelay) {
        // }
      }
      this.createModels["outerCircle"].scale.setScalar(
        this.circleParams.currentLevel1
      );
      this.createModels["outerCircle"].material.uniforms[
        "uTransparent"
      ].value = this.circleParams.opacity;
      this.createModels["lowOuterCircle"].scale.setScalar(
        this.circleParams.currentLevel1
      );
      this.createModels[
        "lowOuterCircle"
      ].material.opacity = this.circleParams.opacity;
      this.createModels["innerCircle"].scale.setScalar(
        this.circleParams.currentLevel2
      );
      this.createModels["innerCircle"].material.uniforms[
        "uTransparent"
      ].value = this.circleParams.opacity;
      this.createModels["lowInnerCircle"].scale.setScalar(
        this.circleParams.currentLevel2
      );
      this.createModels[
        "lowInnerCircle"
      ].material.opacity = this.circleParams.opacity;
      this.createModels["smoothCircle2"].scale.setScalar(
        this.circleParams.currentLevel1
      );
      this.createModels[
        "smoothCircle2"
      ].material.opacity = this.circleParams.opacity;
    } else {
      //记录延时
      this.circleParams.startDelay += 0.1;
    }
  }
  // 初始化渲染器
  initRender() {
    renderer.setSize(
      window.innerWidth * windowSize.multiplyingPower,
      window.innerHeight * windowSize.multiplyingPower
    );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 1); //默认填充颜色
    renderer.shadowMap.enabled = true; //告诉渲染器需要阴影效果
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.setPixelRatio(window.devicePixelRatio); //设置dip 避免hiDPI设备模糊
    renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;
    renderer.debug.checkShaderErrors = false;
  }
  initWater() {
    // 生成水
    var params = {
      color: '#ffffff',
      scale: 4,
      flowX: 1,
      flowY: 1
    };
    // water = new Water(waterGeometry, {
      // textureWidth: 512,
      // textureHeight: 512,
      // waterNormals: new THREE.TextureLoader().load(
      //   BaseUrl + "src/lib/textures/waternormals.jpg",
        // function (texture) {
        //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // }
      // ),
      // alpha: 1.0,
      // sunDirection: new THREE.Vector3(),
      // sunColor: 0xffffff,
      // waterColor: 0x001e0f,
      // distortionScale: 3.7,
      // fog: scene.fog !== undefined,
    // });
    var waterGeometry = new THREE.PlaneBufferGeometry( 4000, 4000 );

				water = new Water( waterGeometry, {
					color: params.color,
					scale: params.scale,
					flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
					textureWidth: 1024,
          textureHeight: 1024,
          normalMap0:new THREE.TextureLoader().load(BaseUrl+"src/lib/textures/Water_1_M_Normal.jpg"),
          normalMap1:new THREE.TextureLoader().load(BaseUrl+"src/lib/textures/Water_2_M_Normal.jpg")
				} );
				water.position.y = -1;
				water.rotation.x = Math.PI * - 0.5;
    // water.rotation.x = -Math.PI / 2;
    scene.add(water);
  }
  // 初始化天空
  initSky() {
    //给场景添加天空盒子纹理
    // let cubeTextureLoader = new THREE.CubeTextureLoader();
    // cubeTextureLoader.setPath(
    //   "http://127.0.0.1:5500/src/demo/lib/textures/cube/skybox/"
    // );
    // //六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx）。
    // let cubeTexture = cubeTextureLoader.load([
    //   "px.jpg",
    //   "nx.jpg",
    //   "py.jpg",
    //   "ny.jpg",
    //   "pz.jpg",
    //   "nz.jpg",
    // ]);
    // scene.background = cubeTexture;

    sky = new Sky();
    sky.scale.setScalar(1000000);
    scene.add(sky);
    let uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 10;
    uniforms["rayleigh"].value = 2;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.8;
    pmremGenerator = new THREE.PMREMGenerator(renderer);
  }
  // 初始化摄像机
  initCamera() {
    camera.position.set(0, 120, 400);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  // 盒子动画
  positionWorld() {
    let time = Date.now() * 0.001;
    positionBox.position.y = Math.sin(time) * 20 + 5;
    positionBox.rotation.x = time * 0.5;
    positionBox.rotation.z = time * 0.51;
    // x扫描部分同步旋转
    positionBoxClone.position.y = Math.sin(time) * 20 + 5;
    positionBoxClone.rotation.x = time * 0.5;
    positionBoxClone.rotation.z = time * 0.51;
    // water.material.uniforms["time"].value += 1.0 / 60.0;
  }
  // 初始化场景
  initScene() {
    // 加光源
    scene.add(new THREE.AmbientLight(0x000000));
    let light = new THREE.DirectionalLight(0xffffff);
    // light.position.set(25, 30, 10);
    //告诉平行光需要开启阴影投射
    light.castShadow = true;
    scene.add(light);

    scene.autoUpdate = true;
  }
  updateSun() {
    let theta = Math.PI * (parameters.inclination - 0.5);
    let phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);
    // water.material.uniforms["sunDirection"].value.copy(sun).normalize();

    scene.environment = pmremGenerator.fromScene(sky).texture;
  }
  //随机生成颜色
  randomColor() {
    let arrHex = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
      ],
      strHex = "#",
      index;
    for (let i = 0; i < 6; i++) {
      index = Math.round(Math.random() * 15);
      strHex += arrHex[index];
    }
    return strHex;
  }
  // 初始化模型
  initModel() {
    // 坐标原点辅助
    let helper = new THREE.AxesHelper(10);
    scene.add(helper);

    // 原点浮动盒子
    positionBox =  new THREE.Mesh(
      new THREE.BoxBufferGeometry(100, 100, 100),
      new THREE.MeshStandardMaterial({ roughness: 0 })
    )
    positionBox.position.z = 300
    positionBox.name = "cubeMesh"
    scene.add(positionBox);
    positionBoxClone =new THREE.Mesh(
      new THREE.BoxBufferGeometry(100, 100, 100),
      new THREE.MeshStandardMaterial({ roughness: 0,wireframe: true, opacity: 0, })
    );
    positionBoxClone.position.z = 300
    positionBoxClone.name = "cubeMesh"
    xRayScene.add(positionBoxClone)

    // 地板
    floorBoard = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(4000, 4000),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 0.8,
        map:new THREE.TextureLoader().load(BaseUrl+'src/lib/textures/grasslight-big.jpg')
      })
    );
    floorBoard.position.y = -2
    floorBoard.rotation.x = -Math.PI / 2;
    floorBoard.receiveShadow = true;
    scene.add(floorBoard);

    // 构建 x -4500处的模型
    cho = new ChooseShader(scene, camera).makePlan(scene, camera)
    
    // 地板割线
    let grid = new THREE.GridHelper(4000, 50, 0xffffff, 0xffffff);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);

    let num = 100
    // 加入模型 一半方盒子 一半碗
    for (let i = 0; i < num; i++) {
      let height = Math.random() * 100
      let cube = new THREE[i > num/2 ? "BoxBufferGeometry" : "CylinderGeometry"](
        100,
        height,
        100
      );

      let position = new THREE.Vector3(
        2000 * (2.0 * Math.random() - 1.0),
        height/2,
        2000 * (2.0 * Math.random() - 1.0)
      );
      scene.add(
        this.newXrayMesh(
          cube,
          new THREE.MeshStandardMaterial({
            color: i>num/2?null:this.randomColor(),
            roughness: 0,
            map:i>num/2?new THREE.TextureLoader().load(BaseUrl+'src/lib/textures/crate.gif'):null
          }),
          position
        )
      );
      xRayScene.add(
        this.newXrayMesh(
          cube,
          new THREE.MeshBasicMaterial({
            color: this.randomColor(),
            // transparent: true,
            wireframe: true,
            opacity: 0,
          }),
          position
        )
      );
    }
    this.initLine();
  }
  // 在原点创建一个红色的线条
  initLine() {
    // 对于线条来说，能使用的材质只有LineBasicMaterial 或者 LineDashedMaterial。
    let material = new THREE.LineDashedMaterial({ color: 0xb94646 }); // 红线
    // 有了材质后，需要顶点几何 geometry  推荐使用BufferGeometry 性能更好
    let geometry2 = new THREE.Geometry();
    let fn = (x, y, z) => {
      return new THREE.Vector3(x, y, z);
    };
    [
      fn(0, 0, 0),
      fn(100, 0, 0),
      fn(0, 0, 100),
      fn(-100, 0, 0),
      fn(0, 0, -100),
      fn(100, 0, 0),
      fn(0, 100, 0),
    ].forEach((el) => geometry2.vertices.push(el));
    fn = null;
    // 线是画在每一对连续的顶点之间的，而不是在第一个顶点和最后一个顶点之间绘制线条，线条并未闭合
    let line = new THREE.Line(geometry2, material);
    scene.add(line);
  }
  // 同步创建模型
  newXrayMesh(cube, material, position) {
    let mesh = new THREE.Mesh(cube, material);
    mesh.layers.enable(1);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    mesh.name = "cubeMesh";
    mesh.updateMatrix();
    return mesh;
  }
  // 初始化摄像机控制
  initControls() {
    let controls = new OrbitControls(camera, renderer.domElement);

    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = false;
    //设置相机距离原点的最远距离
    // controls.minDistance = 50;
    //设置相机距离原点的最远距离
    // controls.maxDistance = 6000;
    //是否开启右键拖拽
    controls.enablePan = true;
  }
  // 初始化右上角参数调整
  initGui() {
    const that = this
    gui = new dat.GUI();

    let Goto = gui.addFolder("Goto");
    Goto.add(params,'gotoNext',['default','ChooseShader']).onChange(el=>{
      if(el==='ChooseShader'){
        cho.moveCamera(camera)
      }
      if(el==='default'){
        that.initCamera()
      }
    })
    Goto.open()
    let skyfolder = gui.addFolder("Sky");
    skyfolder
      .add(parameters, "inclination", 0, 0.5, 0.0001)
      .onChange(this.updateSun);
    skyfolder.add(parameters, "azimuth", 0, 1, 0.0001).onChange(this.updateSun);
    skyfolder.open();

    //  randerer设置
    let rendererfolder = gui.addFolder("renderer");
    rendererfolder
      .add(windowSize, "multiplyingPower", 0.1, 2)
      .step(0.1)
      .onChange(function (value) {
        renderer.setSize(
          window.innerWidth * windowSize.multiplyingPower,
          window.innerHeight * windowSize.multiplyingPower
        );
        renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
      });
    rendererfolder.add(params, "pause");
    rendererfolder.add(params, "pauseXRay");
    rendererfolder.open();

    gui.add(params, "floorBoard").onChange((el) => {
      el && (floorBoard.material = floorBoardShaderMaterial);
      !el &&
        (floorBoard.material = new THREE.MeshPhongMaterial({
          color: 0x9fdb9f,
          transparent: false,
          opacity: 0.8,
        }));
    });
    gui.add(params, "cubeShader").onChange((el) => {
      const fn = (shader) => {
        scene.children.forEach((el) => {
          if (el.name === "cubeMesh") {
            el.material = shader;
          }
        });
      };
      el && fn(sceneShaderMaterial);
      !el &&
        fn(
          new THREE.MeshBasicMaterial({
            color: this.randomColor(),
            transparent: true,
            opacity: 1,
          })
        );
    });
  }
  // 初始化左上角fps性能参数
  initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }
  // 鼠标点击模型时候的事件 （删除）
  onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    // intersects.length >= 1 && scene.remove(intersects[0].object);
    intersects.length >= 1 && intersects[0].object.material.color.set(0xffffff);
  }
  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //?
    renderer.setSize(
      window.innerWidth * windowSize.multiplyingPower,
      window.innerHeight * windowSize.multiplyingPower
    );
    renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
  }
  domElement() {
    window.onresize = this.onWindowResize;
    //高亮元素
    // document.addEventListener("click", this.onMouseClick, false);
    // 空格键暂停播放
    document.body.onkeydown = function (e) {
      if (e.keyCode === 32) {
        document
          .querySelector(
            "body > div.dg.ac > div > ul > li.folder > div > ul > li:nth-child(3) > div > div > input[type=checkbox]"
          )
          .click();
      }
    };
  }
}
new App();
