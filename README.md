# Auth App

**Auth App** is a robust and scalable authentication application built with modern web technologies. It provides essential features for secure user authentication and authorization, including email/password authentication, OAuth support, two-factor authentication, and password reset functionalities.

This project is designed to be extensible and maintainable, leveraging cutting-edge frameworks and tools to ensure high performance and developer efficiency.

## Features

- **Authentication**: Secure email/password login and OAuth integration.
- **Authorization**: Role-based access control and permission management.
- **Password Management**: Password reset with token-based validation.
- **Responsive UI**: Built with ShadCN UI (powered by Radix) and Tailwind CSS for an accessible and responsive interface.
- **Dark Mode**: Seamless dark mode integration using `next-themes`.
- **Form Handling**: Robust validation with React Hook Form and Zod.
- **Email Services**: Integration with [Resend](https://resend.com/) for transactional emails.
- **Theming**: Tailwind CSS with utility-first principles and animations.
- **Database**: Utilizes PostgreSQL for relational data storage, managed efficiently with Prisma ORM.


## Tech Stack

### **Frontend**

- [Next.js 15](https://nextjs.org/) with Turbopack for optimized performance.
- [React 19](https://react.dev/) for UI development.
- [Tailwind CSS](https://tailwindcss.com/) for modern, responsive styling.
- [ShadCN UI](https://shadcn.dev/) leveraging [Radix](https://www.radix-ui.com/) for accessible and customizable components.

### **Authentication & Authorization**

- [Auth.js](https://authjs.dev/) for flexible authentication strategies.
- [Prisma](https://www.prisma.io/) as the ORM for database interactions.
- [PostgreSQL](https://www.postgresql.org/) as the relational database.

### **Backend**

- Server-side actions using Next.js "use server" paradigm.
- Centralized business logic with Zod schemas and utility methods.

### **Utilities**

- [React Hook Form](https://react-hook-form.com/) for form management.
- [Zod](https://zod.dev/) for schema validation.
- [Lucide React](https://lucide.dev/) for modern, customizable icons.

### **Development Tools**

- [TypeScript](https://www.typescriptlang.org/) for type safety.
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality.
- Tailwind Prettier plugin for consistent styling.

## Database Management

Auth App relies on PostgreSQL for its database, leveraging Prisma ORM for seamless schema migrations and type-safe queries. With Docker, managing the database lifecycle, including backups and restores, is streamlined.

- **Backup**: Includes scripts for backing up entire databases or specific ones, with compression options like `gzip`, `brotli`, or `bzip2`.
- **Restore**: Simple restoration commands are available for both entire dumps and specific databases.

## Getting Started

1. Set the env file in the root of the project - there is a sample [here](./.env.sample)
2. Set the env file in the frontend app (webapp) - there is a sample [here](/webapp/.env.sample)

3. Run the server:

```bash
# dev
docker compose -f docker-compose.dev.yml up --watch
```

```bash
# prod multi stage
docker compose -f docker-compose.docker-compose.prod-without-multistage.yml up
```

```bash
# prod
docker compose -f docker-compose.docker-compose.prod.yml up
```

## Backup and restore postgres databeses in docker

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

```sh
# specific db
docker exec -t your_db_container pg_dump -U db_user db_name --clean > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

### gzip

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user | gzip > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

```sh
# specific db
docker exec -t your-db-container pg_dump -U db_user db_name | gzip > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

### brotli or bzip2

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user | brotli --best > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.br
```

```sh
# specific db
docker exec -t your-db-container pg_dump -U db_user db_name | brotli > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user | bzip2 --best > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.bz2
```

```sh
# specific db
docker exec -t your-db-container pg_dump -U db_user db_name | bzip2 > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

### Restore

```sh
# all dbs
cat your_dump.sql | docker exec -i your-db-container psql -U db_user
```

```sh
# specific db
cat your_dump.sql | docker exec -i your-db-container psql -U db_user -d db_name
```
