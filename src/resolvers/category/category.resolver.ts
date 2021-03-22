import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Auth } from '../../decorators';
import { PrismaService } from '../../services';

import { Category, Post } from '../../models';
import { CreateCategoryInput, UpdateCategoryInput } from './dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => Category)
  category(@Args('id') id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  @Query(() => [Category])
  categories() {
    return this.prisma.category.findMany();
  }

  @Query(() => [Category])
  queryCategories(@Args('query') query: string) {
    return this.prisma.category.findMany({
      where: {
        name: {
          contains: query,
        },
      },
    });
  }

  @Auth('author')
  createCategory(@Args('data') data: CreateCategoryInput) {
    return this.prisma.category.create({ data });
  }

  @Auth('admin')
  updateCategory(@Args('data') { id, ...data }: UpdateCategoryInput) {
    return this.prisma.category.update({ where: { id }, data });
  }

  @Auth('damin')
  deleteCategory(@Args('id') categoryId: string) {
    return this.prisma.category.delete({ where: { id: categoryId } });
  }

  @ResolveField('posts', () => [Post])
  posts(@Parent() { id }: Category) {
    return this.prisma.category.findUnique({ where: { id } }).posts();
  }
}
