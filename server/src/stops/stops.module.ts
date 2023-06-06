import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StopSchema } from 'src/stops/stops.model';
import { StopsService } from 'src/stops/stops.service';
import { StopsController } from 'src/stops/stops.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'stop', schema: StopSchema }])],
  providers: [StopsService],
  exports: [StopsService],
  controllers: [StopsController],
})
export class StopsModule {}
