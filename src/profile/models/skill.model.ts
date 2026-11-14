import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SkillModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  category?: string | null;

  @Field(() => Int)
  sortOrder!: number;
}
