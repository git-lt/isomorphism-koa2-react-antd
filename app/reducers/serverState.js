import { SERVER_STATE_FAILED, SERVER_STATE_SUCCEED, SERVER_STATE_REQUEST } from '../actions/serverState'

export default (state = {}, action) => {
  switch (action.type) {
    case SERVER_STATE_REQUEST:
      return { ...state }
    case SERVER_STATE_SUCCEED:
      console.log(action.data)
      const _data = {
        serverConfig: action.data.result,
        loaded: true
      }
      return { ...state, ..._data}
    case SERVER_STATE_FAILED:
      return { ...state, loaded: false}
    default:
      return state
  }
}
