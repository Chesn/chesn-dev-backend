import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { Post } from '.prisma/client';
import { UpdatePostInput, ChangePostStatusInput } from '../resolvers';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePost(
    userId: string,
    postId: string,
    newPostData: UpdatePostInput | ChangePostStatusInput,
  ): Promise<Post> {
    const author = await this.prisma.post
      .findUnique({ where: { id: postId } })
      .author();

    if (author?.id !== userId) {
      throw new UnauthorizedException();
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { ...newPostData },
    });
  }
}
