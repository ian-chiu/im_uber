import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StopSchema } from './stops.model';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'stop', schema: StopSchema }])],
  providers: [StopsService],
  exports: [StopsService],
  controllers: [StopsController],
})
export class StopsModule {}
