import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  id!: string;
  name?: string;
  description?: string;
  permissionIds?: string[];
}
