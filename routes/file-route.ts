import Koa from 'koa';
import Router from 'koa-router';
import File from '../src/file-service';

const router = new Router();

router.prefix('/file')

router.get('/', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render('file-management')
})
export default router;
