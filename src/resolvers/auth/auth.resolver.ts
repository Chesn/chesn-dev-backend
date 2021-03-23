import { UnauthorizedException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';

import { AuthService } from '../../services';
import { Cookie } from '../../decorators';
import { GqlHttpContext } from '../../common/context/http-context';

import { Auth, Token } from '../../models';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signup(
    @Context() context: GqlHttpContext,
    @Args('data') data: SignupInput,
  ): Promise<Token> {
    data.email = data.email.toLowerCase();

    const { token, refreshToken } = await this.authService.createUser(data);

    this.authService.setRefreshCookie(context, refreshToken);

    return {
      token,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(
    @Context() context: GqlHttpContext,
    @Args('data') { email, password }: LoginInput,
  ): Promise<Token> {
    const { token, refreshToken } = await this.authService.login(
      email.toLowerCase(),
      password,
    );

    this.authService.setRefreshCookie(context, refreshToken);

    return {
      token,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(
    @Context() context: GqlHttpContext,
    @Cookie(AuthService.refreshTokenKey) tokenCookie: string,
  ): Promise<Token> {
    if (!tokenCookie) {
      throw new UnauthorizedException('');
    }

    const { token, refreshToken } = this.authService.refreshToken(tokenCookie);

    this.authService.setRefreshCookie(context, refreshToken);

    return { token, refreshToken };
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.authService.getUserFromToken(auth.token);
  }
}
