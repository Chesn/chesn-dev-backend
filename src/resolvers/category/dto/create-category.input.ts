import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  name!: string;
  description?: string;
}
