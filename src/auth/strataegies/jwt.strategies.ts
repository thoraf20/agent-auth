import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/user.service';
import { IAuthedUser, JwtPayload } from '../auth.interface';
import { Request } from 'express';

@Injectable()
export class AccesstTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccesstTokenStrategy.extractJWT, // Enables cookie-based authentication
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: `${process.env.JWT_SECRET}`,
      ignoreExpiration: false,
      pass: true,
    });
  }

  async validate(payload: JwtPayload): Promise<IAuthedUser> {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('invalid user');
    }

    return { id: user.id, email: user.email };
  }

  private static extractJWT(req: Request): string | null {
    const nodeEnvironment = `${process.env.NODE_ENV}`;
    const authTokenCookieName =
      nodeEnvironment === 'production' ? '__Secure-bf-token' : 'x_bill-token';

    if (
      req.cookies &&
      authTokenCookieName in req.cookies &&
      req.cookies[authTokenCookieName].length > 0
    ) {
      return req.cookies[authTokenCookieName];
    }
    return null;
  }
}
