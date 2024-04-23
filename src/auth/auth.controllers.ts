import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, verifyEmailDto } from './dto/users.dto';
import { ErrorResponseObject, SuccessResponseObject } from '../common/http';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  async signup(@Body() body: RegisterDto) {
    try {
      await this.authService.signUp(body);

      return new SuccessResponseObject(`use 1234 as email verification code`);
    } catch (error) {
      this.logger.error(`Sign up error. ${error.message}`, error.stack);
      ErrorResponseObject(error);
    }
  }
  @Post('/verify/email')
  @ApiOperation({ summary: 'Verify user account credentials' })
  async verifyAccount(@Body() body: verifyEmailDto) {
    try {
      const { code, email } = body;
      await this.authService.verifyEmail(code, email);

      return new SuccessResponseObject(`email successfully verified`, '');
    } catch (error) {
      this.logger.error(`verification error. ${error.message}`, error.stack);
      ErrorResponseObject(error);
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse()
  async login(
    @Body() user: LoginDto,
  ): Promise<{ data: { accessToken: string } }> {
    try {
      const data = await this.authService.login(user);
      return new SuccessResponseObject(`Login Successful`, data);
    } catch (error) {
      this.logger.error(`login error. ${error.message}`, error.stack);
      ErrorResponseObject(error);
    }
  }
}
