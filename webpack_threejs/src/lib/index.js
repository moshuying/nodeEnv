import Scene from "./core/Scene"
import Test from "./effectStore/Test"
class View extends Scene{
  constructor() {
    super();
    this.register(new Test(this))
  }
}
export default View
