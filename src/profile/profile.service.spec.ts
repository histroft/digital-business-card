import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  const profile = { id: 'profile-1', slug: 'main', name: 'YOUR_NAME', description: 'Developer' };
  const prisma = {
    profile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };
  const service = new ProfileService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('loads the configured primary profile by its stable slug', async () => {
    prisma.profile.findUnique.mockResolvedValue(profile);

    await expect(service.findMain()).resolves.toEqual(profile);
    expect(prisma.profile.findUnique).toHaveBeenCalledWith({ where: { slug: 'main' } });
  });

  it('loads profiles in a stable order', async () => {
    prisma.profile.findMany.mockResolvedValue([profile]);

    await expect(service.findAll()).resolves.toEqual([profile]);
    expect(prisma.profile.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'asc' } });
  });
});
