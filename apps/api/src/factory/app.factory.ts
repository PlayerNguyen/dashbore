import type { AppEnvironment } from "@/types/app.types";
import { createFactory } from "hono/factory";

const appFactory = createFactory<AppEnvironment>();

export default appFactory;
