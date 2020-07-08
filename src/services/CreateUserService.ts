//ORDEM >>> MODEL >>> ROUTE >>> SERVICE >> ROUTE

import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    //verifica usuario existe
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    //cria usuario
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    //guarda usuario
    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
