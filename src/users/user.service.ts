import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createUser(userData: RegisterDto) {
    const createdUser = await this.usersRepository.save({
      ...userData,
    });

    return createdUser;
  }

  async findById(id: string) {
    const dbUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (dbUser) {
      dbUser.password = '';
      return dbUser;
    } else {
      throw new NotFoundException('user not found');
    }
  }

  async findByEmail(email: string) {
    const dbUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (dbUser) {
      dbUser.password = '';
      return dbUser;
    } else {
      throw new NotFoundException('user not found');
    }
  }

  async save(data) {
    const dbUser = await this.usersRepository.save({ ...data });

    if (dbUser) {
      return dbUser;
    } else {
      throw new NotFoundException('user not found');
    }
  }

  findOne(params: any = {}) {
    return this.usersRepository.findOne(params);
  }
}
