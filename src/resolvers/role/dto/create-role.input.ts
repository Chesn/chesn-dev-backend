import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  name!: string;
  description?: string;
  permissionIds?: string[];
}
