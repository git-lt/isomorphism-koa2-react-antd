import fetch from 'isomorphic-fetch'

export const GET_ABOUT_REQUEST = 'GET_ABOUT_REQUEST'
export const GET_ABOUT_SUCCEED = 'GET_ABOUT_SUCCEED'
export const GET_ABOUT_FAILED = 'GET_ABOUT_FAILED'

const fetchStateUrl = __SERVER__
  ? `http://localhost:${require('../../platforms/common/config').port}/api/about`
  : '/api/about'

  export function fetchAbout(state){
    return (dispatch) => {
      dispatch(newsRequest())
      return fetch(fetchStateUrl)
        .then(res => res.json())
        .then(data => {
          console.log('===>about')
          console.log(data)
          dispatch(newsSucceed(data))
        })
        .catch(e => dispatch(newsFailed(e)))
    }
  }

  export function aboutRequest () {
    return {
      type: GET_ABOUT_REQUEST
    }
  }
  export function aboutSucceed (data) {
    return {
      type: GET_ABOUT_SUCCEED,
      data: data
    }
  }
  export function aboutFailed (error) {
    console.log('server state get failed', error)
    return {
      type: GET_ABOUT_FAILED,
      error
    }
  }
