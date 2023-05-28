import { Controller, Get } from '@nestjs/common';
import { StopsService } from './stops.service';

@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  getStops(): string {
    return this.stopsService.getStops();
  }
}