import appFactory from "@/factory/app.factory";
import responseFactory from "@/factory/response.factory";
import getPrismaClient from "@/util/prisma.util";

/**
 * User route
 */
const userRoute = appFactory.createApp().get("/", async (c) => {
  const prisma = getPrismaClient();
  const users = await prisma.user.findMany();

  return c.json(responseFactory.success(users), 200);
});

export default userRoute;
