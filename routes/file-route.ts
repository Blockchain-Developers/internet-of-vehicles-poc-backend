import Koa from "koa";
import Router from "koa-router";
import File from "../src/file-service";

const router = new Router();

router.prefix("/file");

router.get("/list", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const data = await File.getList(ctx.query);
  await ctx.render("file-management", {
    file_list: data.file_list,
    caseid: data.caseid,
    search: data.search,
  });
});

router.post("/new", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const filecontent: string = ctx.request.body;
  File.newFile(filecontent);
  ctx.status = 200;
});

router.get("/delete", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const fileid: string = ctx.query.fileid;
  await File.deleteFile(fileid);
  ctx.redirect("back");
});

export default router;
