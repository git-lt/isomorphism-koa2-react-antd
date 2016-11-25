import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu

import './index.less'


class Sidebar extends React.Component {

  constructor (props) {
      super(props);
      this.state={
        current: '5',
      }
  }

  handleClick (e) {
    let key = e.key;
    if(key.indexOf('sub') > -1) return;
    this.props.updateNavPath(e.item.props.path);
  }

  render () {
    return (
      <aside className="ant-layout-sider">
        <div className="ant-layout-logo">
          <img src="//static.qiakr.com/logo_512x512.png?imageView2/1/w/160/h/160" width="80" />
        </div>
      </aside>
      <Menu
        mode="inline" theme="dark" selectedKeys={[current]}
      >
        <Menu.Item>菜单项</Menu.Item>
        <SubMenu title="子菜单">
          <Menu.Item>子菜单项</Menu.Item>
        </SubMenu>

      </Menu>
    )
  }
}


export default Sidebar
