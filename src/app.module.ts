import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'node:path';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfileModule } from './profile/profile.module';
import { createLoaders } from './profile/loaders/profile.loaders';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        // Vercel functions have a read-only filesystem; generate the schema in memory there.
        autoSchemaFile: process.env.VERCEL ? true : join(process.cwd(), 'schema.gql'),
        sortSchema: true,
        introspection: true,
        playground: false,
        // Apollo's local landing page embeds Apollo Sandbox at /graphql.
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        context: () => ({ loaders: createLoaders(prisma) }),
      }),
    }),
    ProfileModule,
  ],
})
export class AppModule {}
