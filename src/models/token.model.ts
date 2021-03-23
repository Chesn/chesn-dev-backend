import { ObjectType, Field, HideField } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field({ description: 'JWT access token' })
  token!: string;

  @HideField()
  refreshToken!: string;
}
