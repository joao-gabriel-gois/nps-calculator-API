import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  async execute(request: Request, response: Response) {
    const { user_id } = request.params;
    const { answer } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(user_id),
    });

    if (!surveyUser) {
      throw new AppError('This SurveyUser does not exist!');
    }

    surveyUser.value = Number(answer);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
