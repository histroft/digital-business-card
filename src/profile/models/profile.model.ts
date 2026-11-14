import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExperienceModel } from './experience.model';
import { ProfessionalLinkModel } from './professional-link.model';
import { ProjectModel } from './project.model';
import { SkillModel } from './skill.model';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [ProfessionalLinkModel])
  professionalLinks!: ProfessionalLinkModel[];

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field(() => [ExperienceModel])
  experiences!: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects!: ProjectModel[];
}
