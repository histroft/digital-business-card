import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AchievementModel {
  @Field(() => ID)
  id!: string;

  @Field()
  description!: string;

  @Field(() => Int)
  sortOrder!: number;
}
