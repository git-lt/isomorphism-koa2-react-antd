/**
 *
 */
import { combineReducers } from 'redux'
import counter from './counter'
import server from './serverState'
import news from './news'
import about from './about'

export default combineReducers({
  counter,
  server,
  news,
  about
})
