import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarSchema } from './cars.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]),
    UsersModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
