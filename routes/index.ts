import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

export default router;
