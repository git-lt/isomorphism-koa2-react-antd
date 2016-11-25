/**
 * 返回配置信息
 */
import fs from 'fs'
import lodash, { isPlainObject, defaultsDeep } from 'lodash'
import defaultConfig from './default'
const debug = require('debug')('config')

const cfgs = []
fs.readdirSync(__dirname).map(filename => {
  if (['index.js', 'default.js'].indexOf(filename) > -1 || filename[0] === '.') {
    return false
  }
  try {
    const cfg = require('./' + filename)
    if (isPlainObject(cfg)) {
      cfgs.push(cfg)
    }
  } catch (e) {}
})
cfgs.push(defaultConfig)
const config = defaultsDeep.apply(lodash, cfgs)

//用于调试日志记录
debug(config)
export default config
