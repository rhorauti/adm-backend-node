import { User } from '@models/auth/user.model.';
import { DataSource, Repository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthRepository {
  private userRepository: Repository<User>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async createNewUser(name: string, email: string, password: string): Promise<User> {
    const newUser = this.userRepository.create({
      name: name,
      email: email,
      password: password,
      createdAt: new Date(),
      photoUrl: '',
      accessLevel: 1,
      isActive: true,
      emailConfirmed: false,
    });
    return this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    return user;
  }

  async validateEmail(email: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ emailConfirmed: true })
      .where({ email: email })
      .execute();
  }

  async changePassword(email: string, password: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: password })
      .where({ email: email })
      .execute();
  }
}
