import {
  Catch,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements GqlExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError): any {
    switch (exception.code) {
      case 'P2002': {
        throw new ConflictException(exception.message);
      }
      case 'P2003': {
        throw new UnprocessableEntityException(exception.message);
      }
      case 'P2025': {
        throw new NotFoundException(exception.message);
      }
      default:
        break;
    }

    throw new InternalServerErrorException(exception.message);
  }
}
