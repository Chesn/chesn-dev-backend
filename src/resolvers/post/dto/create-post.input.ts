import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  title!: string;
  categoryName!: string;

  @Field({ nullable: true })
  content?: string;
}
