import { InvalidUserError } from '../errors/InvalidUserError';

export interface UserProps {
  readonly name: string;
  readonly email: string;
}

export class User {
  private constructor(
    private readonly props: UserProps,
    private readonly _id?: string,
  ) {}

  public static create(props: UserProps, id?: string): User {
    const name = props.name?.trim();
    const email = props.email?.trim().toLowerCase();

    if (!name) {
      throw new InvalidUserError('User name is required.');
    }

    if (!email) {
      throw new InvalidUserError('User email is required.');
    }

    if (!User.isValidEmail(email)) {
      throw new InvalidUserError('User email is invalid.');
    }

    return new User({ name, email }, id);
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }
}
