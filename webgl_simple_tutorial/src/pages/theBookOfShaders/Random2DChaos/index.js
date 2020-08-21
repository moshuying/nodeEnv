import React from 'react';
import Matrix4 from '@/lib/cuon-matrix'
import {getWebGLContext, initShaders} from '@/lib/cuon-utils'

class Random2DChaos extends React.Component {
  vertexShader = [
    'attribute vec4 a_Position;',
    'uniform mat4 u_MvpMatrix;',
    'varying vec2 u_resolution;',
    'void main() {',
    '  gl_Position = u_MvpMatrix * a_Position ;',
    '  u_resolution =gl_Position.xy;',
    '}'
  ].join('\n')
  fragmentShader = [
    'precision mediump float;',
    'varying vec2 u_resolution;',
    'float random (vec2 st) {',
    '    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);',
    '}',
    'void main() {',
    '  vec2 st = gl_FragCoord.xy/u_resolution.xy;',
    '  st *= 10.0;',
    '  vec2 ipos = floor(st);',
    '  vec2 fpos = fract(st);',
    '  vec3 color = vec3(random(ipos));',
    // '  vec3 color = vec3(fpos,0.0);',
    '  gl_FragColor = vec4(color,1.0);',
    '}'
  ].join('\n')
  canvas = null
  gl = null
  currentAngle = [0.0, 0.0]; // 绕X轴Y轴的旋转角度 ([x-axis, y-axis])
  curScale = 1.0;   //当前的缩放比例
  main() {
    this.canvas = document.getElementById('TheBookOfShadersRandom2DChaos')
    this.canvas.width = this.canvas.width * 2
    this.canvas.height = this.canvas.height * 2
    this.gl = getWebGLContext(this.canvas)
    initShaders(this.gl, this.vertexShader, this.fragmentShader)
    // 设置顶点位置
    this.cuboid = new Cuboid(10, 20, 10, 20, 10, 20)
    this.n = initVertexBuffers(this.gl, this.cuboid)
    //注册鼠标事件
    this.initEventHandlers(this.canvas, this.curScale, this.currentAngle, this.renderer)
    // 指定清空<canvas>的颜色
    this.gl.clearColor(0.0, 0.0, 0.0, 0.1);

    // 开启深度测试
    this.gl.enable(this.gl.DEPTH_TEST);

    //开始绘制
    this.renderer()

    // 绘制矩形体
    this.gl.drawElements(this.gl.TRIANGLES, this.n, this.gl.UNSIGNED_BYTE, 0);
  }

  //设置MVP矩阵

