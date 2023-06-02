import { UseGuards, Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './cars.model';
import { AuthenticatedGuard } from 'src/auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getAllRides(): Promise<Car[]> {
    const cars = await this.carsService.getCars();
    return cars;
  }

  @Post()
  async addCar(
    @Body('driver') carDriver: string,
    @Body('departure_time') carDepartureTime: Date,
    @Body('stops') carStops: string[],
    @Body('license_plate') carLicensePlate: string,
  ) {
    console.log(carDriver, carDepartureTime, carStops, carLicensePlate);
    const generatedId = await this.carsService.insertCar(
      carDriver,
      carDepartureTime,
      carStops,
      carLicensePlate,
    );
    return { id: generatedId };
  }

  @Get(':id')
  getCar(@Param('id') carId: string) {
    return this.carsService.getCar(carId);
  }
}
