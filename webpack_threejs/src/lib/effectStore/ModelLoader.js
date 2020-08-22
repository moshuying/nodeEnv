import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
const { Scene, PerspectiveCamera, WebGLRenderer } = THREE;
/**
 * shader 示例
 */
class Shader {
  /**
   *
   * @param threeBox
   * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
   */
  constructor(threeBox) {
    this.name = "Shader";
    this.threeBox = threeBox;
    this.mountArray = ["addSelect", "resetSelect"];
    this.Event = {
      resizeEvent: [],
      clickEvent: [],
    };

    this.allGroup = new THREE.Group();
    this.threeBox.scene.add(this.allGroup);

    this.init();
    this.initGUI();
  }
  init() {

  }
  initGUI() {
    this.options = {
      download: () => {
        let exporter = new GLTFExporter();
        exporter.parse(
          this.allGroup.children[0],
          (buffer) => {
            let blob = new Blob([buffer], { type: "application/octet-stream" });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = new Date().getTime() + ".glb";
            a.click();
          },
          { binary: true }
        );
      },
      "fbx,glb,obj加载": () => {
        let obj = {
          obj: this.loadObjFile,
          glb: this.loadGLBFile,
          gltf: this.loadGLBFile,
          fbx: this.loadFBXFile,
          // 'svg':loadSVG,
          // 'geojson':loadGeojson,
          // 'json':loadGeojson,
        };
        const getName = (file) =>file.parent.name.split(".")[file.parent.name.split(".").length - 1].toLocaleLowerCase();
        this.upTextFile((res) => {
          !Array.isArray(res) && (res = [res]);
          res.forEach((file) => {
            try {
              obj[getName(file)].apply(this,[file]);
            } catch (e) {
              console.log(
                "[Super Loader Error] not support " +
                  getName(file) +
                  " file Type",
                e
              );
            }
          });
        });
      },
    };
    window.gui.add(this.options, "download");
    window.gui.add(this.options, "fbx,glb,obj加载");
  }
  initEvent() {
    // this.Event.resizeEvent.push(()=>{})
    // this.Event.clickEvent.push(()=>{})
  }

  render() {}
  loadFBXFile(file) {
    const loader = new FBXLoader();
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file.parent);
    fileReader.onload = (res) => {
      const group = loader.parse(res.target.result, "./");
      group.name = file.parent.name;
      this.allGroup.add(group);
    };
  }
  loadGLBFile(file) {
    const loader = new GLTFLoader();
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file.parent);
    const that = this;
    fileReader.onload = (res) => {
      loader.parse(res.target.result, "./", (object) => {
        const group = new THREE.Group();
        group.name = file.parent.name;

        guiConfig.operate_group.default.obj[file.parent.name.split(".")[0]] =
          group.id;
        guiParam = guiInit(guiConfig);

        object.scene.children.forEach((object3d) => {
          if (object3d instanceof THREE.Object3D) {
            group.add(object3d);
          }
        });

        that.allGroup.add(group);
      });
    };
  }
  loadObjFile(file) {
    const loader = new OBJLoader();
    const object3d = loader.parse(file.currentTarget.result);
    object3d.name = file.parent.name;
    this.allGroup.add(object3d);
  }
  // 多选上传
  upTextFile(cb) {
    const uploadHtmlElement = document.createElement("input");
    uploadHtmlElement.id = "jsModule_fun_upFile_input";
    uploadHtmlElement.type = "file";
    uploadHtmlElement.multiple = "multiple";
    document.body.append(uploadHtmlElement);

    document
      .querySelector("#jsModule_fun_upFile_input")
      .addEventListener("change", function (event) {
        document.body.removeChild(
          document.querySelector("#jsModule_fun_upFile_input")
        );
        const [promise, files] = [[], event.target.files];
        for (let i = 0; i < files.length; i++) {
          const f = new FileReader();
          promise.push(
            new Promise((resolve) => {
              f.readAsText(files[i]);
              f.onload = (res) => {
                res.parent = files[i];
                resolve(res);
              };
            })
          );
        }
        Promise.all(promise).then((res) => {
          cb(res);
        });
      });

    document.querySelector("#jsModule_fun_upFile_input").click();
  }
}
export default Shader;
