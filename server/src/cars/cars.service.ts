import {
  Inject,
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
    @Inject('GoogleMapsService') private googleMapsClient,
  ) {}

  async insertCar(
    driverUsername: string,
    departureTime: Date,
    stopNames: string[],
    stopETAs: Date[],
    licensePlate: string,
    seats: number,
  ) {
    const driver = await this.usersService.getUser(driverUsername);

    if (driver.role !== 'driver') {
      throw new BadRequestException('The driver must have a driver role');
    }

    // Retrieve all stops from the database
    const allStops = await this.stopsService.getStops();
    const allStopNames = new Set(allStops.map((s) => s.name.toLowerCase()));

    // Validate that each stop in the input exists in the database
    for (const stopName of stopNames) {
      if (!allStopNames.has(stopName.toLowerCase())) {
        throw new BadRequestException(`Stop '${stopName}' does not exist`);
      }
    }

    // Construct the stops with eta as provided
    const stops = stopNames.map((name, index) => ({
      stopName: name,
      eta: stopETAs[index],
    }));

    const newCar = new this.carModel({
      driver: driverUsername,
      departure_time: departureTime,
      stops,
      license_plate: licensePlate,
      seats,
    });

    try {
      await newCar.save();
      return newCar;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('License plate already exists');
      }
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

  async calculateETAs(car: Car) {
    const origin = [car.gps_position.latitude, car.gps_position.longitude];

    // Retrieve all stops from the database
    const allStops = await this.stopsService.getStops();
    const stopDict = new Map(
      allStops.map((stop) => [stop.name.toLowerCase(), stop]),
    );

    const destinations = car.stops.map((stop) => {
      const stopDetail = stopDict.get(stop.stopName.toLowerCase());
      if (!stopDetail) {
        throw new InternalServerErrorException(
          `Stop '${stop.stopName}' not found`,
        );
      }
      return stopDetail.location.coordinates.reverse();
    });

    this.googleMapsClient
      .distancematrix({
        params: {
          origins: [origin],
          destinations: destinations,
          mode: 'driving',
          key: process.env.GOOGLE_MAP_API_KEY,
        },
        timeout: 1000, // milliseconds
      })
      .then((result) => {
        if (result.status === 200) {
          const elements = result.data.rows[0].elements;
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.status === 'OK') {
              const duration = element.duration.value;
              const currentETA = new Date();
              currentETA.setSeconds(currentETA.getSeconds() + duration);
              car.stops[i].eta = currentETA;
            }
          }
          car.save();
        } else {
          throw new InternalServerErrorException('Error calculating ETAs');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async calculateAndSaveETAs(driverUsername: string) {
    const car = await this.getCarByDriver(driverUsername);
    await this.calculateETAs(car);
  }

  async getFilteredCars(
    startStopName?: string,
    destStopName?: string,
    startTime?: Date,
  ): Promise<Car[]> {
    const cars = await this.getCars();

    return cars.filter((car) => {
      let startStopIndex = -1;
      let destStopIndex = -1;

      for (let i = 0; i < car.stops.length; i++) {
        const stop = car.stops[i];
        if (stop.stopName === startStopName) {
          startStopIndex = i;
        }
        if (stop.stopName === destStopName) {
          destStopIndex = i;
        }
      }
      if (startStopName) {
        // The car has not passed the start stop or dest stop
        if (startStopIndex === -1) {
          return false;
        }
      }
      if (destStopName) {
        if (destStopIndex === -1) {
          return false;
        }
      }
      // The car's ETA is not too late compared to the passenger's start time
      if (startTime) {
        const passengerStartTime = new Date(startTime);
        if (startStopName && startStopIndex !== -1) {
          const carStartTime = new Date(car.stops[startStopIndex].eta);
          if (carStartTime < passengerStartTime) {
            return false;
          }
        }
        if (destStopName && destStopIndex !== -1) {
          const carDestTime = new Date(car.stops[destStopIndex].eta);
          if (carDestTime < passengerStartTime) {
            return false;
          }
        }
      }

      return true;
    });
  }

  async getCarById(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).exec();
    if (!car) {
      throw new BadRequestException('No car found with the given ID');
    }
    return car;
  }
}
