import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsService } from './tickets.service';
import { TicketSchema } from './tickets.model';
import { UsersModule } from '../users/users.module';
import { CarsModule } from '../cars/cars.module';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    UsersModule,
    forwardRef(() => CarsModule),
  ],
  providers: [TicketsService],
  exports: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
