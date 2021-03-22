import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';

import { Auth, UserEntity } from '../../decorators';

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
import { CreatePostInput, UpdatePostInput } from './dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  @Auth('author')
  @Query(() => [Post])
  posts(
    @Args({ nullable: true }) pagination?: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query?: string,
    @Args({ name: 'orderBy', type: () => PostOrder, nullable: true })
    orderBy?: PostOrder,
  ) {
    return this.postService.findPosts(pagination, query, orderBy);
  }

  @Query(() => PostConnection)
  async publishedPosts(
    @Args({ nullable: true }) pagination?: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query?: string,
    @Args({ name: 'orderBy', type: () => PostOrder, nullable: true })
    orderBy?: PostOrder,
  ) {
    return this.postService.findPosts(
      pagination,
      query,
      orderBy,
      PostStatus.PUBLISHED,
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

  @Auth('author')
  @Mutation(() => Post)
  createPost(
    @UserEntity() user: User,
    @Args('data') { title, content, categoryName }: CreatePostInput,
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
            name: categoryName,
          },
        },
      },
    });
  }

  @Auth('author')
  @Mutation(() => Post)
  updatePost(
    @UserEntity() user: User,
    @Args('data') newPostData: UpdatePostInput,
  ) {
    return this.postService.updatePost(user.id, newPostData);
  }

  @Auth('author')
  @Mutation(() => Post)
  deletePost(@UserEntity() user: User, @Args('id') postId: string) {
    return this.postService.updatePost(user.id, {
      id: postId,
      status: 'DELETED' as PostStatus,
    });
  }

  @ResolveField('author')
  author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}
