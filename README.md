# Digital Business Card API

Небольшой backend-проект для тестового задания. Он отдаёт «цифровую визитку» через GraphQL: профиль, профессиональные ссылки, навыки, опыт и проекты. Реализация использует TypeScript, NestJS, Apollo Server/Sandbox, Prisma, PostgreSQL, Docker Compose и Git.

## Быстрый запуск

Нужен Docker Desktop с Docker Compose. В корне проекта выполните:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

После первого запуска Docker Compose:

1. поднимет чистую PostgreSQL 16;
2. применит миграцию Prisma;
3. выполнит повторяемый seed;
4. запустит API на `http://localhost:3000/graphql`.

Страница `/graphql` открывает встроенный **Apollo Sandbox**. Остановить сервисы: `docker compose down`. Чтобы также удалить тестовую БД: `docker compose down -v`.

### Локальный запуск без контейнера API

Это удобно при разработке. PostgreSQL всё ещё можно запустить контейнером, а API — на машине:

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run db:seed
npm run start:dev
```

Проект рассчитан на Node.js 24 LTS. Версии зависимостей ограничены совместимыми мажорными версиями в `package.json`; после первого `npm install` npm создаст `package-lock.json` с точными версиями для воспроизводимых последующих запусков.

Если PostgreSQL недоступна, можно лишь посмотреть API-интерфейс и тестовые данные без подключения к БД: в `.env` задайте `DEMO_MODE=true`, затем выполните `npm run start`. Этот режим предназначен только для локального предпросмотра; Docker Compose всегда запускает PostgreSQL и использует `DEMO_MODE=false`.

### Публикация на Vercel

Репозиторий содержит serverless entry point `api/index.ts` и `vercel.json`. Публичная версия запускается с `DEMO_MODE=true`, поэтому не требует размещённой базы данных и позволяет работодателю сразу проверить GraphQL Sandbox.

```powershell
npx vercel login
npx vercel --prod
```

Vercel выдаст публичный URL. В production-варианте с PostgreSQL добавьте `DATABASE_URL` и установите `DEMO_MODE=false` в настройках проекта Vercel.

## Проверка GraphQL

Откройте `http://localhost:3000/graphql` и выполните:

```graphql
query DigitalBusinessCard {
  profile {
    name
    description
    professionalLinks {
      label
      url
    }
    skills {
      name
      category
    }
    experiences {
      company
      position
      period
      achievements {
        description
      }
    }
    projects {
      name
      url
      description
    }
  }
}
```

`profile` возвращает главную визитку. Запрос `profiles` оставлен также: он позволяет показать, что вложенные поля не создают N+1 запросов.

## Настройка данных перед отправкой

Визитка заполнена данными из резюме: имя, почта, подтверждённый GitHub-проект, опыт в ТОРЭКС, навыки и задачи. Конфигурация остаётся доступной через `.env`.

Перед показом или отправкой измените в `.env`:

```dotenv
PROFILE_NAME="Лаптев Тимофей Сергеевич"
GITHUB_PROJECT_URL="https://github.com/histroft/mdf_site"
CONTACT_EMAIL="laptevtims@gmail.com"
EXPERIENCE_COMPANY="Компания ТОРЭКС"
EXPERIENCE_POSITION="Python-разработчик"
EXPERIENCE_PERIOD="Февраль 2026 — Сентябрь 2026"
```

Затем повторно выполните `docker compose up --build` или `npm run db:seed`. Seed использует `upsert` и составные уникальные ключи: его безопасно запускать сколько угодно раз — дубликатов не будет. Задачи из опыта работы перенесены в массив `achievements` в `prisma/seed.ts`.


## Архитектура

```text
GraphQL resolver
  ├── ProfileService ── Prisma ── PostgreSQL
  └── request-scoped DataLoaders ── relation queries
        profile IDs / experience IDs batched in one IN (...) query
```

- **Code-first GraphQL**: типы и схема следуют из TypeScript-декораторов; `schema.gql` генерируется при старте и не хранится в Git.
- **Prisma**: хранит схему, миграцию и явные связи. У всех дочерних таблиц есть составные уникальные ключи для корректного `upsert` в seed.
- **Нет N+1**: для каждой GraphQL-операции создаётся набор DataLoader. Например, `profiles { skills projects }` выполняет одну выборку профилей, одну выборку навыков и одну выборку проектов, а не по запросу на каждый профиль.
- **Граница ответственности**: resolver только адаптирует GraphQL, service получает корневой ресурс, Prisma работает с БД. Это позволяет позже добавить мутации, авторизацию или S3 без переписывания модели.
- **Docker**: PostgreSQL имеет отдельный volume; API ждёт healthcheck БД, применяет миграции и seed при старте.

## Тесты и полезные команды

```powershell
npm install
npm test
npm run build
npm run prisma:generate
npm run db:seed
```

Тесты проверяют получение главного профиля и батчинг DataLoader для нескольких профилей — ключевую защиту от N+1. Проверку миграции и seed с новой БД выполняет первый запуск `docker compose up --build`.

## Что легко поменять на собеседовании

- Добавить `Mutation` для редактирования визитки: DTO + validation, сервис и `prisma.*.upsert`.
- Сделать несколько визиток: запрос уже есть (`profiles`), достаточно убрать допущение о slug `main` и добавить аргумент `slug`.
- Добавить аватары/файлы: модель `Asset`, S3-адаптер за интерфейсом и presigned upload URL.
- Добавить фильтрацию навыков или pagination: GraphQL arguments и Prisma `where/take/cursor`.
- Добавить авторизацию: Guard вокруг мутаций, при этом публичный `profile` останется доступным без токена.

## Структура

```text
src/
  prisma/                 Prisma service
  profile/                resolver, service, models, request DataLoaders and tests
prisma/
  schema.prisma           database model
  migrations/             checked-in SQL migration
  seed.ts                 idempotent demo-data seed
Dockerfile                API image
docker-compose.yml        API + PostgreSQL
```
