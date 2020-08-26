import Koa from "koa";
import Router from "koa-router";
import Case from "../src/case-service";

const router = new Router();

router.prefix("/case");

router.use("/",async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  //console.log("test");
  await next()
});


router.get("/", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  let data = await Case.getList(ctx.query);
  await ctx.render("case-management", {
    case_list: data.case_list,
    privateFor: data.privateFor,
    search: data.search,
    orgList: Case.orgList.slice(1, Case.orgList.length),
  });
});

router.get("/create", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render("create-case", {
    orgList: Case.orgList.slice(1, Case.orgList.length),
  });
});

router.post(
  "/create",
  async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    Case.createCase(ctx.request.body);
    ctx.redirect('/case')
  }
);
export default router;
