
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './nav.scss'
const beforeEach = true
export default class home extends Component{
  createRouter(){
    let router = [
      {path:'/',name: 'Home'},
      {path:'/Basemap',name: 'Basemap'}
    ]
    if(beforeEach){
      return router.map((el,index)=>{
        return <li key={index}><Link to={el.path}>{el.name}</Link></li>
      })
    }
  }
  render(){
    return (
    <nav>
      <ul>
        {this.createRouter()}    
      </ul>
    </nav>
    )
  }
}