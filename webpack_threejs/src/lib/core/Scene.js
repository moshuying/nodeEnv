import THREE from './three.js'
import BaseScene from './BaseScene.js'
class scene extends BaseScene{
  constructor(){
    super();
    this.initScene()
    this.initControls()
  }
  initScene(){
    this.BaseGroup.name = "Web3DSceneBaseGroup";
    let group = this.BaseGroup;
    const scene = this.scene;
    scene.name = "Web3DSceneScene";
    scene.autoUpdate = true;
    scene.name = 'indexScene'
    scene.background = new THREE.Color(0x000000)
    // 添加原点辅助
    let helper =new THREE.AxesHelper(1)
    helper.name = '原点辅助'
    group.add(helper)

    let ambientLight = new THREE.AmbientLight("#111111");
    ambientLight.name = '环境光'
    group.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight("#ffffff");
    directionalLight.name = '平行光'
    directionalLight.position.set(-40, 12, -130);

    directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
    directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
    directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = 50; //最右边
    directionalLight.shadow.camera.top = 50; //最上边
    directionalLight.shadow.camera.bottom = -50; //最下面

    //这两个值决定使用多少像素生成阴影 默认512
    directionalLight.shadow.mapSize.height = 8192;
    directionalLight.shadow.mapSize.width = 8192;
    //告诉平行光需要开启阴影投射
    directionalLight.castShadow = true;
    group.add(directionalLight);

    let plan = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000),new THREE.MeshBasicMaterial({color:0xc3c3c3}))
    plan.name='地板'
    plan.rotation.x = -0.5 * Math.PI
    plan.position.y = -0
    plan.receiveShadow = true
    group.add(plan)
    scene.add(group)

    this.camera.name = "Web3DSceneCamera";
    this.camera.position.set(0, 2, 30)
  }
  initControls(){
    const controls = this.controls
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
    //设置相机距离原点的最近距离
    // controls.minDistance = 50;
    //设置相机距离原点的最远距离
    // controls.maxDistance = 200;
    //是否开启右键拖拽
    controls.enablePan = true;
  }
}
export default scene
