import { CreateUserUseCase } from '../../src/application/use-cases/CreateUserUseCase';
import { EmailAlreadyInUseError } from '../../src/application/errors/EmailAlreadyInUseError';
import { InvalidUserError } from '../../src/domain/errors/InvalidUserError';
import { User } from '../../src/domain/entities/User';
import { UserRepository } from '../../src/domain/repositories/UserRepository';

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    const created = User.create(
      { name: user.name, email: user.email },
      (this.users.length + 1).toString(),
    );
    this.users.push(created);
    return created;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }
}

describe('CreateUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it('creates a new user when the email is unique', async () => {
    const user = await useCase.execute({
      name: 'Jane Doe',
      email: 'Jane.Doe@example.com',
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('Jane Doe');
    expect(user.email).toBe('jane.doe@example.com');
  });

  it('normalizes user email to lowercase', async () => {
    const user = await useCase.execute({
      name: 'John Doe',
      email: 'John.Doe@Example.COM',
    });

    expect(user.email).toBe('john.doe@example.com');
  });

  it('throws an error when email already exists', async () => {
    const email = 'jane@example.com';

    await useCase.execute({ name: 'Jane', email });

    await expect(useCase.execute({ name: 'Another Jane', email })).rejects.toBeInstanceOf(
      EmailAlreadyInUseError,
    );
  });

  it('throws an error when email is invalid', async () => {
    await expect(
      useCase.execute({ name: 'Invalid Email', email: 'invalid-email' }),
    ).rejects.toBeInstanceOf(InvalidUserError);
  });

  it('throws an error when name is missing', async () => {
    await expect(
      useCase.execute({ name: '', email: 'user@example.com' }),
    ).rejects.toBeInstanceOf(InvalidUserError);
  });
});
