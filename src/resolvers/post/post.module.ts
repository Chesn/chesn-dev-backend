import { Module } from '@nestjs/common';

import { PostService, PrismaService } from '../../services';
import { PostResolver } from './post.resolver';

@Module({
  providers: [PostResolver, PostService, PrismaService],
})
export class PostModule {}
