import Koa from "koa";
import Router from "koa-router";
import Case from "../src/case-service";

const router = new Router();

router.prefix("/case");

router.use("/",async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  //console.log("test");
  await next()
});

interface caseListGetParams {
  privateFor: string;
  search: string;
}
router.get("/", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  let queryData: caseListGetParams = ctx.request.query;
  if (!Case.checkList(queryData.privateFor)) {
    queryData.privateFor = "";
  }
  if (!queryData.search) {
    queryData.search = "";
  }

  let case_list = Case.getList(queryData.privateFor, queryData.search);
  await ctx.render("case-management", {
    case_list: case_list,
    privateFor: queryData.privateFor,
    search: queryData.search,
    orgList: Case.orgList.slice(1, Case.orgList.length),
  });
});

router.get("/create", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render("create-case", {
    orgList: Case.orgList.slice(1, Case.orgList.length),
  });
});

interface caseCreatePostParams {
  name: string;
  privateFor: string;
  description: string;
}
router.post(
  "/create",
  async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    const bodyData: caseCreatePostParams = ctx.request.body;
    if (!Case.checkList(bodyData.privateFor)) {
      bodyData.privateFor = "";
    }
    Case.createCase(bodyData);
    ctx.redirect('/case')
  }
);
export default router;
