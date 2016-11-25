# Koa2 + React + Redux + antd 同构直出探索


## 由来
在出现同构之前，我们使用后端的模板渲染引擎，C#的Razor，java的Velocity， nodejs的ejs，jade等，来渲染页面，输出到浏览器，浏览器异步请求数据，再使用各种渲染引擎来渲染数据至模板，
那么如果有样一个使用场景，加载一个列表数据：

- 两端使用不同模板引擎渲染
 如果需要服务端首屏加载时服务端渲染，异步加载时浏览器渲染，那么就需要写两套模板代码，同时维护两套模板处理逻辑

- 纯前端渲染
1. 不可避免出现白屏，等待异步加载，体验变差
2. SEO优化问题，没有服务端渲染，蜘蛛抓取不到数据，无SEO可言

所以服务端渲染是不可或缺的一个环节，如何优化，只要我们前后端使用同一份业务逻辑，共一个技术框架，同一套模板，同一套路由处理逻辑，就能达到我们想要的效果。

## ReactJS的生命周期

在了解之前，先来重温一下ReactJS的生命周期

ReactJS的生命周期可以分为三个阶段来看：实例化、存在期、销毁期

### 实例化
首次实例化
- getDefaultProps
- getInitialState
- componentWillMount
- render
- componentDidMount
实例化之后更新，这一过程和上面一样，但没有getDefaultProps这个过程
简单记忆：props => state => mount => render => mounted

### 存在期
组件已经存在，状态发生改变时
- componetWillReceiveProps
- shouldComponentUpdate
- ComponentWillUpdate
- render
- componentDidUpdate

简单记忆：receiveProps => shouldUpdate => update => render => updated

### 销毁期
componentWillUnmount

生命周期中10个API的作用说明
1. getDefaultProps
作用于组件类，**只调用一次**，返回对象用于设置默认的props，对于引用值，会在实例中共享

2. getInitialState
作用于组件实例，在实例创建时调用一次，用于初始化每个实例的state，此时**可以访问this.props**

3. componentWillMount
在完成首次渲染之前调用，此时**可以修改组件的state**

4. render
必选方法，创建虚拟DOM，该方法具有特殊规则：
- 只能通过this.props 和this.state访问数据
- 可以返回null、false或任何React组件
- 只能出现一个顶级组件，数组不可以
- 不能改变组件的状态
- 不能修改DOM

5. componentDidMount
真实的DOM被渲染出来后调用，可以在此方法中通过 this.getDOMNode()访问真实的DOM元素。此时可以使用其它类库操作DOM。**服务端不会被调用**

6. componetWillReceiveProps
组件在接收到新的props时调用，并将其作为参数nextProps使用，此时**可以更改组件的props及state**

7. shouldComponentUpdate
组件是否应当渲染新的props或state，返回false表示跳过后续的生命周期方法，通常不需要使用以避免出现bug。在出现应用性能瓶颈时，是一个可以优化的点。

8. componetWillUpdate
接收新props或state后，进行渲染之前调用，**此时不允许更新props或state**

9. componetDidUpdate
完成渲染新的props或state之后调用 ，此时**可以访问DOM元素**。

10. componetWillUnmount
组件被移除之前调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器。

```javascript
var React = require("react");
var ReactDOM = require("react-dom");

var NewView = React.createClass({
    //1.创建阶段
    getDefaultProps:function() {
        console.log("getDefaultProps");
        return {};
    },

    //2.实例化阶段
    getInitialState:function() {
        console.log("getInitialState");
        return {
            num:1
        };
    },

    //render之前调用，业务逻辑都应该放在这里，如对state的操作等
    componentWillMount:function() {
        console.log("componentWillMount");
    },

    //渲染并返回一个虚拟DOM
    render:function() {
        console.log("render");
        return(
            <div>
            hello <strong> {this.props.name} </strong>
            </div>
            );
    },

    //该方法发生在render方法之后。在该方法中，ReactJS会使用render生成返回的虚拟DOM对象来创建真实的DOM结构
    componentDidMount:function() {
        console.log("componentDidMount");
    },

    //3.更新阶段
    componentWillReceiveProps:function() {
        console.log("componentWillReceiveProps");
    },

    //是否需要更新
    shouldComponentUpdate:function() {
        console.log("shouldComponentUpdate");
        return true;
    },

    //将要更新 不可以在该方法中更新state和props
    componentWillUpdate:function() {
        console.log("componentWillUpdate");
    },

    //更新完毕
    componentDidUpdate:function() {
        console.log("componentDidUpdate");
    },

    //4.销毁阶段
    componentWillUnmount:function() {
        console.log("componentWillUnmount");
    },

    // 处理点击事件
    handleAddNumber:function() {
        this.setProps({name:"newName"});
    }
});
ReactDOM.render(<NewView name="ReactJS"></NewView>, document.body);
```

