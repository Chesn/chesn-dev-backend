import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field({ description: 'JWT access token' })
  accessToken!: string;

  @Field({ description: 'JWT refresh token' })
  refreshToken!: string;
}
