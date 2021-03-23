import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  title!: string;

  @Field()
  categoryName!: string;

  @Field({ nullable: true })
  content?: string;
}
