import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
})
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
