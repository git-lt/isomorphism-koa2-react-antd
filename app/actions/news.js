import fetch from 'isomorphic-fetch'

export const GET_NEWS_REQUEST = 'GET_NEWS_REQUEST'
export const GET_NEWS_SUCCEED = 'GET_NEWS_SUCCEED'
export const GET_NEWS_FAILED = 'GET_NEWS_FAILED'

const fetchStateUrl = __SERVER__
  ? `http://localhost:${require('../../platforms/common/config').port}/api/news`
  : '/api/news'

export function fetchNews(state){
  return (dispatch) => {
    dispatch(newsRequest())
    return fetch(fetchStateUrl)
      .then(res => res.json())
      .then(data => {
        dispatch(newsSucceed(data))
      })
      .catch(e => dispatch(newsFailed(e)))
  }
}

export function newsRequest () {
  return {
    type: GET_NEWS_REQUEST
  }
}
export function newsSucceed (data) {
  return {
    type: GET_NEWS_SUCCEED,
    data: data
  }
}
export function newsFailed (error) {
  console.log('server state get failed', error)
  return {
    type: GET_NEWS_FAILED,
    error
  }
}
