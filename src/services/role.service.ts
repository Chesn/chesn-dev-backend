import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

import { CreateRoleInput, UpdateRoleInput } from '../resolvers';

type ItemWithId = {
  id: string;
};

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  userRole(userId: string) {
    return this.prisma.user
      .findUnique({
        where: { id: userId },
      })
      .role();
  }

  createRole({ name, permissionIds }: CreateRoleInput) {
    return this.prisma.role.create({
      data: {
        name,
        permissons: {
          connect: permissionIds?.map((id) => ({ id })),
        },
      },
    });
  }

  async updateRole({ id, permissionIds, ...rest }: UpdateRoleInput) {
    let needToRemove: ItemWithId[] | undefined = undefined;
    let needToConnect: ItemWithId[] | undefined = undefined;

    if (permissionIds) {
      const exists = await this.prisma.role
        .findUnique({ where: { id } })
        .permissons();

      needToRemove = [];
      needToConnect = permissionIds.map((id) => ({
        id,
      }));

      let oldId: string | undefined;
      let newId: string;

      if (exists) {
        for (let i = 0, len = exists.length; i < len; i++) {
          oldId = exists[i].id;

          for (let j = 0; j < needToConnect.length; j++) {
            newId = needToConnect[i].id;

            if (newId === oldId) {
              oldId = undefined;
              needToConnect.splice(j, 1);
              break;
            }
          }

          if (oldId) {
            needToRemove.push({ id: oldId });
          }
        }
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        ...rest,
        permissons: {
          connect: needToConnect,
          disconnect: needToRemove,
        },
      },
    });
  }
}
