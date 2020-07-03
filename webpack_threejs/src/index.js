import * as THREE from "three";
import { DirectionalLight } from "three/src/lights/DirectionalLight";
import dat from "three/examples/jsm/libs/dat.gui.module";
import Stats from "three/examples/jsm/libs/stats.module";
import { CubeGeometry } from "three/src/Three.Legacy";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

let renderer,
  camera,
  scene,
  gui,
  stats,
  params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0,
  },
  windowSize = {
    multiplyingPower: 1,
  },
  composer,
  bloomPass;

class App {
  constructor() {
    this.initData();
    this.addCircle();
    //删除元素
    document.addEventListener("click", this.onMouseClick, false);
    const that = this
    animate();
    function animate() {
      
      that.animateCircle();
      requestAnimationFrame(animate); 
      stats.update();
      renderer.clear();
      camera.layers.set(1);
      composer.render();
      renderer.clearDepth();
      camera.layers.set(0);
      renderer.render(scene, camera);
    }
  }
  initData() {
    this.createModels = {};
    this.circleParams = {
      maxLevel: 10, //总体最大缩放级别
      currentDelay: 3,
      currentLevel1: 0.1, //光圈的缩放级别
      currentLevel2: 0.1,
      currentSpeed1: 0.01, //光圈的变化速度
      currentSpeed2: 0.01,
      opacity: 1, //整体透明度
      startDelay: 0, //延迟启动计时
      startDelayFlag: 5, //延迟启动的界限
      segments: 20,
      animate: true, //是否运行动画
    };

    this.initRender();
    this.initCamera();
    this.initScene();
    this.initModel();
    this.initControls();
    this.initGui();
    this.initStats();
    this.onWindowResize()
  }
  //添加光圈
  addCircle() {
    let { Group, Mesh, RingBufferGeometry, ShaderMaterial } = THREE;
    this.xRayScene = new THREE.Camera();
    let xRayRenderScene = new RenderPass(this.xRayScene, camera);
    this.xRayComposer = new EffectComposer(renderer);
    this.xRayComposer.renderToScreen = false;
    this.xRayComposer.addPass(xRayRenderScene);

    let inner = 150;
    let outer = 170;
    let url = "http://127.0.0.1:5500/src/lib/textures/circle/";
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
            value: this.xRayComposer.renderTarget2.texture,
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
          "vec4 finalColor = (xRayTex.w+.1)*vec4(uColor,1)+tex;",
          "gl_FragColor = vec4(finalColor.xyz,finalColor.w*uTransparent);",
          "}",
        ].join("\n"),
        transparent: true,
      })
    );
    this.circle1lod = new THREE.Group();
    this.circle2lod = new THREE.Group();
    this.circle1lod.add(circle1);
    let lowCircle1 = new THREE.Mesh(
      new THREE.RingBufferGeometry(inner, outer + 1, 40, 10, 0),
      new THREE.MeshBasicMaterial({
        map: texture1,
        transparent: true,
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
    let circleMat = new THREE.ShaderMaterial({
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
      new RingBufferGeometry(outer + 19, outer + 20, 30, 80, 0),
      circleMat
    );
    let lowCircle2 = new Mesh(
      new RingBufferGeometry(outer, outer + 20, 40, 10, 0),
      new THREE.MeshBasicMaterial({
        map: texture2,
        transparent: true,
      })
    );
    let smoothCircle2 = new Mesh(
      new RingBufferGeometry(outer, outer + 19.1, 3000, 2, 0),
      new THREE.MeshBasicMaterial({
        map: texture2,
        transparent: true,
      })
    );
    // 旋转贴图
    circle1.rotateX(Math.PI/2);
    lowCircle1.rotateX(Math.PI/2);
    circle2.rotateX(Math.PI/2); // 细亮线
    lowCircle2.rotateX(Math.PI/2);
    smoothCircle2.rotateX(Math.PI/2);

    this.circle2lod.add(circle2);
    this.circle2lod.add(lowCircle2);

    this.circle2lod.add(smoothCircle2);

    circle1.position.setY(-100);
    lowCircle1.position.setY(-99);
    lowCircle2.position.setY(-100);

    circle2.position.setY(-100)
    smoothCircle2.position.setY(-99)

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
      } else {
        //继续动画
        this.circleParams.currentLevel1 += this.circleParams.currentSpeed1;
        if (
          this.circleParams.currentLevel1 >=
          this.circleParams.maxLevel -
            this.circleParams.currentSpeed1 * this.circleParams.segments
        ) {
          this.circleParams.opacity -= 1 / this.circleParams.segments;
        }
        //延迟启动内圈
        this.circleParams.currentLevel2 += this.circleParams.currentSpeed2;
        if (this.circleParams.currentLevel1 >= this.circleParams.currentDelay) {
        }
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
    renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
    renderer.setSize(
      window.innerWidth * windowSize.multiplyingPower,
      window.innerHeight * windowSize.multiplyingPower
    );
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0xffffff);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;

    renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;
  }
  // 初始化摄像机
  initCamera() {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000
    );
    camera.position.set(0, -400, 200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  // 初始化场景
  initScene() {
    //给场景添加天空盒子纹理
    let cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath(
      "http://127.0.0.1:5500/src/demo/lib/textures/cube/skybox/"
    );
    //六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx）。
    let cubeTexture = cubeTextureLoader.load([
      "px.jpg",
      "nx.jpg",
      "py.jpg",
      "ny.jpg",
      "pz.jpg",
      "nz.jpg",
    ]);
    scene = new THREE.Scene();
    scene.background = cubeTexture;

    // 加光源
    scene.add(new THREE.AmbientLight(0x404040));
    let pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);

    const renderScene = new RenderPass(scene, camera);
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    // let light = new DirectionalLight(0xffffff);
    // light.position.set(0, 20, 10);

    // light.castShadow = true;
    // light.shadow.camera.top = 10;
    // light.shadow.camera.bottom = -10;
    // light.shadow.camera.left = -10;
    // light.shadow.camera.right = 10;

    // light.castShadow = true;
    // scene.add(light);
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
    // 地板
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(4000, 4000),
      new THREE.MeshPhongMaterial({ color: 0x6e6e6e, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
    // 地板割线
    let grid = new THREE.GridHelper(4000, 50, 0xffffff, 0xffffff);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);

    // 加入模型
    for (let i = 0; i < 200; i++) {
      let cube = new CubeGeometry(100, Math.random() * 100, 100);
      let material = new THREE.MeshBasicMaterial({
        color: this.randomColor(),
        transparent: true,
        opacity: 1,
      });
      let mesh = new THREE.Mesh(cube, material);
      mesh.layers.enable(1);
      mesh.position.x = 2000 * (2.0 * Math.random() - 1.0);
      mesh.position.z = 2000 * (2.0 * Math.random() - 1.0);
      // 辉光

      mesh.updateMatrix();
      scene.add(mesh);
    }
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
    // controls.maxDistance = 200;
    //是否开启右键拖拽
    controls.enablePan = true;
  }
  // 初始化右上角参数调整
  initGui() {
    gui = new dat.GUI();
    gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
      renderer.toneMappingExposure = Math.pow(value, 4.0);
    });

    gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
      bloomPass.threshold = Number(value);
    });

    gui.add(params, "bloomStrength", 0.0, 3.0).onChange(function (value) {
      bloomPass.strength = Number(value);
    });

    gui
      .add(params, "bloomRadius", 0.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        bloomPass.radius = Number(value);
      });

    gui
      .add(windowSize, "multiplyingPower", 0.1, 2)
      .step(0.1)
      .onChange(function (value) {
        renderer.setSize(
          window.innerWidth * windowSize.multiplyingPower,
          window.innerHeight * windowSize.multiplyingPower
        );
        renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
      });
  }
  // 初始化左上角fps性能参数
  initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }
  // 鼠标点击模型时候的事件 （删除）
  onMouseClick(event) {
    //声明raycaster和mouse变量 相应快一点可以把变量提出去
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    intersects.length >= 1 && scene.remove(intersects[0].object);
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
}
new App();
