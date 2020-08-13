import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx: any, next: any) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx: any, next:any) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx: any, next: any) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

export default router;
