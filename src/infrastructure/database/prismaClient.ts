import { PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

let prismaClient: PrismaClient | null = null;

async function createPrismaClientWithRetry(): Promise<PrismaClient> {
  const client = new PrismaClient();

  while (true) {
    try {
      await client.$connect();
      console.info({ database: 'Connection was successful' });
      return client;
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        console.error({ database: 'Failed to initialize Prisma Client' });
        console.error(error.message);
      } else if (error instanceof PrismaClientKnownRequestError) {
        console.error({ database: 'Prisma Client request error' });
        console.error(error.message);
      } else {
        console.error({ database: 'Unknown Prisma Client error' });
        console.error(error);
      }

      console.info({ database: 'Retrying connection in 5 seconds' });
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

export async function getPrismaClient(): Promise<PrismaClient> {
  if (!prismaClient) {
    prismaClient = await createPrismaClientWithRetry();
  }

  return prismaClient;
}
