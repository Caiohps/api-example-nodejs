import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { EmailAlreadyInUseError } from '../../../application/errors/EmailAlreadyInUseError';
import { InvalidUserError } from '../../../domain/errors/InvalidUserError';
import { UserPresenter } from '../presenters/UserPresenter';

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.createUserUseCase.execute({
        name: req.body?.name,
        email: req.body?.email,
      });

      return res.status(201).json({
        message: 'User created',
        user: UserPresenter.toHTTP(user),
      });
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return res.status(409).json({ message: error.message });
      }

      if (error instanceof InvalidUserError) {
        return res.status(400).json({ message: error.message });
      }

      console.error('Unexpected error creating user', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
