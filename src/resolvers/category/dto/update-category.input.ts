import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
