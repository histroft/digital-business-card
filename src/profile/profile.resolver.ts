import { Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Achievement, Experience, ProfessionalLink, Profile, Project, Skill } from '@prisma/client';
import { ProfileLoaders } from './loaders/profile.loaders';
import { AchievementModel } from './models/achievement.model';
import { ExperienceModel } from './models/experience.model';
import { ProfessionalLinkModel } from './models/professional-link.model';
import { ProfileModel } from './models/profile.model';
import { ProjectModel } from './models/project.model';
import { SkillModel } from './models/skill.model';
import { ProfileService } from './profile.service';

interface GraphqlContext {
  loaders: ProfileLoaders;
}

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, { nullable: true, description: 'The primary digital business card.' })
  profile(): Promise<Profile | null> {
    return this.profileService.findMain();
  }

  @Query(() => [ProfileModel], { description: 'Demonstrates batched nested field resolution.' })
  profiles(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @ResolveField(() => [ProfessionalLinkModel])
  professionalLinks(@Parent() profile: Profile, @Context() context: GraphqlContext): Promise<ProfessionalLink[]> {
    return context.loaders.linksByProfileId.load(profile.id);
  }

  @ResolveField(() => [SkillModel])
  skills(@Parent() profile: Profile, @Context() context: GraphqlContext): Promise<Skill[]> {
    return context.loaders.skillsByProfileId.load(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  experiences(@Parent() profile: Profile, @Context() context: GraphqlContext): Promise<Experience[]> {
    return context.loaders.experiencesByProfileId.load(profile.id);
  }

  @ResolveField(() => [ProjectModel])
  projects(@Parent() profile: Profile, @Context() context: GraphqlContext): Promise<Project[]> {
    return context.loaders.projectsByProfileId.load(profile.id);
  }
}

@Resolver(() => ExperienceModel)
export class ExperienceResolver {
  @ResolveField(() => [AchievementModel])
  achievements(@Parent() experience: Experience, @Context() context: GraphqlContext): Promise<Achievement[]> {
    return context.loaders.achievementsByExperienceId.load(experience.id);
  }
}
