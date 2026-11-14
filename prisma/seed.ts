import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const value = (key: string, fallback: string): string => process.env[key] || fallback;

async function main(): Promise<void> {
  const profile = await prisma.profile.upsert({
    where: { slug: 'main' },
    update: {
      name: value('PROFILE_NAME', 'Лаптев Тимофей Сергеевич'),
      description: value(
        'PROFILE_DESCRIPTION',
        'Python-разработчик с коммерческим проектным опытом разработки веб-приложений, API и инструментов автоматизации. Работаю с Python, Flask, SQL, Git и Linux. Имею опыт интеграции backend с frontend, обработки данных и программной генерации 3D-моделей.',
      ),
    },
    create: {
      slug: 'main',
      name: value('PROFILE_NAME', 'Лаптев Тимофей Сергеевич'),
      description: value(
        'PROFILE_DESCRIPTION',
        'Python-разработчик с коммерческим проектным опытом разработки веб-приложений, API и инструментов автоматизации. Работаю с Python, Flask, SQL, Git и Linux. Имею опыт интеграции backend с frontend, обработки данных и программной генерации 3D-моделей.',
      ),
    },
  });

  // Clean a project that existed in earlier demo data but has no public link.
  await prisma.project.deleteMany({
    where: { profileId: profile.id, name: 'VPN / Remnawave infrastructure' },
  });

  const links = [
    ['GitHub — проект MDF Site', value('GITHUB_PROJECT_URL', 'https://github.com/histroft/mdf_site')],
    ['Email', `mailto:${value('CONTACT_EMAIL', 'laptevtims@gmail.com')}`],
  ];
  for (const [sortOrder, [label, url]] of links.entries()) {
    await prisma.professionalLink.upsert({
      where: { profileId_label: { profileId: profile.id, label } },
      update: { url, sortOrder },
      create: { profileId: profile.id, label, url, sortOrder },
    });
  }

  const skills = [
    ['Python', 'Backend'],
    ['Flask', 'Backend'],
    ['REST API', 'Backend'],
    ['SQL', 'Data'],
    ['PostgreSQL', 'Data'],
    ['SQLite', 'Data'],
    ['Обработка данных', 'Data'],
    ['Git', 'Tools'],
    ['Linux', 'Tools'],
    ['HTTP', 'Web'],
    ['HTML', 'Web'],
    ['FastAPI', 'Backend'],
    ['Docker', 'Infrastructure'],
    ['Pytest', 'Testing'],
  ];
  for (const [sortOrder, [name, category]] of skills.entries()) {
    await prisma.skill.upsert({
      where: { profileId_name: { profileId: profile.id, name } },
      update: { category, sortOrder },
      create: { profileId: profile.id, name, category, sortOrder },
    });
  }

  const experience = await prisma.experience.upsert({
    where: { profileId_sortOrder: { profileId: profile.id, sortOrder: 0 } },
    update: {
      company: value('EXPERIENCE_COMPANY', 'Компания ТОРЭКС'),
      position: value('EXPERIENCE_POSITION', 'Python-разработчик'),
      period: value('EXPERIENCE_PERIOD', 'Февраль 2026 — Сентябрь 2026'),
    },
    create: {
      profileId: profile.id,
      company: value('EXPERIENCE_COMPANY', 'Компания ТОРЭКС'),
      position: value('EXPERIENCE_POSITION', 'Python-разработчик'),
      period: value('EXPERIENCE_PERIOD', 'Февраль 2026 — Сентябрь 2026'),
      sortOrder: 0,
    },
  });

  const achievements = [
    'Разрабатывал API-эндпоинты на Python и Flask, обеспечивал интеграцию серверной логики с веб-интерфейсом.',
    'Реализовывал взаимодействие frontend и backend, обработку запросов и передачу данных.',
    'Разрабатывал модуль автоматической генерации 3D-моделей на Python на основе DXF-файлов с использованием AI-инструментов.',
    'Работал с геометрией, текстурами и дополнительными 3D-объектами; использовал Open3D и Blender при подготовке моделей к отображению на сайте.',
  ];
  for (const [sortOrder, description] of achievements.entries()) {
    await prisma.achievement.upsert({
      where: { experienceId_sortOrder: { experienceId: experience.id, sortOrder } },
      update: { description },
      create: { experienceId: experience.id, description, sortOrder },
    });
  }

  const projects = [
    {
      name: 'MDF Site',
      url: 'https://github.com/histroft/mdf_site',
      description: 'Educational/personal Next.js project.',
    },
  ];
  for (const [sortOrder, project] of projects.entries()) {
    await prisma.project.upsert({
      where: { profileId_name: { profileId: profile.id, name: project.name } },
      update: { ...project, sortOrder },
      create: { profileId: profile.id, ...project, sortOrder },
    });
  }
}

main()
  .then(() => console.log('Seed completed.'))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
