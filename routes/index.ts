import Koa from 'koa';
import Router from 'koa-router';
import fabricService from "../src/fabric-service";

const router = new Router();

router.get('/', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render('index', {
    title: 'IoV PoC',
    mspid: fabricService.mspid,
  })
})

export default router;
