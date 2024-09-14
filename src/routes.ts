import { Router } from 'express';
import { ApiStatusController } from './controllers/ApiStatusController';
import { UserController } from './controllers/UserController';

const router = Router();

const apiStatusController = new ApiStatusController();
const userController = new UserController();

router.get('/', apiStatusController.apiStatus);

router.post('/user', userController.create)

export { router };