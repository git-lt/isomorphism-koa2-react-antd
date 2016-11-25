
/**
 * [Server端 路由请求处理]
 */
export default async (ctx, next)=>{
  //如果是异步接口请求，直接返回json数据
  if(ctx.path.match(/^\/api/)){
    return await require('./api').routes()(ctx, next)
  }
  //如果页面请求，则调用最终调用ServerRenderCtrl在服务端渲染处理输出
  await require('./render')(ctx, next);
}
