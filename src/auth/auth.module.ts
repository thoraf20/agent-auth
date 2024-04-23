import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.service';
import { AccesstTokenStrategy } from './strataegies/jwt.strategies';
import { Users } from '../users/entities/user.entity';
import { UsersModule } from '../users/user.module';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AccesstTokenStrategy, Repository],
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Users]),
    UsersModule,
  ],
})
export class AuthModule {}
