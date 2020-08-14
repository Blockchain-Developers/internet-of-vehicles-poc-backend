import Router from 'koa-router';

const router = new Router();

router.prefix('/file')

router.get('/', async (ctx: any, next: any) => {
  await ctx.render('file-management')
})
export default router;
