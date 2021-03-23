import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  permissionIds?: string[];
}
