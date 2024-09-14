import { prismaClient } from "../database/prismaClient";

interface IUser {
    email: string;
    name: string;
}

export class UserService { 
    async createUser(user: IUser) {
        const createdUser = await prismaClient?.user.create({
            data: {...user}
        });
        return createdUser
    }
}