import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";

class NpsCalculatorController {
  /**
   NPS Logic explanation:
   
   Notes from 1 to 6 are classified as Detractors;
   Notes 7 and 8 are classified as Passives; -> Not used in the calculation
   Notes 9 and 10 are classified as Promoters;

   Calculation:

   (amount of promoters - amount of detractors) / (total answers) x 100
   
   */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    })

    const detractors = surveysUsers.filter(survey => {
      return survey.value > 0 && survey.value < 7;
    }).length;

    const promoters = surveysUsers.filter(survey => {
      return survey.value > 8;
    }).length;

    const passives = surveysUsers.filter(survey => {
      return survey.value > 6 && survey.value < 9;
    }).length;

    const total = surveysUsers.length;

    const npsRate = Number(((promoters - detractors) / total * 100).toFixed(2));

    return response.json({
      detractors,
      passives,
      promoters,
      total,
      npsRate,
    });

  }
}

export { NpsCalculatorController };