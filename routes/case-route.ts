import Router from 'koa-router';

const router = new Router();

router.prefix('/case')

router.get('/', async (ctx: any, next: any) => {
  await ctx.render('case-management')
})
export default router;
