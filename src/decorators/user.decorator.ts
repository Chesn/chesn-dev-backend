import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '../models';

export const UserEntity = createParamDecorator<User>(
  (data: unknown, context: ExecutionContext) =>
    GqlExecutionContext.create(context).getContext().req.user,
);
