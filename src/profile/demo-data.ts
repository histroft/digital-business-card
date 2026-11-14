import { Achievement, Experience, ProfessionalLink, Profile, Project, Skill } from '@prisma/client';

const timestamp = new Date('2026-01-01T00:00:00.000Z');
export const demoProfileId = 'demo-profile';
export const demoExperienceId = 'demo-experience';

export const demoProfile: Profile = {
  id: demoProfileId,
  slug: 'main',
  name: 'Лаптев Тимофей Сергеевич',
  description: 'Python-разработчик с коммерческим проектным опытом разработки веб-приложений, API и инструментов автоматизации. Работаю с Python, Flask, SQL, Git и Linux. Имею опыт интеграции backend с frontend, обработки данных и программной генерации 3D-моделей.',
  createdAt: timestamp,
  updatedAt: timestamp,
};

export const demoLinks: ProfessionalLink[] = [
  { id: 'demo-link-github', profileId: demoProfileId, label: 'GitHub — проект MDF Site', url: 'https://github.com/histroft/mdf_site', sortOrder: 0 },
  { id: 'demo-link-email', profileId: demoProfileId, label: 'Email', url: 'mailto:laptevtims@gmail.com', sortOrder: 1 },
];

export const demoSkills: Skill[] = [
  'Python', 'Flask', 'REST API', 'SQL', 'PostgreSQL', 'SQLite', 'Обработка данных', 'Git', 'Linux', 'HTTP', 'HTML', 'FastAPI', 'Docker', 'Pytest',
].map((name, sortOrder) => ({ id: `demo-skill-${sortOrder}`, profileId: demoProfileId, name, category: null, sortOrder }));

export const demoExperiences: Experience[] = [{
  id: demoExperienceId,
  profileId: demoProfileId,
  company: 'Компания ТОРЭКС',
  position: 'Python-разработчик',
  period: 'Февраль 2026 — Сентябрь 2026',
  sortOrder: 0,
}];

export const demoAchievements: Achievement[] = [
  'Разрабатывал API-эндпоинты на Python и Flask, обеспечивал интеграцию серверной логики с веб-интерфейсом.',
  'Реализовывал взаимодействие frontend и backend, обработку запросов и передачу данных.',
  'Разрабатывал модуль автоматической генерации 3D-моделей на Python на основе DXF-файлов с использованием AI-инструментов.',
  'Работал с геометрией, текстурами и дополнительными 3D-объектами; использовал Open3D и Blender при подготовке моделей к отображению на сайте.',
].map((description, sortOrder) => ({ id: `demo-achievement-${sortOrder}`, experienceId: demoExperienceId, description, sortOrder }));

export const demoProjects: Project[] = [
  { id: 'demo-project-mdf', profileId: demoProfileId, name: 'MDF Site', url: 'https://github.com/histroft/mdf_site', description: 'Educational/personal Next.js project.', sortOrder: 0 },
];
