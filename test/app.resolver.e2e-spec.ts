import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';
// import { Chance } from 'chance';

import { AppModule } from './../src/app.module';

// const chance = new Chance();

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('me (Query)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
          me {
            id
            email
            username
          }
        }`,
      })
      .expect(200)
      .expect(({ body: { errors } }) => {
        expect(errors).toBeDefined();
      });
  });
});
