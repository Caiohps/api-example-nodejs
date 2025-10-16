import { Request, Response } from 'express';
import { UserController } from '../../../src/interfaces/http/controllers/UserController';
import { CreateUserUseCase } from '../../../src/application/use-cases/CreateUserUseCase';
import { User } from '../../../src/domain/entities/User';
import { EmailAlreadyInUseError } from '../../../src/application/errors/EmailAlreadyInUseError';
import { InvalidUserError } from '../../../src/domain/errors/InvalidUserError';

function createResponseMock() {
  const response: Partial<Response> & {
    statusCode: number;
    payload: unknown;
  } = {
    statusCode: 200,
    payload: undefined,
    status(code: number) {
      this.statusCode = code;
      return this as Response;
    },
    json(data: unknown) {
      this.payload = data;
      return this as Response;
    },
  };

  return response as Response & { statusCode: number; payload: unknown };
}

describe('UserController', () => {
  const name = 'Jane Doe';
  const email = 'jane.doe@example.com';
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  function createUseCaseStub(implementation: () => Promise<User>) {
    return {
      execute: jest.fn().mockImplementation(implementation),
    } as unknown as CreateUserUseCase;
  }

  it('returns 201 when a user is successfully created', async () => {
    const user = User.create({ name, email }, 'user-id');
    const useCase = createUseCaseStub(async () => user);
    const controller = new UserController(useCase);
    const req = { body: { name, email } } as Request;
    const res = createResponseMock();

    await controller.create(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.payload).toEqual({
      message: 'User created',
      user: {
        id: 'user-id',
        name,
        email,
      },
    });
  });

  it('returns 409 when email is already in use', async () => {
    const useCase = createUseCaseStub(async () => {
      throw new EmailAlreadyInUseError(email);
    });
    const controller = new UserController(useCase);
    const req = { body: { name, email } } as Request;
    const res = createResponseMock();

    await controller.create(req, res);

    expect(res.statusCode).toBe(409);
    expect(res.payload).toEqual({
      message: 'User with email "jane.doe@example.com" already exists.',
    });
  });

  it('returns 400 when use case raises validation error', async () => {
    const useCase = createUseCaseStub(async () => {
      throw new InvalidUserError('Invalid user');
    });
    const controller = new UserController(useCase);
    const req = { body: { name, email } } as Request;
    const res = createResponseMock();

    await controller.create(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: 'Invalid user' });
  });

  it('returns 500 when an unexpected error occurs', async () => {
    const useCase = createUseCaseStub(async () => {
      throw new Error('database down');
    });
    const controller = new UserController(useCase);
    const req = { body: { name, email } } as Request;
    const res = createResponseMock();

    await controller.create(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.payload).toEqual({ message: 'Internal server error' });
  });
});
