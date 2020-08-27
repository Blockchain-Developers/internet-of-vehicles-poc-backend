import Koa from "koa";
import Router from "koa-router";
import File from "../src/file-service";

const router = new Router();

router.prefix("/file");

router.get("/list", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const data = await File.getList(ctx.query);
  await ctx.render("file-management", {
    file_list: data.file_list,
    caseId: data.caseId,
    search: data.search,
  });
});

router.post("/new", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const filecontent: string = ctx.request.body;
  File.newFile(ctx.query, filecontent);
  ctx.status = 200;
});

router.get("/delete", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await File.deleteFile(ctx.query);
  ctx.status = 200;
});

router.get("/view", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const data = await File.viewFile(ctx.query);
  ctx.status = 200;
  ctx.body = data;
});

export default router;
