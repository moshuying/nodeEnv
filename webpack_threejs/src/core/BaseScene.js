import THREE from "./three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

class BaseScene {
  constructor() {
    // 初始化three基本条件
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.BaseGroup = new THREE.Group();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    // 初始化three注册数组
    this.registerAll = [];
    this.resizeEvent = [];
    this.clickEvent = [];
    // 初始化场景选取射线
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.initEvent();
    this.animation();
  }
  
  
  initEvent() {
    const rayCaster = (event) => {
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      let intersects = this.raycaster.intersectObjects(this.scene.children);

      if (intersects.length) {
        return intersects;
      } else {
        return false;
      }
    };
    this.resizeEvent.push(() => {
      Start.onWindowResize(this.camera, this.renderer);
    });
    window.onresize = () => {
      this.resizeEvent.forEach((el) => el());
    };
    document.getElementsByTagName("body")[0].addEventListener("click", (e) => {
      this.clickEvent.forEach((el) => {
        Object.prototype.toString.call(el) === "[object Function]" &&
          el(e, rayCaster(e));
      });
    });
  }
  animation() {
    this.renderer.render(this.scene, this.camera);
    for (const key in this.registerAll) {
      if (this.registerAll.hasOwnProperty(key)) {
        this.registerAll[key].render();
      }
    }
    window.requestAnimationFrame(BaseScene.prototype.animation.bind(this));
  }

  /**
   * 注册业务对象同时注册业务对象内的方法到three
   * @param {*}sub
   */
  register(sub) {
    this.registerAll[sub.name] = sub;
    if (sub.mountArray) {
      this.registerArray(sub.mountArray, sub);
    }
    // 事件注册
    if (sub.Event) {
      for (const eventName in sub.Event) {
        if (sub.Event.hasOwnProperty(eventName)) {
          this[eventName].push(sub.Event[eventName]);
        }
      }
    }
  }

  /**
   * 注册函数到three
   * @param {string[]} arr 要注册到three的函数名称数组
   * @param {object} sub 该函数对应的this作用域
   */
  registerArray(arr, sub) {
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      this[el] = (...args) => {
        sub[el].apply(sub, args);
      };
    }
  }

  /**
   * 取消注册以彻底关闭渲染并从内存中清除
   * @param {string} name
   */
  disRegister(name) {
    if (this.registerAll[name].mountArray) {
      for (let i = 0; i < this.registerAll[name].mountArray.length; i++) {
        this[this.registerAll[name].mountArray[i]] = null;
        delete this.registerAll[name].mountArray[i];
      }
    }
    this.registerAll[name].dispose && this.registerAll[name].dispose();
    this.disposer(this.registerAll[name]);
    this.registerAll[name] = null;
    delete this.registerAll[name];
    return !Boolean(this.registerAll[name]);
  }

  /**
   * 取消全部注册
   */
  disRegisterAll() {
    for (const key in this.registerAll) {
      if (this.registerAll.hasOwnProperty(key)) {
        this.disRegister(key);
      }
    }
  }

  /**
   * 遍历清除
   * @param {Object} sub
   */
  disposer(sub) {
    const recursion = (obj) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && Boolean(obj[key])) {
          if (!(obj[key].name && obj[key].name.includes("BaseScene"))) {
            if (obj[key].isGroup) {
              obj[key].children.forEach((child) => {
                child.geometry && child.geometry.dispose();
                child.material && child.material.dispose();
                obj[key].remove(child);
              });
            }

            if (obj[key] instanceof THREE.Object3D) {
              obj[key].geometry && obj[key].geometry.dispose();
              obj[key].material &&
                obj[key].material.dispose &&
                obj[key].material.dispose();
              this.scene.remove(obj[key]);
            }

            obj[key] = null;
          } else {
          }
        }
      }
    };
    recursion(sub);
  }
}
export default BaseScene
