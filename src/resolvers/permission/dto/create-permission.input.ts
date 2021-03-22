import { InputType } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
  name!: string;
  description?: string;
}
