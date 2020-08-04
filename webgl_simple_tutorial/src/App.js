import React from 'react';
import './styles/App.css';
import Nav from '@/pages/Nav/'

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){
    let domList = document.getElementsByClassName('upload')
    for(let i =0,l=domList.length;i<l;i++){
      const el = domList[i]
      el['onmouseover']=(el)=>{
        window.scrollHistory = window.scrollY
          let body = document.getElementsByTagName('body')[0]
        body.style.position = 'fixed'
        body.style.top=-window.scrollHistory+'px'
      }
      el['onmouseout']=(el)=>{
        let body = document.getElementsByTagName('body')[0]
        body.style.position = 'static'
        window.scrollTo(0,window.scrollHistory)
      }
    }
  }
  render(){
    return(
      <Nav />
)
  }
}

export default App;
