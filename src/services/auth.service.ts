import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import dayjs, { OpUnitType } from 'dayjs';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { PasswordService } from './password.service';
import { GqlHttpContext } from '../common/context/http-context';

import { Token } from '../models';
import { SignupInput, JwtDto } from '../resolvers';
import { SecurityConfig, CookiesConfig } from '../configs/config.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  static refreshTokenKey = 'refreshToken';

  setRefreshCookie(context: GqlHttpContext, refreshToken: string) {
    const host = context.request.headers.host as string;
    const { path, httpOnly, secure, sameSite }: CookiesConfig =
      this.configService.get<CookiesConfig>('cookies') || ({} as CookiesConfig);
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const refreshIn = securityConfig?.refreshIn;
    const expires: Date | undefined = refreshIn
      ? dayjs()
          .add(
            parseInt(refreshIn),
            refreshIn.slice(refreshIn.length - 1) as OpUnitType,
          )
          .toDate()
      : undefined;

    context.reply.setCookie(AuthService.refreshTokenKey, refreshToken, {
      expires,
      path,
      domain: host.slice(host.indexOf('.')),
      httpOnly,
      secure,
      sameSite,
    });
  }

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          role: {
            connect: {
              name: 'USER',
            },
          },
        },
      });

      return this.generateToken({
        uid: user.id,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      } else {
        throw new Error(error);
      }
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateToken({
      uid: user.id,
    });
  }

  validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User | null> {
    const { uid } = this.jwtService.decode(token) as JwtDto;

    return this.prisma.user.findUnique({ where: { id: uid } });
  }

  generateToken(payload: JwtDto): Token {
    const token = this.jwtService.sign(payload);

    const securityConfig = this.configService.get<SecurityConfig>('security');
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: securityConfig?.refreshIn,
    });

    return {
      token,
      refreshToken,
    };
  }

  refreshToken(token: string): Token {
    try {
      const { uid } = this.jwtService.verify(token) as JwtDto;

      return this.generateToken({ uid });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
