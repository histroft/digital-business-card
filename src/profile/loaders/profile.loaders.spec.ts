import { createLoaders } from './profile.loaders';

describe('profile relation loaders', () => {
  it('batches relation reads for several profiles into one query', async () => {
    const findMany = jest.fn().mockResolvedValue([
      { id: 'link-1', profileId: 'first', label: 'GitHub', url: 'https://example.com', sortOrder: 0 },
      { id: 'link-2', profileId: 'second', label: 'GitHub', url: 'https://example.org', sortOrder: 0 },
    ]);
    const prisma = {
      professionalLink: { findMany },
      skill: { findMany: jest.fn() },
      experience: { findMany: jest.fn() },
      project: { findMany: jest.fn() },
      achievement: { findMany: jest.fn() },
    };
    const loaders = createLoaders(prisma as never);

    const [first, second] = await Promise.all([
      loaders.linksByProfileId.load('first'),
      loaders.linksByProfileId.load('second'),
    ]);

    expect(findMany).toHaveBeenCalledTimes(1);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
  });
});
