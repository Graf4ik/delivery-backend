import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/models/users.model';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | boolean => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request?.user as User;
    if (!user) {
      return false;
    }
    return user;
  },
);
