import DataLoader from 'dataloader';
import { Achievement, Experience, ProfessionalLink, Project, Skill } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { demoAchievements, demoExperiences, demoLinks, demoProjects, demoSkills } from '../demo-data';

type HasProfileId = { profileId: string };

function byProfileId<T extends HasProfileId>(
  findMany: (profileIds: readonly string[]) => Promise<T[]>,
): DataLoader<string, T[]> {
  return new DataLoader<string, T[]>(async (profileIds) => {
    const rows = await findMany(profileIds);
    const grouped = new Map<string, T[]>();

    for (const id of profileIds) grouped.set(id, []);
    for (const row of rows) grouped.get(row.profileId)?.push(row);

    return profileIds.map((id) => grouped.get(id) ?? []);
  });
}

export interface ProfileLoaders {
  linksByProfileId: DataLoader<string, ProfessionalLink[]>;
  skillsByProfileId: DataLoader<string, Skill[]>;
  experiencesByProfileId: DataLoader<string, Experience[]>;
  projectsByProfileId: DataLoader<string, Project[]>;
  achievementsByExperienceId: DataLoader<string, Achievement[]>;
}

/**
 * One loader set is created for each GraphQL request. This batches field
 * resolvers for a list of profiles into one query per relation (no N+1).
 */
export function createLoaders(prisma: PrismaService): ProfileLoaders {
  if (process.env.DEMO_MODE === 'true') {
    return {
      linksByProfileId: new DataLoader(async (ids) => ids.map((id) => demoLinks.filter((item) => item.profileId === id))),
      skillsByProfileId: new DataLoader(async (ids) => ids.map((id) => demoSkills.filter((item) => item.profileId === id))),
      experiencesByProfileId: new DataLoader(async (ids) => ids.map((id) => demoExperiences.filter((item) => item.profileId === id))),
      projectsByProfileId: new DataLoader(async (ids) => ids.map((id) => demoProjects.filter((item) => item.profileId === id))),
      achievementsByExperienceId: new DataLoader(async (ids) => ids.map((id) => demoAchievements.filter((item) => item.experienceId === id))),
    };
  }

  return {
    linksByProfileId: byProfileId((profileIds) =>
      prisma.professionalLink.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      }),
    ),
    skillsByProfileId: byProfileId((profileIds) =>
      prisma.skill.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      }),
    ),
    experiencesByProfileId: byProfileId((profileIds) =>
      prisma.experience.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      }),
    ),
    projectsByProfileId: byProfileId((profileIds) =>
      prisma.project.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { sortOrder: 'asc' },
      }),
    ),
    achievementsByExperienceId: new DataLoader<string, Achievement[]>(async (experienceIds) => {
      const rows = await prisma.achievement.findMany({
        where: { experienceId: { in: [...experienceIds] } },
        orderBy: { sortOrder: 'asc' },
      });
      const grouped = new Map<string, Achievement[]>();

      for (const id of experienceIds) grouped.set(id, []);
      for (const row of rows) grouped.get(row.experienceId)?.push(row);

      return experienceIds.map((id) => grouped.get(id) ?? []);
    }),
  };
}
