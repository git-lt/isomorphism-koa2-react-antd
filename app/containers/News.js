import React, {Component} from 'react'
import { Button } from 'antd';
import { connect } from 'react-redux'
import { Pagination, Select, Alert} from 'antd'
import { fetchNews } from '../actions/news'

@connect(
  state => state.news,
)

class News extends Component{
  static fetch (state, dispatch) {
   const fetchTasks = []
   fetchTasks.push(
     dispatch(fetchNews(state))
   )
   return fetchTasks
 }

 componentDidMount () {
   const { loaded} = this.props
   if ( !loaded ) {
     this.constructor.fetch(this.props, this.props.dispatch)
   }
 }

 getNextPage(){
   this.constructor.fetch(this.props, this.props.dispatch);
 }

  render(){
    const { list=[], count=0, loaded } = this.props;

    const newsList = list.map((v, i)=>{
      return (
        <div key={i} style={{overflow:"hidden"}}>
          <img src={v.thumb} width="80" className="news-con-img" />
          <div className="news-con-txt">
            <h3 className="news-con-tit">{v.title}</h3>
            <p className="news-con-sum">{v.summary}</p>
            <br/>
          </div>
        </div>
      )
    })

    return (
      <div style={{ background: '#F9F9F9', padding: '30px' }}>
        <Alert message="强制刷新这个页面，数据从服务端渲染加载，点击下面的分页，数据异步加载" type="info" closeText="关闭" />
        <div>
        { newsList }
        </div>
        <div style={{textAlign: "center", padding: "40px 0 0"}}>
          <Pagination
            selectComponentClass={Select}
            total={count}
            onChange={ this.getNextPage.bind(this)}
            showTotal={total => `共 ${total} 篇`}
            pageSize={10} defaultCurrent={1}
          />
        </div>
     </div>
    )
  }
}

export default News
