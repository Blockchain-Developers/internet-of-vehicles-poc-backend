import Router from 'koa-router';

const router = new Router();

router.prefix('/users')

router.get('/', async (ctx:any, next:any) => {
  ctx.body = 'this is a users response!'
})

router.get('/bar', async (ctx:any, next:any) => {
  ctx.body = 'this is a users/bar response'
})

export default router;
