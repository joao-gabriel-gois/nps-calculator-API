import { Router } from 'express';
import { SendSurveyEmailController } from './controllers/SendSurveyEmailController';
import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const router = Router();

const userController = new UsersController();
const surveyController = new SurveysController();
const sendSurveyEmailController = new SendSurveyEmailController();

router.post('/users', userController.create);

router.get('/surveys', surveyController.index);
router.post('/surveys', surveyController.create);

router.post('/send-survey', sendSurveyEmailController.execute);

export { router };
