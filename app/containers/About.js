import React, { Component } from 'react'
import { Rate } from 'antd'

class About extends Component{
  constructor(){
    super();
    this.state={
      value: 3,
      count: null,
    }
  }
  handleChange(value) {
    this.setState({ value });
  }
  render(){
    const { value } = this.state;
    return (
      <span>
        <Rate onChange={this.handleChange} value={value} />
        {value && <span className="ant-rate-text">{value} stars</span>}
      </span>
    )
  }
}

export default About
