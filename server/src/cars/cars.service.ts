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

@Injectable()
export class CarsService {
  constructor(
    @InjectModel('Car') private readonly carModel: Model<Car>,
    private readonly usersService: UsersService,
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
    const utcDate = new Date(departureTime).toISOString();
    const newCar = new this.carModel({
      driver: driverUsername,
      departure_time: utcDate,
      stops,
      license_plate: licensePlate,
    });

    console.log(newCar);

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

  async getCar(license_plate: string) {
    const car = await this.carModel.findOne({ license_plate });
    return car;
  }

  async getCars(): Promise<Car[]> {
    const cars = await this.carModel.find().exec();
    return cars;
  }
}
