// tickets.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsService } from 'src/tickets/tickets.service';
import { TicketSchema } from 'src/tickets/tickets.model';
import { UsersModule } from 'src/users/users.module';
import { CarsModule } from 'src/cars/cars.module';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    UsersModule,
    CarsModule,
  ],
  providers: [TicketsService],
  exports: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
