import { User } from '../../../domain/entities/User';

export class UserPresenter {
  public static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
