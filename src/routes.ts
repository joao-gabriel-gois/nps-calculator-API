import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { NpsCalculatorController } from './controllers/NpsCalculatorController';
import { SendSurveyEmailController } from './controllers/SendSurveyEmailController';
import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const router = Router();

const userController = new UsersController();
const surveyController = new SurveysController();
const sendSurveyEmailController = new SendSurveyEmailController();
const answerController = new AnswerController();
const npsCalculatorController = new NpsCalculatorController();


router.post('/users', userController.create);

router.get('/surveys', surveyController.index);
router.post('/surveys', surveyController.create);

router.post('/send-survey', sendSurveyEmailController.execute);

router.get('/answers/:user_id', answerController.execute);

router.get('/nps-calculation/:survey_id', npsCalculatorController.execute);

export { router };
