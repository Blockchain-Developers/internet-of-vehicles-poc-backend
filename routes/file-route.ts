import Koa from "koa";
import Router from "koa-router";
import File from "../src/file-service";

const router = new Router();

router.prefix("/file");

router.get("/list", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const caseid: string = ctx.query.caseid;
  const file_list = File.getList(caseid);
  console.log(caseid);
  await ctx.render("file-management", { file_list: file_list });
});

router.post("/new", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const filecontent = ctx.request.body;
  File.newFile(filecontent);
  ctx.status = 200;
});

router.get("/delete", async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const fileid: string = ctx.query.fileid;
  await File.deleteFile(fileid);
  ctx.redirect("back");
});

export default router;
