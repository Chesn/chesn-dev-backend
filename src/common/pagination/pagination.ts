import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

import { PageInfo } from './page-info.model';

export function Paginated<Item>(ItemCls: Type<Item>): any {
  @ObjectType(`${ItemCls.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor!: string;

    @Field(() => ItemCls)
    node!: Item;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges!: EdgeType[];

    @Field(() => PageInfo)
    pageInfo!: PageInfo;

    @Field(() => Number)
    total!: number;
  }

  return PaginatedType;
}
