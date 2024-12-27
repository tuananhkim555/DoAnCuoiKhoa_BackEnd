import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService]
})
export class BookingModule {}
