import Koa from 'koa';
const app = new Koa()
import views from 'koa-views';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import index from './routes/index';
import fileRoute from './routes/file-route';
import caseRoute from './routes/case-route';

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx:any, next:any) => {
  const start:any = new Date()
  await next()
  const last:any = new Date()
  const ms:any = last - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes())
app.use(fileRoute.routes());
app.use(caseRoute.routes());

// error-handling
app.on('error', (err:any, ctx:any) => {
  console.error('server error', err, ctx)
});

module.exports = app
