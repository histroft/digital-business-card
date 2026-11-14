import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfessionalLinkModel {
  @Field(() => ID)
  id!: string;

  @Field()
  label!: string;

  @Field()
  url!: string;

  @Field(() => Int)
  sortOrder!: number;
}
