import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PrismaService } from '../../services';

import { Permission } from '../../models';
import { CreatePermissionInput, UpdatePermissionInput } from './dto';
import { Auth } from '../../decorators';

@Resolver()
export class PermissionResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Auth('admin')
  @Query(() => Permission)
  permission(@Args('id') id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  @Auth('admin')
  @Query(() => [Permission])
  permissions() {
    return this.prisma.permission.findMany();
  }

  @Auth('admin')
  @Query(() => [Permission])
  userPermissions(@Args('id') userId: string) {
    return this.prisma.user
      .findUnique({ where: { id: userId } })
      .role()
      .permissons();
  }

  @Auth('admin')
  @Mutation(() => Permission)
  createPermission(@Args('data') data: CreatePermissionInput) {
    return this.prisma.permission.create({ data });
  }

  @Auth('admin')
  @Mutation(() => Permission)
  updatePermission(@Args('data') { id, ...data }: UpdatePermissionInput) {
    return this.prisma.permission.update({
      where: { id },
      data,
    });
  }

  @Auth('admin')
  @Mutation(() => Permission)
  deletePermission(@Args('id') permissionId: string) {
    return this.prisma.permission.delete({ where: { id: permissionId } });
  }
}
