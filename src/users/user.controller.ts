import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseObject, ErrorResponseObject } from '../common/http';
import { IAuthedUser } from '../auth/auth.interface';
import { AuthedUser } from '../auth/decorators/authed.user.decorator';
import { UserAuth } from '../auth/decorators/user-auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@ApiTags('User')
@Controller('users')
@UseGuards(JwtAuthGuard)
@UserAuth()
@ApiBearerAuth('Bearer')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({
    description: 'User successfully retrieved.',
  })
  @Get('current')
  async getCurrentUser(@AuthedUser() authedUser: IAuthedUser) {
    try {
      const user = await this.userService.findById(authedUser.id);

      return new SuccessResponseObject('User successfully retrieved.', user);
    } catch (error) {
      this.logger.error(
        `Get current user error. ${error.message}`,
        error.stack,
      );
      ErrorResponseObject(error);
    }
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiOkResponse({
    description: 'User successfully retrieved.',
  })
  @Get('/email')
  async getUserByEmail(@Query('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      return new SuccessResponseObject('User successfully retrieved.', user);
    } catch (error) {
      this.logger.error(
        `Get user by email error. ${error.message}`,
        error.stack,
      );
      ErrorResponseObject(error);
    }
  }
}
