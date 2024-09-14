import { Router } from 'express';
import { ApiStatusController } from './controllers/ApiStatusController';

const router = Router();

const apiStatusController = new ApiStatusController();

router.get('/', apiStatusController.apiStatus);

export { router };