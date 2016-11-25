import React, { Component } from 'react'
import {connect} from 'react-redux'
import { fetchServerStateIfNeeded } from '../actions/serverState'

@connect(
  state => state.server,
)

class Home extends Component{
  constructor(){
    super()
  }
  static fetch (state, dispatch) {
   const fetchTasks = []
   fetchTasks.push(
     dispatch(fetchServerStateIfNeeded(state))
   )
   return fetchTasks
  }

  componentDidMount () {
    const { loaded} = this.props
    if ( !loaded ) {
      this.constructor.fetch(this.props, this.props.dispatch)
    }
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
