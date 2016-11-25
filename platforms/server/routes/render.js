// 从 React-router 中获取 match方法
// match 方法将拿到的 request url 匹配到定义的 routes，解析成和客户端一致的 props 对象传递给组件。
import { match } from 'react-router'
import renderCtrl from '../controllers/serverRenderCtrl'

function _match(location){
  return new Promise((resolve, reject)=>{
    match(location, (error, redirectLocation,renderProps)=>{
      if(error){
        return reject(error);
      }
      resolve({redirectLocation, renderProps})
    })
  })
}

export default async (ctx, next) => {
  try{
    //Server端路由与前端路由共用 **页面路由** ../../../app/routes
    const { redirectLocation, renderProps } = await _match({ routes: require('../../../app/routes'), location: ctx.url })
    //重定向
    if(redirectLocation){
      ctx.redirect(redirectLocation.pathname + redirectLocation.search)
    }else if(renderProps){
      //调用页面渲染控制器，开始服务端渲染
      await renderCtrl(ctx, next, renderProps)
    }else{
      await next()
    }
  }catch(e){
    console.error('Server-Render Error Occurs: %s', e.stack)
    await ctx.render('500', {
      msg: ctx.app.env === 'development' ? e.message : false
    })
  }
}
