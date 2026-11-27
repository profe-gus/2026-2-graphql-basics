# GraphQL Basics

A GraphQL API built with NestJS, Apollo, TypeORM and PostgreSQL. It manages students and their grades, with JWT authentication and role-based access.

## Quick start

Requirements: Node.js 24, pnpm, and a running PostgreSQL server with an empty database.

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=<database>
   DB_USERNAME=<user>
   DB_PASSWORD=<password>
   JWT_SECRET=<long-random-string>
   ```

3. Start the server:

   ```bash
   pnpm run start:dev
   ```

4. Open <http://localhost:9000/graphql>.

The tables are created automatically because TypeORM runs with `synchronize: true`. Do not use that setting in production.

## Authentication

1. Run `signup` or `login` and copy the returned `token`. It expires after 1 hour.
2. Send it with every protected operation:

   ```
   Authorization: Bearer <token>
   ```

New users get the `teacher` role. Other roles (`admin`, `super-user`) must be assigned directly in the database.

## Operations

| Operation | Type | Allowed roles |
|-----------|------|---------------|
| `signup` | Mutation | Public |
| `login` | Mutation | Public |
| `students` | Query | Public |
| `student` | Query | Public |
| `createStudent` | Mutation | `admin`, `teacher` |
| `updateStudent` | Mutation | `teacher` |
| `removeStudent` | Mutation | `super-user` |

The full schema is generated into [`src/schema.gql`](src/schema.gql).

### Input rules

| Field | Rule |
|-------|------|
| `password` | 8 to 16 characters |
| `gender` | `Male`, `Female` or `Other` |
| `age` | Positive integer |
| `limit`, `skip` | Positive integers. Omit `skip` to start from the first record. |
| `student(term:)` | An id, a name or a nickname |

### Example

```graphql
mutation CreateStudent($createStudentInput: CreateStudentInput!) {
  createStudent(createStudentInput: $createStudentInput) {
    id
    name
    grades { subject grade }
  }
}
```

```json
{
  "createStudentInput": {
    "name": "Juan",
    "age": 20,
    "email": "juan@test.com",
    "isActive": true,
    "gender": "Male",
    "favoriteSubjects": ["math"],
    "grades": [{ "subject": "math", "grade": 5 }]
  }
}
```

`removeStudent` returns `null` on success.

## Postman collection

Import [`postman/graphql-basics.postman_collection.json`](postman/graphql-basics.postman_collection.json), then:

1. Run **Signup** once, then **Login**. The token is stored automatically.
2. Run **Create student**. Its id is stored automatically.
3. Run any other request.

The collection variables `baseUrl`, `email` and `password` can be changed to match your setup.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm run start:dev` | Run in watch mode |
| `pnpm run build` | Compile to `dist/` |
| `pnpm run start:prod` | Run the compiled build |
| `pnpm run lint` | Lint and fix |
| `pnpm run format` | Format with Prettier |
| `pnpm run test` | Run unit tests |

## Known limitations

- `skip: 0` is rejected by validation.
- There are no unit tests yet. Jest also cannot currently load `@nestjs/graphql` (ES module cycle).
