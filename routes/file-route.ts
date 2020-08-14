import Koa from "koa";
import Router from "koa-router";
import File from "../src/file-service";

const router = new Router();

router.prefix("/file");

router.get(
  "/:caseid",
  async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    let file_list = File.getlist(ctx.params.caseid);
    console.log(file_list);
    await ctx.render("file-management", { file_list: file_list });
  }
);
export default router;
