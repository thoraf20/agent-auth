import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

export function UserAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized access.' }),
    ApiForbiddenResponse({ description: 'Access forbidden.' }),
  );
}
