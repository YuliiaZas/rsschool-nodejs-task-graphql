import { PrismaClient } from "@prisma/client";

export interface ContextValue {
  prisma: PrismaClient;
};
