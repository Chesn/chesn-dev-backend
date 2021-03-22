import { InputType } from '@nestjs/graphql';

import { PostStatus } from '../../../models';

@InputType()
export class UpdatePostInput {
  id!: string;
  status?: PostStatus;
  title?: string;
  content?: string;
}
