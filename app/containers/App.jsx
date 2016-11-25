import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Menu, Breadcrumb } from 'antd';
// import Header from '../components/Header'
// import Footer from '../components/Footer'
// import Sidebar from '../components/Sidebar'
import { fetchServerStateIfNeeded } from '../actions/serverState'
import 'antd/dist/antd.css'
import '../common/layout.less'

class App extends Component {
  static fetch (state, dispatch) {
    console.log(state);
   const fetchTasks = []
   fetchTasks.push(
     dispatch(fetchServerStateIfNeeded(state))
   )
   return fetchTasks
  }
  
  render () {
    return (
      <div>
        <div className="ant-layout-top">
          <div className="ant-layout-header">
            <div className="ant-layout-wrapper">
              <div className="ant-layout-logo"><img src="//7xi480.com1.z0.glb.clouddn.com/avatar100.jpg" width="50" /></div>
              <Menu theme="dark" mode="horizontal"
                defaultSelectedKeys={['2']} style={{lineHeight: '64px'}}>
                <Menu.Item key="1"><Link to="/" >Home</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/news" >News</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/about" >About</Link></Menu.Item>
              </Menu>
            </div>
          </div>
          <div className="ant-layout-wrapper">
            <div className="ant-layout-container">
              <div style={{ height: 900 }}>
                {this.props.children }
              </div>
            </div>
          </div>
          <div className="ant-layout-footer">
          Ant Design 版权所有 © 2015 由蚂蚁金服体验技术部支持
          </div>
        </div>
      </div>
    )
  }

}

export default connect(state => {
  console.log(state)
  return state.server
})(App)
