import { Router } from 'express';
import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const router = Router();

const userController = new UsersController();
const surveyController = new SurveysController();

router.post('/users', userController.create);

router.get('/surveys', surveyController.index);
router.post('/surveys', surveyController.create);

export { router };