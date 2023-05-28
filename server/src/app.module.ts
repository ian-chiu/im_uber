import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StopsController } from './stops/stops.controller';
import { StopsService } from './stops/stops.service';

@Module({
  imports: [],
  controllers: [AppController, StopsController],
  providers: [AppService, StopsService],
})
export class AppModule {}
