let voidFn = (e)=>{console.log(e)}
class XMenu extends HTMLElement{
    constructor(options){
        super();
        this.config = {...options}
        let style = document.createElement('style')
        style.innerHTML ='x-menu > div{white-space: pre;}'
        document.head.appendChild(style)
        this.configE(options)
        this.hiddenAll()
    }
    configE(options){
        for(const key in options){
            if(options.hasOwnProperty(key)){
                switch(options[key].type){
                    case 'primaryBtn':
                        this.primaryBtn(options[key]);
                        break;
                    default: break;
                }
            }
            // if(this[key]){
            //     options[key] && this[key](options[key])
            // }else{
            //     console.error('[xMenu eroor]: No \''+key+'\' methods in xMenu')
            // }
        }
    }
    primaryBtn(key){
        let element = document.createElement( 'div' )
        element.innerHTML = key.name
        element.onclick = key.fn
        this.appendChild(element)
    }
    position(x,y){
        this.style.position = 'absolute'
        this.style.top = x+'px'
        this.style.left = y+'px'
        this.style.visibility ='unset'
    }
    hiddenAll(){
        this.style.visibility ='hidden'
    }
}

/**
 * 点击模型时模型周围的菜单
 * @param options
 * @return {HTMLElement}
 * @constructor
 */
function xMenu(options){
    customElements.define('x-menu', XMenu)
    let menu = new XMenu(options)
    document.body.appendChild(menu)
    return menu
}
export {xMenu}