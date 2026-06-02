import { PrismaClient } from "@generated/prisma/client";

let prismaClient: PrismaClient | undefined;

/**
 * Get the lazy loaded prisma client instance.
 *
 * @returns PrismaClient
 */
export default function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      omit: {
        user: {
          password: true,
        },
      },
    }) as PrismaClient;
  }
  return prismaClient;
}
