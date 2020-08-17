import Koa from "koa";
import Router from "koa-router";
import Case from "../src/case-service";

const router = new Router();

router.prefix("/case");

router.get("/", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  let privateFor = ctx.query.privateFor;
  let searchparam = ctx.query.search;

  if (!Case.checkList(privateFor)) {
    privateFor = "";
  }
  if (!searchparam) {
    searchparam = "";
  }

  let case_list = Case.getList(privateFor, searchparam);
  await ctx.render("case-management", {
    case_list: case_list,
    privateFor: privateFor,
    orgList: Case.orgList.slice(1, Case.orgList.length),
    searchparam: searchparam,
  });
});
router.get("/create", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render("create-case");
});
export default router;
