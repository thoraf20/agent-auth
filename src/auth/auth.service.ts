import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Users } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { JwtPayload } from './auth.interface';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private config: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: RegisterDto) {
    const { email } = dto;

    const userExist = await this.usersRepository.findOne({
      where: { email: email.toLocaleLowerCase().trim() },
    });

    if (userExist) {
      throw new ConflictException(`Email already exist, please login`);
    }

    const hash = await bcrypt.hash(dto.password, 10);
    dto.password = hash;

    const createdUser = await this.userService.createUser(dto);

    if (createdUser) {
      return 'success';
    } else {
      throw new UnprocessableEntityException('Unable to create user account');
    }
  }
  async verifyEmail(code: string, email: string) {
    try {
      const dbUser = await this.userService.findByEmail(email);

      if (!dbUser) {
        throw new NotFoundException('User does not exist');
      }

      if (dbUser.isEmailVerified) {
        throw new ConflictException('email already verified');
      }

      if (code !== '1234') {
        throw new BadRequestException('incorrect code');
      }

      await this.usersRepository.update(
        { id: dbUser.id },
        { isEmailVerified: true, isActive: true },
      );

      const apiUrl = 'http://localhost:4008/api/wallets';

      try {
        const response = await axios.post(
          apiUrl,
          {
            agentId: dbUser.id,
          },
          {
            headers: {
              // Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(response);

        // Handle response
      } catch (error) {
        // Handle error
        console.log(error);
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(user: { email: string; password: string }) {
    const { email, password } = user;
    const dbUser = await this.usersRepository.findOne({ where: { email } });

    if (dbUser && (await dbUser.validatePassword(password))) {
      return dbUser;
    } else {
      throw new BadRequestException('Email or password is incorrect');
    }
  }

  async login(user: LoginDto) {
    const dbUser = await this.validateUser(user);

    if (!dbUser.isEmailVerified) {
      throw new BadRequestException(
        'Email is yet to be verified, kindly use 1234 as the code for email verification',
      );
    }

    if (dbUser) {
      const payload = {
        email: dbUser.email,
        id: dbUser.id,
      };

      const token = await this.signToken(payload);
      dbUser.password = '';

      return {
        data: {
          ...dbUser,
          accessToken: token.access_token,
        },
      };
    }
  }

  private async signToken(payload: JwtPayload) {
    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '24h',
    });

    return { access_token: accessToken };
  }

  async getAuthTokens(user: Users) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = await this.signToken(payload);
    user.password = '';

    return {
      data: {
        ...user,
        accessToken: token.access_token,
      },
    };
  }
}
