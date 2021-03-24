import path from 'path';
import { Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUserRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendEmailService from '../services/SendEmailService';
import { AppError } from '../errors/AppError';

class SendSurveyEmailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRespository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

    const user = await usersRespository.findOne({email});

    if (!user) {
      throw new AppError('This user does not exist');
    }

    const survey = await surveysRepository.findOne({id: survey_id});

    if(!survey) {
      throw new AppError('This survey does not exist');
    }
    const npsTemplatePath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const doesSurveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey']
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.MAIL_ANSWER_URL
    }

    if (doesSurveyUserExists) {
      variables.id = doesSurveyUserExists.id;
      await SendEmailService.execute(email, survey.title, variables, npsTemplatePath);
      return response.json(doesSurveyUserExists);
    }
    
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id: survey.id,
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    try {    
      await SendEmailService.execute(user.email, survey.title, variables, npsTemplatePath);

      return response.json(surveyUser);
    } catch (error) {
      throw new AppError(error.message, 503);
    }
  }
}

export { SendSurveyEmailController };