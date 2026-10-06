# node-gRPC

A Node.js gRPC task service with an Express HTTP gateway. Tasks are stored in memory and reset when the gRPC server restarts.

Requires Node.js 22.13+ (Node.js 24 recommended) and npm.

```sh
npm ci
npm run start:server
```

In a second terminal:

```sh
npm start
```

The gRPC service listens at `localhost:50051`; the HTTP gateway listens on port `3000`. Set `GRPC_ADDRESS` for both processes to change the gRPC address and `PORT` to change the HTTP port. Local development uses insecure gRPC credentials.

For automatic restarts, use `npm run start-dev:server` and `npm run start-dev:client`. Native ES modules run directly; no Babel build is needed.

| Method | Endpoint            | Body                                   | Success                    |
| ------ | ------------------- | -------------------------------------- | -------------------------- |
| GET    | `/api/v1/tasks`     | —                                      | 200, `{ "result": [...] }` |
| POST   | `/api/v1/tasks`     | `{ "title": "Title", "body": "Text" }` | 201, created task          |
| PUT    | `/api/v1/tasks/:id` | `{ "title": "Title", "body": "Text" }` | 200, updated task          |
| DELETE | `/api/v1/tasks/:id` | —                                      | 204                        |

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"First task","body":"Try gRPC"}'
```

Run `npm run check` for ESLint, Prettier, and integration tests. Use `npm run format:write` to format files. CI checks Node.js 22 and 24.

Original reference: [Build a gRPC service in NodeJS](https://daily.dev/blog/build-a-grpc-service-in-nodejs).

## Code structure

- `src/tasks/`: task validation, domain errors, business operations, and the in-memory repository. These modules have no HTTP or gRPC dependencies; the service receives its repository and ID generator.
  
- `src/server/handlers.js`: translates gRPC requests and domain errors. `server.js` creates and binds the server; `index.js` wires the repository and service and manages process lifecycle.
  
- `src/client/gateway.js`: adapts the gRPC client to task operations, with deadlines and error translation.
  
- `src/client/routes.js`: handles HTTP requests and responses. `error-handler.js` maps errors to HTTP status codes; `app.js` configures middleware and routes.
  
- `src/client/index.js`: wires the gateway and HTTP app and manages process lifecycle.
  
- `src/proto/`: shared protobuf contract and loader.

Factories receive their dependencies so storage, business rules, and transport adapters can be tested or replaced independently.
