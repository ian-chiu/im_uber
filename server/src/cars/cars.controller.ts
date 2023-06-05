import {
  Query,
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './cars.model';
import { AuthenticatedGuard } from 'src/auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getFilteredCars(
    @Query('start_stop') startStop?: string,
    @Query('dest_stop') destStop?: string,
    @Query('start_time') startTime?: Date,
  ): Promise<Car[]> {
    // The filtering logic should be done in the service
    const cars = await this.carsService.getFilteredCars(
      startStop,
      destStop,
      startTime,
    );
    return cars;
  }

  @Post()
  async addCar(
    @Body('driver_name') carDriver: string,
    @Body('departure_time') carDepartureTime: Date,
    @Body('stops') carStops: string[],
    @Body('stops_eta') carStopsETA: Date[],
    @Body('license_plate') carLicensePlate: string,
    @Body('seats') carSeats: number,
  ) {
    const generatedId = await this.carsService.insertCar(
      carDriver,
      carDepartureTime,
      carStops,
      carStopsETA,
      carLicensePlate,
      carSeats,
    );
    return { id: generatedId };
  }

  @Post('update-gps')
  async updateGps(
    @Req() request,
    @Body('gps_position')
    newGpsPosition: { latitude: number; longitude: number },
  ) {
    const username = request.session?.passport?.user?.userName;
    await this.carsService.updateGpsPosition(username, newGpsPosition);
    return { message: 'GPS position updated successfully' };
  }

  // cars.controller.ts
  @Get('eta')
  async calculateETAs(@Req() request) {
    const username = request.session?.passport?.user?.userName;
    await this.carsService.calculateAndSaveETAs(username);
    return { message: 'ETAs calculated and saved successfully' };
  }
}
