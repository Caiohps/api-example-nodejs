import { Router } from 'express';
import { ApiStatusController } from './controllers/ApiStatusController';
import { UserController } from './controllers/UserController';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';

const router = Router();

const apiStatusController = new ApiStatusController();
const prismaUserRepository = new PrismaUserRepository();
const createUserUseCase = new CreateUserUseCase(prismaUserRepository);
const userController = new UserController(createUserUseCase);

router.get('/', (req, res) => apiStatusController.apiStatus(req, res));
router.post('/users', (req, res) => userController.create(req, res));

export { router };
