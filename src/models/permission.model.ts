import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field()
  name!: string;

  @Field()
  description?: string;
}
