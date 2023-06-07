import { Body, UseGuards, Controller, Get, Post } from '@nestjs/common';
import { StopsService } from './stops.service';
import { AuthenticatedGuard } from '../auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Post()
  async addStop(
    @Body('name') stopName: string,
    @Body('latitude') stopLatitude: number,
    @Body('longitude') stopLongitude: number,
  ) {
    const result = await this.stopsService.insertStop(
      stopName,
      stopLatitude,
      stopLongitude,
    );
    return {
      msg: 'Stop successfully added',
      stopId: result.id,
      stopName: result.name,
    };
  }

  @Get()
  async getStops(): Promise<any> {
    const stops = await this.stopsService.getStops();
    const stopOut = stops.map((stop) => {
      return {
        id: stop.id,
        name: stop.name,
        latitude: stop.location.coordinates[1],
        longitude: stop.location.coordinates[0],
      };
    });
    return stopOut;
  }
}
