import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  url!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  sortOrder!: number;
}
