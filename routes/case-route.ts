import Koa from 'koa';
import Router from 'koa-router';
import Case from '../src/case-service';

const router = new Router();

router.prefix('/case')

router.get('/', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  let case_list= Case.getlist();
  console.log(case_list);
  await ctx.render('case-management', {case_list:case_list})
})
export default router;
