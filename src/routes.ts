import { Router } from 'express';
import { UserController } from './controllers/UsersController';

const router = Router();

const userController = new UserController();

router.post('/user', userController.create);

export { router };