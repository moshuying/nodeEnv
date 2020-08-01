import * as THREE from 'three'

export default {
    sync: function (camera, map, pm) {
        camera.projectionMatrix = this._getProjectMatrix(map);
        camera.matrixWorld = new THREE.Matrix4().getInverse(pm).multiply(camera.projectionMatrix);
        //
        camera.matrixWorld.decompose(camera.position, camera.quaternion, camera.scale);
        camera.scale.set(1, 1, 1);
        camera.matrixWorld.compose(camera.position, camera.quaternion, camera.scale);
        //
        camera.projectionMatrix = pm.clone().multiply(camera.matrixWorld);
        camera.matrixWorldInverse.getInverse(camera.matrixWorld);
        camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
        camera.matrix = camera.matrixWorld.clone();
        camera.matrixAutoUpdate = false;
        camera.matrixWorldNeedsUpdate = false;
    },
    _getProjectMatrix: function (map) {
        var cameraToCenterDistance = map.transform.cameraToCenterDistance;
        const halfFov = map.transform._fov / 2;
        const groundAngle = Math.PI / 2 + map.transform._pitch;
        const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);
        const furthestDistance = Math.cos(Math.PI / 2 - map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;
        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        const farZ = furthestDistance * 1.01;
        var matrix = new THREE.Matrix4();
        this._perspective(matrix.elements, map.transform._fov, map.transform.width / map.transform.height, 1, farZ);

        return matrix;
    },
    _perspective: function (out, fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy / 2);
        let nf = 1 / (near - far);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
        return out;
    },
};