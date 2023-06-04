import { UseGuards, Controller, Post, Body, Get, Req } from '@nestjs/common';
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
}
