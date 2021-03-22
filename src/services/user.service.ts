import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from './prisma.service';
import { PasswordService } from './password.service';

import { UpdateUserInput, ChangePasswordInput } from '../resolvers';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  updateUser(userId: string, newUserData: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id: userId,
      },
    });
  }
}
