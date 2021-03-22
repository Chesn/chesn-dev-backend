import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { PrismaService, RoleService } from '../../services';
import { Auth } from '../../decorators';

import { Permission, Role, User } from '../../models';
import { CreateRoleInput, UpdateRoleInput } from './dto';

@Resolver(() => Role)
export class RoleResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  @Auth('admin')
  @Query(() => Role)
  role(@Args('id') id: string) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  @Auth('admin')
  @Query(() => [Role])
  roles() {
    return this.prisma.role.findMany();
  }

  @Auth('admin')
  @Mutation(() => Role)
  createRole(@Args('data') data: CreateRoleInput) {
    return this.roleService.createRole(data);
  }

  @Auth('admin')
  @Mutation(() => Role)
  updateRole(@Args('data') data: UpdateRoleInput) {
    return this.roleService.updateRole(data);
  }

  @Auth('admin')
  @Mutation(() => Role)
  deleteRole(@Args('id') roleId: string) {
    return this.prisma.role.delete({ where: { id: roleId } });
  }

  @Auth('admin')
  @ResolveField('users', () => [User])
  users(@Parent() { id }: Role) {
    return this.prisma.role.findUnique({ where: { id } }).users();
  }

  @Auth('admin')
  @ResolveField('permissions', () => [Permission])
  permissions(@Parent() { id }: Role) {
    return this.prisma.role.findUnique({ where: { id } }).permissons();
  }
}
