import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AchievementModel } from './achievement.model';

@ObjectType()
export class ExperienceModel {
  @Field(() => ID)
  id!: string;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field()
  period!: string;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => [AchievementModel])
  achievements!: AchievementModel[];
}
