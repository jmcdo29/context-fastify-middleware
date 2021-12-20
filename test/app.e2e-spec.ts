import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('Middleware should bind to the same custom property', () => {
  describe('Express', () => {
    let app: NestExpressApplication;
    let url: string;
    beforeAll(async () => {
      const modRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = modRef.createNestApplication();
      await app.listen(0);
      url = await app.getUrl();
    });
    afterAll(async () => {
      await app.close();
    });

    it('should have a custom property for GET', async () => {
      await pactum.spec().get(url.replace('[::1]', 'localhost')).expectJson({
        regular: 'hey look!',
      });
    });
    it('should have a custom property for POST', async () => {
      await pactum.spec().post(url.replace('[::1]', 'localhost')).expectJson({
        regular: 'hey look!',
      });
    });
  });
  describe('Fastify', () => {
    let app: NestFastifyApplication;
    let url: string;
    beforeAll(async () => {
      const modRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = modRef.createNestApplication(new FastifyAdapter());
      await app.listen(0);
      url = await app.getUrl();
    });
    afterAll(async () => {
      await app.close();
    });

    it('should have a custom property for GET', async () => {
      await pactum.spec().get(url).expectJson({
        regular: 'hey look!',
      });
    });
    it('should have a custom property for POST', async () => {
      await pactum.spec().post(url).expectJson({
        regular: 'hey look!',
      });
    });
  });
});
