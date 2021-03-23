import { FastifyRequest, FastifyReply } from 'fastify';

export interface GqlHttpContext {
  request: FastifyRequest;
  reply: FastifyReply;
}
