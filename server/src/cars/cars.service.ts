import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from 'src/cars/cars.model';
import { UsersService } from 'src/users/users.service';
import { StopsService } from 'src/stops/stops.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel('Car') private readonly carModel: Model<Car>,
    private readonly usersService: UsersService,
    private readonly stopsService: StopsService,
  ) {}

  async insertCar(
    driverUsername: string,
    departureTime: Date,
    stops: string[],
    licensePlate: string,
  ) {
    const driver = await this.usersService.getUser(driverUsername);

    if (driver.role !== 'driver') {
      throw new BadRequestException('The driver must have a driver role');
    }

    // Retrieve all stops from the database
    const allStops = await this.stopsService.getStops();
    const allStopNames = new Set(allStops.map((s) => s.name.toLowerCase()));

    // Validate that each stop in the input exists in the database
    for (const stop of stops) {
      if (!allStopNames.has(stop.toLowerCase())) {
        throw new BadRequestException(`Stop '${stop}' does not exist`);
      }
    }

    const newCar = new this.carModel({
      driver: driverUsername,
      departure_time: departureTime,
      stops,
      license_plate: licensePlate,
    });

    try {
      await newCar.save();
      return newCar;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('License plate already exists');
      }
      console.log(error.code);
      throw new InternalServerErrorException();
    }
  }

  async getCars(): Promise<Car[]> {
    const cars = await this.carModel.find().exec();
    return cars;
  }

  async getCarByDriver(driverUsername: string): Promise<Car> {
    const car = await this.carModel.findOne({ driver: driverUsername }).exec();
    if (!car) {
      throw new BadRequestException('No car found for the given driver');
    }
    return car;
  }

  async updateGpsPosition(
    driverUsername: string,
    newGpsPosition: { latitude: number; longitude: number },
  ) {
    const car = await this.getCarByDriver(driverUsername);
    car.gps_position = newGpsPosition;

    try {
      await car.save();
    } catch (error) {
      console.error(`Error while updating GPS position: ${error}`);
      throw new InternalServerErrorException();
    }

    return car;
  }
}
