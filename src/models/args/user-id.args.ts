import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class UserIdArgs {
  @Field()
  @IsNotEmpty()
  userId!: string;
}
