import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import './index.less'


class NavPath extends React.Component {
  constructor (props) {
    super(props)
  }

  createClumbs = (current, open)=>{
    if(current.key){
      let child = [];

      current.child && current.child.forEach(v=>{
        if(v.key === open){
          return child.push( <Breadcrumb.Item key={'bc-'+v.key}>{v.name}</Breadcrumb.Item>)
        }
      })

      return (
        <span>
          <Breadcrumb.Item key={'bc-'+current.key}>{current.name}</Breadcrumb.Item>
          {child}
        </span>
      )
    }else{
      return [];
    }
  }

  render () {
    const { current, open } = this.props.menu

    return (
      <div className="ant-layout-breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item key='bc-0'>首页</Breadcrumb.Item>
          {this.createClumbs(current, open)}
        </Breadcrumb>
      </div>
    )
  }
}

export default NavPath