  setMVPMatrix() {
    // Get the storage location of u_MvpMatrix
    let u_MvpMatrix = this.gl.getUniformLocation(this.gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }

    //模型矩阵
    let modelMatrix = new Matrix4();
    modelMatrix.scale(this.curScale, this.curScale, this.curScale);
    modelMatrix.rotate(this.currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
    modelMatrix.rotate(this.currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
    modelMatrix.translate(-this.cuboid.CenterX(), -this.cuboid.CenterY(), -this.cuboid.CenterZ());

    //投影矩阵
    let fovy = 60;
    let projMatrix = new Matrix4();
    projMatrix.setPerspective(fovy, this.canvas.width / this.canvas.height, 1, 10000);

    //计算lookAt()函数初始视点的高度
    let angle = fovy / 2 * Math.PI / 180.0;
    let eyeHight = (this.cuboid.LengthY() * 1.2) / 2.0 / angle;

    //视图矩阵
    let viewMatrix = new Matrix4();  // View matrix
    viewMatrix.lookAt(0, 0, eyeHight, 0, 0, 0, 0, 1, 0);

    //MVP矩阵
    let mvpMatrix = new Matrix4();
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    //将MVP矩阵传输到着色器的uniform变量u_MvpMatrix
    this.gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  }

  //注册鼠标事件
  initEventHandlers() {
    let dragging = false;         // Dragging or not
    let lastX = -1, lastY = -1;   // Last position of the mouse
    const that = this
    //鼠标按下
    this.canvas.onmousedown = function (ev) {
      let x = ev.clientX;
      let y = ev.clientY;
      // Start dragging if a moue is in <this.canvas>
      let rect = ev.target.getBoundingClientRect();
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        lastX = x;
        lastY = y;
        dragging = true;
      }
      that.renderer();
    };

    //鼠标离开时
    this.canvas.onmouseleave = function () {
      dragging = false;
    };

    //鼠标释放
    this.canvas.onmouseup = function () {
      dragging = false;
    };

    //鼠标移动
    this.canvas.onmousemove = function (ev) {
      let x = ev.clientX;
      let y = ev.clientY;
      if (dragging) {
        let factor = 100 / that.canvas.height; // The rotation ratio
        let dx = factor * (x - lastX);
        let dy = factor * (y - lastY);
        that.currentAngle[0] = that.currentAngle[0] + dy;
        that.currentAngle[1] = that.currentAngle[1] + dx;
      }
      lastX = x
      lastY = y
      that.renderer();
    };

    //鼠标缩放
    this.canvas.onmousewheel = function (event) {
      if (event.wheelDelta > 0) {
        that.curScale = that.curScale * 1.1;
      } else {
        that.curScale = that.curScale * 0.9;
      }
      that.renderer()
    };
  }

  renderer() {
    //设置MVP矩阵
    this.setMVPMatrix();

    //清空颜色和深度缓冲区
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    //绘制矩形体
    this.gl.drawElements(this.gl.TRIANGLES, this.n, this.gl.UNSIGNED_BYTE, 0);

  }

  componentDidMount() {
    this.main()
  }

  render() {
    return (
      <div className="upload">
        <canvas id="TheBookOfShadersRandom2DChaos"/>
        <div className="summary">使用混沌</div>
      </div>
    );
  }
}

class Cuboid {
  constructor(minX, maxX, minY, maxY, minZ, maxZ) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.minZ = minZ;
    this.maxZ = maxZ;
  }

  CenterX() {
    return (this.minX + this.maxX) / 2.0;
  }

  CenterY() {
    return (this.minY + this.maxY) / 2.0;
  }

  CenterZ() {
    return (this.minZ + this.maxZ) / 2.0;
  }

  LengthX() {
    return (this.maxX - this.minX);
  }

  LengthY() {
    return (this.maxY - this.minY);
  }
}

function initVertexBuffers(gl, cuboid) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // 顶点坐标和颜色
  let verticesColors = new Float32Array([
    cuboid.maxX, cuboid.maxY, cuboid.maxZ, 1.0, 1.0, 1.0,  // v0 White
    cuboid.minX, cuboid.maxY, cuboid.maxZ, 1.0, 0.0, 1.0,  // v1 Magenta
    cuboid.minX, cuboid.minY, cuboid.maxZ, 1.0, 0.0, 0.0,  // v2 Red
    cuboid.maxX, cuboid.minY, cuboid.maxZ, 1.0, 1.0, 0.0,  // v3 Yellow
    cuboid.maxX, cuboid.minY, cuboid.minZ, 0.0, 1.0, 0.0,  // v4 Green
    cuboid.maxX, cuboid.maxY, cuboid.minZ, 0.0, 1.0, 1.0,  // v5 Cyan
    cuboid.minX, cuboid.maxY, cuboid.minZ, 0.0, 0.0, 1.0,  // v6 Blue
    cuboid.minX, cuboid.minY, cuboid.minZ, 1.0, 0.0, 1.0   // v7 Black
  ]);

  //顶点索引
  let indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // 前
    0, 3, 4, 0, 4, 5,    // 右
    0, 5, 6, 0, 6, 1,    // 上
    7, 5, 6, 7, 5, 4,    // 后
    7, 6, 2, 7, 1, 6,    // 左
    7, 3, 4, 7, 3, 2     // 下
  ]);

  let FSIZE = verticesColors.BYTES_PER_ELEMENT;   //数组中每个元素的字节数

  // 创建缓冲区对象
  let vertexColorBuffer = gl.createBuffer();
  let indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 向缓冲区对象写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  //获取着色器中attribute变量a_Position的地址
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  // 将顶点索引写入到缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}


export default Random2DChaos
