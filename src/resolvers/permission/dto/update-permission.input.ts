import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionInput {
  id!: string;
  name?: string;
  description?: string;
}
