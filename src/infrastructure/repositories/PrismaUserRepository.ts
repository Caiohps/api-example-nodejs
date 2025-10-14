import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { getPrismaClient } from '../database/prismaClient';

export class PrismaUserRepository implements UserRepository {
  public async create(user: User): Promise<User> {
    const prisma = await getPrismaClient();
    const created = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
      },
    });

    return User.create({ name: created.name, email: created.email }, created.id);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const prisma = await getPrismaClient();
    const found = await prisma.user.findUnique({ where: { email } });

    if (!found) {
      return null;
    }

    return User.create({ name: found.name, email: found.email }, found.id);
  }
}
