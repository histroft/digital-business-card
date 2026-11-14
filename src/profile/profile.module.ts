import { Module } from '@nestjs/common';
import { ExperienceResolver, ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  providers: [ProfileResolver, ExperienceResolver, ProfileService],
})
export class ProfileModule {}
