import React from 'react'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'
import './index.less'
import { Link } from 'react-router'

const SubMenu = Menu.SubMenu;

export default class Header extends React.Component {
  constructor () {
    super()
  }
  render () {
    // const {user} = this.props
    return (
      <div className='ant-layout-header'>
        <Menu className="header-menu" mode="horizontal">
          <SubMenu>
            <Menu.Item key="setting:1">选项1</Menu.Item>
            <Menu.Item key="setting:2">选项2</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="setting:3">注销</Menu.Item>
          </SubMenu>
          <Menu.Item key="mail">
            <Icon type="question" />帮助
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}
