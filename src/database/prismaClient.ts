import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

let prismaClient: PrismaClient | null = null;

async function createPrismaClientWithRetry() {
    prismaClient = new PrismaClient();
    //first connection with database
    const whileStatus = true;

    while(whileStatus){
        try {
            await prismaClient.$connect();
            console.info({ DatabaseConn: "connection was successful" });
            break;
        } catch (err) {
            if (err instanceof PrismaClientInitializationError) {
                console.error({ DBConn: "erro ao se conectar ao banco de dados" });
                console.error(err.message)
            } else if( err instanceof PrismaClientKnownRequestError) {
                console.error({ DBConn: "erro ao executar consulta ao banco de dados" });
                console.error(err.message)
            } else {
                console.error({ DBConn: "erro desconhecido" });
                console.error(err);
            }
            console.info({ DBConn: "Tentando reconexão em 5 segundos" });
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

async function main() {
    console.info('Starting main function...');
    await createPrismaClientWithRetry();
    console.info('Starting main function...');
}

main().catch((error) => {
    console.error(error);
    process.exit(1)
})

export { prismaClient };