![](http://static.codeceo.com/images/2016/03/ajs-life.png)

** 因为服务端渲染，不存在挂载组件，所以挂载以后的生命周期将不会在服务端渲染时触发， 所以在做服务端组件状态或数据初始化时，要做特殊处理，后面会讲到 **


## Redux的基本概念

Redux 提供了一套类似 Flux 的单向数据流，整个应用只维护一个 Store，以及面向函数式的特性让它对服务器端渲染支持很友好。

关于 Store：

- 整个应用只有一个唯一的 Store
- Store 对应的状态树（State），由调用一个 reducer 函数（root reducer）生成
- 状态树上的每个字段都可以进一步由不同的 `reducer` 函数生成
- Store 包含了几个方法比如 `dispatch, getState` 来处理数据流
- Store 的状态树只能由 `dispatch(action)` 来触发更改

Redux 的数据流：

- action 是一个包含 `{ type, payload }` 的对象
- reducer 函数通过 `store.dispatch(action)` 触发
- reducer 函数接受 `(state, action)` 两个参数，返回一个新的 `state`
- reducer 函数判断 `action.type` 然后处理对应的 `action.payload` 数据来更新状态树


## 同构的应用场景

## 关键API

ReactJS官网提供了两个API用于服务端渲染，使其服务端渲染成为可能：

`React.renderToString` 是把 React 元素转成一个 HTML 字符串，因为服务端渲染已经标识了 reactid，所以在浏览器端再次渲染，React 只是做事件绑定，而不会将所有的 DOM 树重新渲染，这样能带来高性能的页面首次加载！同构黑魔法主要从这个 API 而来。

`React.renderToStaticMarkup`，这个 API 相当于一个简化版的 renderToString，如果你的应用基本上是静态文本，建议用这个方法，少了一大批的 reactid，DOM 树自然精简了，在 IO 流传输上节省一部分流量。

配合 `renderToString`  和 `renderToStaticMarkup` 使用，`createElement` 返回的 ReactElement 作为参数传递给前面两个方法。


## 关键要点

- 数据状态如何共享
- 路由状态何同步
- 组件如何共用

## 组件共用

### 原理
对于整个应用来说，一个 Store 就对应一个 UI 快照，服务器端渲染就简化成了在服务器端初始化 Store，将 Store 传入应用的根组件，针对根组件调用 `renderToString` 就将整个应用输出成包含了初始化数据的 HTML，服务端在输出的时候将 `state` 注入到页面的全局属性中，客户端 `render` 时拿到 `state`，同步初始化状态，检验服务端生成的HTML结构，接管页面的渲染工作。


## 路由同步

### 场景
- 在用户第一次访问页面时，由服务端路由处理，输出相关页面内容
- 客户端用户点击链接跳转，由客户端路由处理，渲染相关组件并展示
- 用户在前端跳转后刷新页面，此时被服务端路由截获，并由服务端处理渲染并返回页面内容

共用路由 `/app/router.js` 放在client端，server端也共用这一个文件

```javascript
export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="news" component={News} />
      <Route path="about" component={About} />
    </Route>
  </Router>
)
```

### Web页面请求

#### Server端页面请求

使用 `react-router` 的 `match` 方法，拿到的页面请求地址匹配到定义的 `routes`，解析成和客户端一致的 `props 对象` 传递给组件。

React-router官网文档有前后端共用路由的相关介绍[ServerRendering - React-router](https://github.com/ReactTraining/react-router/blob/master/docs/guides/ServerRendering.md)

```javascript
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
```

`renderCtrl` 负责服务端处理数据并渲染页面输出到浏览器端，这里调用了`react` 服务端渲染的核心方法 `renderToString()`

`server/controller/renderCtrl.js`
```javascript
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
```

#### Client端页面请求

浏览器端，从服务端注入到全局对象中获取redux需要的应用状态state，初始化state
导入路由共用的配置模块，初始化路由
调用 `ReactDOM.render()` 方法来渲染页面

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import routes from '../../app/routes'
import { Provider } from 'react-redux'

// 和服务端共用的redux状态管理
import configureStore from '../../app/store/configureStore'

// 页面加载时，从全局对象中获取服务端注入到页面的State数据
const store = configureStore(window.__REDUX_STATE__)

// 浏览器端使用 ReactDOM.render 初始化页面，首屏渲染
ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.querySelector('.react-container')
)
```

## 数据请求共用

### Server端api请求

Server端由于渲染组件时，不会执行到 `componentWillMount` 方法(因为不存在挂载操作)，那么就要手动去处理数据状态的初始化工作，方法是给组件添加一个静态方法 `fetch()`，服务端在 `renderCtrl` 中渲染之前，先加载完数据，初始化state，再将state注入到页面，渲染至浏览器端

渲染部分的代码上面已经展示了，下面来看看给组件添加的静态方法 `fetch()`

```javascript
import { fetchNews } from '../actions/news'

@connect( state => state.news )

class News extends Component{
//这里声明一个数据，为的是可以获取多个接口的数据，接口请求是异步请求，返回之后，render之前调用 Promise.all() 保证所有异步请求完成后，再渲染页面
  static fetch (state, dispatch) {
   const fetchTasks = []
   fetchTasks.push(
     dispatch(fetchNews(state))
   )
   return fetchTasks
 }
  render(){}
}
```

### Client端api请求

当页面从服务端返回后，那么浏览器端就接管了页面的控制，比如点击下一页这个功能，数据请求就是`ajax` 异步请求服务端，服务端返回 `json` 数据，那么这里，只需要调用组件的静态方法 `fetch()`，获取数据即可。

```javascript
class News extends Component{
 static fetch (state, dispatch) {
   const fetchTasks = []
   fetchTasks.push(
     dispatch(fetchNews(state))
   )
   return fetchTasks
 }
 getNextPage(){
	//调用组件的静态方法异步获取数据
   this.constructor.fetch(this.props, this.props.dispatch);
 }
 render(){
	<div style={{ background: '#ECECEC', padding: '30px' }}>
        <Button type="primary" loading={!loaded} onClick={this.getNextPage.bind(this)}>
         下一页
       </Button>
        <div>
        { newsList }
        </div>
     </div>
	}
}
```

api请求最终都是调用redux 中的 `actions` 去做异步请求处理，那么在action中，可以使用 `isomorphic-fetch` 去做请求去差异化，服务端使用http.request方法需要完整路径，客户端使用ajax，使用相对路径，具体如下
```javascript
const fetchStateUrl = __SERVER__
  ? `http://localhost:${require('../../platforms/common/config').port}/api/news`
  : '/api/news'

export function fetchNews(state){
  return (dispatch) => {
    dispatch(newsRequest())
    return fetch(fetchStateUrl)
      .then(res => res.json())
      .then(data => {
        console.log('===>news')
        console.log(data)
        dispatch(newsSucceed(data))
      })
      .catch(e => dispatch(newsFailed(e)))
  }
}
```
这里的 `__SERVER__` 是webpack中配置的全局变量
```
new webpack.DefinePlugin({
  __SERVER__: true
})
```


## 应用状态同步

状态同步主要使用redux去同步，服务端渲染时，生成一个 state，在返回页面时，将这个state注入页面，浏览器端拿到state，接管页面状态的管理。

服务器端在 `render` 中，先获取数据，初始化state，注入页面
```javascript
ctx.render('index', {
   title: config.title,
   dev: ctx.app.env === 'development',
   //将state输出到页面，用于浏览器端redux初始化state
   reduxData: store.getState(),
   app: renderToString(<Provider store={store}>
     <RouterContext {...renderProps} />
   </Provider>)
 })
```

`server/views/index.ejs`

```javascript
<body>
    <section role="main" class="react-container">
      <div><%- app %></div>
    </section>
    <script>
      try {
        //通过render，将应用的state由ejs注入到全局对象__REDUX_STATE__中，用于redux的state初始化
        window.__REDUX_STATE__ = <%- JSON.stringify(reduxData) %>;
      } catch (e) {
        console.warn('error in getting server redux data');
      }
    </script>
    <script src="/build/common.js"></script>
    <script src="/build/main.js"></script>
  </body>
```

浏览器端从全局对象中获取并初始化redux

```javascript
//这里获取服务端注入的state
const store = configureStore(window.__REDUX_STATE__)
ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.querySelector('.react-container')
)
```

## 构建与打包

这个项目框架是参考 @wssgcg1213 的 [koa2-react-isomorphic-boilerplate](https://github.com/wssgcg1213/koa2-react-isomorphic-boilerplate)，他在构建与打包这方便做出了很多的工作，更多细节可查看他的文档和源码。

这里有几个点要处理，服务端的打包和客户端的打包，服务端打包
`target` 要配置为 `node`,  `libraryTarget` 要配置为 `commonjs2`，产生node端运行的代码

```javascript
output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    publicPath: '/build/',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  node: {
    fs: 'empty',
    __dirname: true,
    __filename: true
  },
  externals: [
    function (context, request, callback) {
      var pathStart = request.split('/')[0]
      if (pathStart && (pathStart[0] === '!') || nodeModules.indexOf(pathStart) >= 0 && request !== 'webpack/hot/signal.js') {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    }
  ],
```

另外react 的 component 中充满了 `import './component.less', import img from './img.png'` 这样的语法, 但在 node 中是会报错的，@wssgcg1213 使用了`babel-plugin-transform-require-ignore` 来忽略 css/less , 转而在 webpack-dev-middleware 中使用 `style-loader` 打包成 js bundle 输出, 这样也能同时支持 hot module replacement; 对于图片使用 `asset-require-hook` 这个包来使 require 直接返回文件路径.


## 模板和UI框架

这个Demo里使用了ejs做为koa的模板引擎，这样可以为一些非SPA页面提供公用的片段，Header或Footer

引入了 `antd` 做为UI框架，这里不得不提 [ant.design](https://ant.design/) 这个框架做的真是太好了，为管理界面的开发提升了很大开发的效率，组件设计美观，api合理，真正实现了一切UI皆组件的思想。

这里引入 antd 有个优化点，使用 [babel-plugin-antd](http://npm.taobao.org/package/babel-plugin-antd) 插件，可以按需加载组件资源，不用全部引入，安装这个组件之后，还要在 `.babelrc` 中配置一下

```javascript
{
  "plugins": [["antd", {
     "libraryDirectory": "lib",
     "libraryName": "antd"
   }]]
}

import { Button } from 'antd';
=>
var _button = require('antd/lib/button');
```

另外在项目中使用到了用 `@` [修饰器](http://es6.ruanyifeng.com/#docs/decorator)的方式将redux的state注入到类的props中，因为这是ES7的一个提案，这里需要安装另一个插件 `babel-plugin-transform-decorators-legacy` 配合使用，同样要在 `.babelrc` 中配置一下
```
{
  "plugins": ["transform-decorators-legacy"]
}

import {connect} from 'react-redux';

//在组件中使用
@connect(
  state => state.server,
)
class News extends Component{}
```


## 总结
花了两天的时间，重温了一下react，实践了一下koa2+react+redux+antd的同构方式，总体感觉下来，要处理问题还是很多的，可能是自己对webpack还不是很熟悉，在开发环境和build环境的配置中，webpack改动还是很大的，幸好有开源的框架可以参考，一步步走来，还算顺利，但想想同构真的有必要吗？

如果是2B的业务，其实应该没有同构的必要吧，增加了开发的复杂性，前后端也不能很好的分工合作，而且用户体验也没有那么高的需求。
所以适合2C的移动端项目，对体验要求很高，需要用到服务端优化加载和渲染的项目是合适同构的
另外，服务端渲染还要做缓存的，虽然我没有做性能测试，不过从QQ音乐的实践和测试来看，服务端不做缓存，在大并发下，还是有很大的性能瓶颈的。
最好的方式是像Vue的同构方案一样，建立缓存，并可以stream输出，这样就完美了。


## 项目源码
[]()

参考阅读
[koa2-react-isomorphic-boilerplate](https://github.com/wssgcg1213/koa2-react-isomorphic-boilerplate)
[玩转 React 服务器端渲染](https://blog.coding.net/blog/React-server-rendering)
[ReactJS 服务端同构实践【QQ音乐web团队】](http://chuansong.me/n/331913437152)
[React+Redux 同构应用开发](http://www.aliued.com/?p=3077)
