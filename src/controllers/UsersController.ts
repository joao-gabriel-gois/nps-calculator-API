import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/User";

class UserController {
  async create(request: Request, response: Response) {
    const {name, email } = request.body;

    const userRepository = getRepository(User);

    const userAlreadyExists = userRepository.findOne({
      where: {
        email,
      }
    });

    if (userAlreadyExists) {
      return response.status(403).json({
        error: "Not allowed",
        message: "User already exists"
      })
    }

    const user = userRepository.create({name, email});
    await userRepository.save(user);

    return response.status(201);

  }
}

export { UserController };