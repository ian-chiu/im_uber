import {
  Param,
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
    @Query('driver') driver?: string,
  ): Promise<Car[]> {
    // The filtering logic should be done in the service
    const cars = await this.carsService.getFilteredCars(
      startStop,
      destStop,
      startTime,
      driver,
    );
    return cars;
  }

  @Post()
  async addCar(
    @Req() request,
    @Body('departure_time') carDepartureTime: Date,
    @Body('stops') carStops: string[],
    @Body('stops_eta') carStopsETA: Date[],
    @Body('license_plate') carLicensePlate: string,
    @Body('seats') carSeats: number,
  ) {
    const driverUsername = request.session?.passport?.user?.userName;
    const generatedId = await this.carsService.insertCar(
      driverUsername,
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

  @Get('eta')
  async calculateETAs(@Req() request) {
    const username = request.session?.passport?.user?.userName;
    await this.carsService.calculateAndSaveETAs(username);
    return { message: 'ETAs calculated and saved successfully' };
  }

  @Post('status')
  async updateCarStatus(
    @Body('car_id') carId: string,
    @Body('status') status: number,
  ) {
    return this.carsService.updateCarStatus(carId, status);
  }

  @Get(':id')
  async getCarInfoById(@Param('id') carId: string) {
    const carInfo = await this.carsService.getCarInfoById(carId);
    return carInfo;
  }

  @Get(':id/gps')
  async getCarGPSPosition(@Param('id') carId: string) {
    const gpsPosition = await this.carsService.getCarGPSPosition(carId);
    return { car_id: carId, gps_position: gpsPosition };
  }

  @Get(':id/revenue')
  async getCarRevenue(@Param('id') carId: string) {
    const revenue = await this.carsService.getCarRevenue(carId);
    return { revenue: revenue };
  }
}
