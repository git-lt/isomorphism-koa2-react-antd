export default async (ctx, next) => {
  ctx.body = require('../mock').about()
}
