import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.ts";

let prismaClient: PrismaClient | undefined;

export function getPrismaClient() {
  if (!prismaClient) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    prismaClient = new PrismaClient({
      adapter,
      omit: { user: { password: true } },
    });
  }
  return prismaClient;
}

export { PrismaClient } from "../generated/client.ts";
export type {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
} from "../generated/client.ts";
export type { Prisma } from "../generated/client.ts";
