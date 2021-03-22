import { Injectable, UnauthorizedException } from '@nestjs/common';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

import { PrismaService } from './prisma.service';

import { Post } from '.prisma/client';
import { PostOrder, PostStatus } from '../models';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { UpdatePostInput } from '../resolvers';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findPosts(
    pagination?: PaginationArgs,
    query?: string,
    orderBy?: PostOrder,
    status?: PostStatus,
  ) {
    const { after, before, first, last } = pagination || {};
    const where = {
      status,
      title: {
        contains: query || '',
      },
    };

    return await findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          include: { author: true },
          where: { ...where },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.post.count({
          where: { ...where },
        }),
      { first, last, before, after },
    );
  }

  async updatePost(
    userId: string,
    newPostData: UpdatePostInput,
  ): Promise<Post> {
    const { id, ...data } = newPostData;
    const author = await this.prisma.post
      .findUnique({ where: { id } })
      .author();

    if (author?.id !== userId) {
      throw new UnauthorizedException();
    }

    return this.prisma.post.update({ where: { id }, data });
  }
}
