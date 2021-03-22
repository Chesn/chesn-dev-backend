import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { UserEntity } from '../../decorators/user.decorator';

import { PostService, PrismaService } from '../../services';

import {
  Post,
  PostConnection,
  PostOrder,
  PostStatus,
  PostIdArgs,
  User,
  UserIdArgs,
} from '../../models';
import { PaginationArgs } from '../../common/pagination/pagination.args';
import { ChangePostStatusInput, CreatePostInput, UpdatePostInput } from './dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  @Query(() => PostConnection)
  async publishedPosts(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query: string,
    @Args({
      name: 'orderBy',
      type: () => PostOrder,
      nullable: true,
    })
    orderBy: PostOrder,
  ) {
    const where = {
      status: 'PUBLISHED' as PostStatus,
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

  @Query(() => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({
        where: { id: id.userId },
      })
      .posts({ where: { status: 'PUBLISHED' } });
  }

  @Query(() => Post)
  post(@Args() id: PostIdArgs) {
    return this.prisma.post.findUnique({ where: { id: id.postId } });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(
    @UserEntity() user: User,
    @Args('data') { title, content, category }: CreatePostInput,
  ) {
    return this.prisma.post.create({
      data: {
        title,
        content,
        status: 'DRAFT',
        author: {
          connect: {
            id: user.id,
          },
        },
        category: {
          connect: {
            name: category,
          },
        },
      },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @UserEntity() user: User,
    @Args('id') postId: string,
    @Args('data') newPostData: UpdatePostInput,
  ) {
    return this.postService.updatePost(user.id, postId, newPostData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  changePostStatus(
    @UserEntity() user: User,
    @Args('id') postId: string,
    @Args('data') status: ChangePostStatusInput,
  ) {
    return this.postService.updatePost(user.id, postId, status);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  deletePost(@UserEntity() user: User, @Args('id') postId: string) {
    return this.postService.updatePost(user.id, postId, {
      status: 'DELETED' as PostStatus,
    });
  }

  @ResolveField('author')
  author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}
