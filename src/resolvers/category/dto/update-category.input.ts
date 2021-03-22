import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  id!: string;
  name?: string;
  description?: string;
}
