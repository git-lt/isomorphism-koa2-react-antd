import React, { Component } from 'react'
import {connect} from 'react-redux';

@connect(
  state => state.server,
)

class Home extends Component{
  constructor(){
    super()
  }

  render(){
    return (
      <div>
        <h3>首页</h3>
        <div>ID：{this.props.serverConfig.id}</div>
        <div>名称：{this.props.serverConfig.username}</div>
        <div>手机：{this.props.serverConfig.mobile}</div>
        <div>邮箱：{this.props.serverConfig.email}</div>
        <div>居住地：{this.props.serverConfig.county}</div>
      </div>
    )
  }
}


export default Home
