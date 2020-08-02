class lngLatXYConvert{
    constructor(){
        this.XBLLC_WORLD_SIZE = 512;
        this.XBLLC_MERCATOR_A = 6378137.0;
        this.PROJECTION_XBLLC_WORLD_SIZE = this.XBLLC_WORLD_SIZE / (this.XBLLC_MERCATOR_A * Math.PI) / 2;
        this.XBLLC_DEG2RAD = Math.PI / 180;
        this.XBLLC_RAD2DEG = 180 / Math.PI;
        this.XBLLC_EARTH_CIRCUMFERENCE = this.XBLLC_MERCATOR_A * 2 * Math.PI;
    }
    _projectToWorld(lnglat){
        return {
            x: this.XBLLC_MERCATOR_A * lnglat[0] * this.XBLLC_DEG2RAD * this.PROJECTION_XBLLC_WORLD_SIZE,
            y: this.XBLLC_MERCATOR_A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * lnglat[1] * this.XBLLC_DEG2RAD))) * this.PROJECTION_XBLLC_WORLD_SIZE
        };
    }
    _unprojectFromWorld(world_xy){
        return [
            world_xy.x / (this.XBLLC_MERCATOR_A * this.XBLLC_DEG2RAD * this.PROJECTION_XBLLC_WORLD_SIZE),
            -2 * (Math.atan(Math.exp(world_xy.y / (this.PROJECTION_XBLLC_WORLD_SIZE * (-this.XBLLC_MERCATOR_A)))) - Math.PI / 4) / this.XBLLC_DEG2RAD
        ];
    }
    _projectedUnitsPerMeter(latitude){
        return Math.abs(this.XBLLC_WORLD_SIZE * (1 / Math.cos(latitude * Math.PI/180))/this.XBLLC_EARTH_CIRCUMFERENCE);
    }
    /**
     * 经纬度转three坐标
     *    中心点center_latlng处坐标为0，地面向东为x轴，向北为y轴，向天空为z轴
     *    convert_lnglat: 需要转换的经纬度坐标，如 [118.1, 31.1]
     *    center_lnglat: 中心点坐标，如[118.2, 32.1]
     *    return {x:1,y:2}, 单位米
     * @param {Array} convert_lnglat - 对象所在经纬度
     * @param {Array} center_lnglat - 原点经纬度
     * @return {Object} {x,y} - three坐标
     */
    getXY(convert_lnglat, center_lnglat){
        if (convert_lnglat === undefined ||
            center_lnglat === undefined ||
            center_lnglat[0] === undefined ||
            center_lnglat[1] === undefined ||
            convert_lnglat[0] === undefined ||
            convert_lnglat[1] === undefined)
        {
            throw new Error("getXY param error");
        }
        let world_pos = this._projectToWorld(convert_lnglat);
        let center_world_pos = this._projectToWorld(center_lnglat);
        let ratio = this._projectedUnitsPerMeter(center_lnglat[1]);
        if (ratio === 0) {
            return {x: 0, y: 0};
        } else {
            return {x: (world_pos.x - center_world_pos.x) / ratio, y: (world_pos.y - center_world_pos.y) / ratio};
        }


    }
    /**
     * three坐标转经纬度
     *   中心点center_latlng处坐标为0，地面向东为x轴，向北为y轴，向天空为z轴
     *   xy: 格式如{x:1,y:2}，单位米
     *   center_lnglat: 中心点坐标，如[118.2, 32.1]
     *   return xy处经纬度坐标，格式如[118.1, 31.1]
     * @param {Object} xy
     * @param {Array} center_lnglat - 原点经纬度
     * @return {Array} [] - 经纬度数组
     */
    getLngLat(xy, center_lnglat){
        if (
            xy === undefined ||
            center_lnglat === undefined ||
            center_lnglat[0] === undefined ||
            center_lnglat[1] === undefined ||
            xy.x === undefined ||
            xy.y === undefined)
        {
            throw new Error("getLngLat param error");
        }
        let center_world_pos = this._projectToWorld(center_lnglat);
        let ratio = this._projectedUnitsPerMeter(center_lnglat[1]);
        let world_pos ={};
        world_pos.x = xy.x * ratio + center_world_pos.x;
        world_pos.y = xy.y * ratio + center_world_pos.y;
        return this._unprojectFromWorld(world_pos);
    }

    addAtCoordinate(object, lnglat, zPos, scene, origin) {
        let z = zPos || 0;
        let xy = this.getXY(lnglat, origin);
        object.position.set(xy.x, xy.y, z);
        scene.add(object);

        object.coordinates = lnglat;
        return object;
    }
}

export  default   new lngLatXYConvert()
