import { mock } from 'mockjs'

export function appConfig(){
  return {
    code: 200,
    msg: 'ok',
    result:mock({
      "id|+1":100,
      "username":'@cname',
      "email":'@email',
      "mobile|13800000000-13999999999":13800004500,
      "gmtCreate": 1455614704000,
      "gmtUpdate": 1462593500000,
      "avator":"@image(100x100)",
      "county":"@county(true)"
    })
  }
}

export function news(){
  return {
    code: 200,
    msg: 'ok',
    result: mock({
      "count": 128,
      "list|10": [{
          "id|+1": 1,
          "title": "@ctitle(8, 18)",
          "thumb": "http://placeimg.com/100/100?"+"@natural()",
          "summary": "@cparagraph(3, 7)",
          "gmtCreate": 1449139208000,
          "gmtUpdate": 1449139208000,
          "operator": 3,
          "text": "@cparagraph(3, 10)",
          "pv|0-88": 6,
          "status": 0,
          "tag|1": ['', 0, 1, 2]
      }]
    })
  }
}

export function about(){
  return {
    code: 200,
    msg:'ok',
    result: mock({
        about: "@cparagraph(3, 10)",
    })
  }
}
