# Fastify Adapter Middleware Properties on a Different Context

When running middleware, it's common for us to want to attach properties to the `req` object to be able to access them later. Pino and MikroORM both do this, and apparently use `AsyncLocalStorage` to help stay away from needing to `REQUEST` scope providers (which is honestly really nice). With Express, this works just fine, because Express's `Request` is Node's `IncomingRequest` object. With Fastify, however, it is a `FastifyRequest` which is a wrapper around `IncomingRequest`. With the use of `middie` we are able to apply express-like middleware to Fastify, which helps the merging of the frameworks inside of Nest. It appears though that `req.custom` applies to different property than expected, meaning that the retrieval by ALS doesn't work properly

## Current Behavior

When running the following Nest middleware

```ts
export class AppModule implements NestModule {
  constructor(private readonly appHost: HttpAdapterHost) {}
  configure(consumer: MiddlewareConsumer) {
    const isFastify = this.appHost.httpAdapter instanceof FastifyAdapter;
    consumer
      .apply((req, res, next) => {
        console.log('In Middleware');
        req.custom = 'hey look!';
        next();
      })
      .forRoutes(isFastify ? '(.*)' : '*');
  }
}
```

we have two different behaviors.

### In Express

We can do `@Req()` and get the property with `req.custom` in a controller

### In Fastify

We an do `@Req()` and get the property with `req.raw.custom` in a controller

## Expected Behavior

Regardless of the adapter used `req.custom` should get the custom property

## Steps to Reproduce

`pnpm i`/`npm i`/`yarn`
`pnpm test:e2e`/`npm run test:e2e`/`yarn test:e2e`

See the test fail