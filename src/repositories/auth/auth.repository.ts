import { Users } from '@models/auth/users';
import { DataSource, Repository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthRepository {
  private userRepository: Repository<Users>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(Users);
  }

  async createNewUser(name: string, email: string, password: string): Promise<Users> {
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

  async findUserByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    return user;
  }

  async validateEmail(email: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ emailConfirmed: true })
      .where({ email: email })
      .execute();
  }

  async changePassword(email: string, password: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ password: password })
      .where({ email: email })
      .execute();
  }
}
