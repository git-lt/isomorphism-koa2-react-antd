import React, {Component} from 'react'
import { Button } from 'antd';
import { connect } from 'react-redux'
import { fetchNews } from '../actions/news'

@connect(
  state => state.news,
)

class News extends Component{
  static fetch (state, dispatch) {
    console.log(state);
   const fetchTasks = []
   fetchTasks.push(
     dispatch(fetchNews(state))
   )
   return fetchTasks
 }

 getNextPage(){
   console.log(this.props)
   this.constructor.fetch(this.props, this.props.dispatch);
 }
  render(){
    const { list, count, loaded } = this.props;

    const newsList = list.map((v, i)=>{
      return (
        <div key={i}>
          <h3>{v.title}</h3>
          <p>{v.summary}</p>
          <br/>
        </div>
      )
    })

    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Button type="primary" loading={!loaded} onClick={this.getNextPage.bind(this)}>
         下一页
       </Button>
        <div>
        { newsList }
        </div>
     </div>
    )
  }
}

export default News
