import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { demoProfile } from './demo-data';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  findMain(): Promise<Profile | null> {
    if (process.env.DEMO_MODE === 'true') return Promise.resolve(demoProfile);
    return this.prisma.profile.findUnique({ where: { slug: 'main' } });
  }

  findAll(): Promise<Profile[]> {
    if (process.env.DEMO_MODE === 'true') return Promise.resolve([demoProfile]);
    return this.prisma.profile.findMany({ orderBy: { createdAt: 'asc' } });
  }
}
