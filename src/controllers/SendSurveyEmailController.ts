import path from 'path';
import { Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUserRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendEmailService from '../services/SendEmailService';

class SendSurveyEmailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRespository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

    const user = await usersRespository.findOne({email});

    if (!user) {
      return response.status(400).json({
        error: "Bad Request",
        message: "This user does not exist",
      })
    }

    const survey = await surveysRepository.findOne({id: survey_id});

    if(!survey) {
      return response.status(400).json({
        error: "Bad request",
        message: "This survey does not exist",
      })
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

    
    await SendEmailService.execute(user.email, survey.title, variables, npsTemplatePath);

    return response.json(surveyUser);
  }
}

export { SendSurveyEmailController };