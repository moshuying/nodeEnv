import ThreeBox from "../ThreeBox"
import Scan from "./effectStore/Scan"
import Shine from "./effectStore/Shine"
import Physics from "./effectStore/Physics"

class THREE extends ThreeBox{
  constructor(map,size,threeDomId,center,react){
    super(map,size,threeDomId,center)
    // this.register(new Scan(this))
    // this.disRegisterAll()
    this.init()
  }
  loaded(){
    this.register(new Shine(this))
    this.register(new Physics(this))
  }
}
export default THREE