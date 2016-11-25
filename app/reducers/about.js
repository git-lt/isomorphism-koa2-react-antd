import { GET_ABOUT_FAILED, GET_ABOUT_SUCCEED, GET_ABOUT_REQUEST } from '../actions/news'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ABOUT_REQUEST:
      return { ...state }
    case GET_ABOUT_SUCCEED:
      const _data = {
        news: action.data.result,
        loaded: true
      }
      return { ...state, ..._data}
    case GET_ABOUT_FAILED:
      return { ...state, loaded: false}
    default:
      return state
  }
}
