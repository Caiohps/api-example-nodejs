import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { EmailAlreadyInUseError } from '../errors/EmailAlreadyInUseError';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(input: CreateUserDTO): Promise<User> {
    const user = User.create({ name: input.name, email: input.email });

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(user.email);
    }

    const createdUser = await this.userRepository.create(user);
    return createdUser;
  }
}
