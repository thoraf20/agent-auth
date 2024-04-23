import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  ValidateIf,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OtpType {
  'SIGNUP' = 'SIGNUP',
  'FORGOT_PASSWORD' = 'FORGOT_PASSWORD',
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 special character',
  })
  password?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 special character',
  })
  password: string;
}

export class verifyEmailDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class forgotPasswordDto {
  @ApiPropertyOptional()
  @IsPhoneNumber()
  @IsOptional()
  @ValidateIf((o) => !o.email || o.phone)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => !o.phone || o.email)
  email?: string;
}
