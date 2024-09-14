import { Request, Response } from "express";
import { UserService } from "../services/UserService";

interface IUser {
    email: string;
    name: string;
}

const userService = new UserService();

export class UserController { 
    async create(req: Request, res: Response) {
        const userInfo: IUser = req.body;
        const userResponse = await userService.createUser(userInfo)

        return res.status(201).json({Message: "User created: ", User: userResponse })

    }
}