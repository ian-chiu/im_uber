import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarSchema } from './cars.model';
import { UsersModule } from 'src/users/users.module';
import { StopsModule } from 'src/stops/stops.module';
import { Client } from '@googlemaps/google-maps-services-js';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]),
    UsersModule,
    StopsModule,
    forwardRef(() => TicketsModule),
  ],
  controllers: [CarsController],
  providers: [
    CarsService,
    {
      provide: 'GoogleMapsService',
      useValue: new Client({}),
    },
  ],
  exports: [CarsService, 'GoogleMapsService'],
})
export class CarsModule {}
