import { Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService, PasswordService, PrismaService } from '../../services';

@Module({
  providers: [UserResolver, UserService, PasswordService, PrismaService],
})
export class UserModule {}
