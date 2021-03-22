import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  startCursor?: string;
  endCursor?: string;
  hasNextPage!: boolean;
  hasPreviousPage!: boolean;
}
