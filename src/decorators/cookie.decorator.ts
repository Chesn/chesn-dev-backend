import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlHttpContext } from '../common/context/http-context';

export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(
      ctx,
    ).getContext<GqlHttpContext>();
    const cookies = context.request.cookies;

    return data ? cookies[data] : cookies;
  },
);
