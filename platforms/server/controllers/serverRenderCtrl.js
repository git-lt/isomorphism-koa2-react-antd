/**
 * Server 端的路由控制
 */
import React from 'react'
import { RouterContext } from 'react-router'
// 导入服务端渲染的方法 renderToString
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import config from '../../common/config'
// 和浏览器端共用应用的状态数据
import configureStore from '../../../app/store/configureStore'
const store = configureStore()

//renderProps：从路由组件中获取的路由与组件的信息
export default async (ctx, next, renderProps) => {
  const route = renderProps.routes[renderProps.routes.length - 1]
  let prefetchTasks = []

  // 遍历路由中注册的组件，创建加载数据请求，至数组中
  for (let component of renderProps.components) {
    if (component && component.WrappedComponent && component.WrappedComponent.fetch) {
      const _tasks = component.WrappedComponent.fetch(store.getState(), store.dispatch)
      if (Array.isArray(_tasks)) {
        prefetchTasks = prefetchTasks.concat(_tasks)
      } else if (_tasks.then) {
        prefetchTasks.push(_tasks)
      }
    }
  }

  //当所有组件的数据加载完成后，
  await Promise.all(prefetchTasks)
  // 渲染组件
  await ctx.render('index', {
    title: config.title,
    dev: ctx.app.env === 'development',
    //将state输出到页面，用于浏览器端redux初始化state
    reduxData: store.getState(),
    // render之后生成的HTML字符串在app这个对象中，通过ejs渲染至view中，最后输出
    app: renderToString(<Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>)
  })
}
