import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from 'src/tickets/tickets.model';
import { UsersService } from 'src/users/users.service';
import { CarsService } from 'src/cars/cars.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private readonly usersService: UsersService,
    private readonly carsService: CarsService,
  ) {}

  async createTicket(
    passengerUsername: string,
    carId: string,
    boardingStop: string,
    destinationStop: string,
  ) {
    const passenger = await this.usersService.getUser(passengerUsername);

    if (passenger.role !== 'passenger') {
      throw new BadRequestException('Invalid roles for passenger or driver');
    }

    const car = await this.carsService.getCarById(carId);

    if (!car) {
      throw new BadRequestException(
        'The car does not exist or has been deleted',
      );
    }

    if (car.passengers && car.passengers.length >= car.seats) {
      throw new BadRequestException('The car is full');
    }

    if (car.passengers.includes(passengerUsername)) {
      throw new BadRequestException('The passenger is already in the car');
    }

    const boardingETA = car.stops.find((e) => e.stopName === boardingStop).eta;
    const destinationETA = car.stops.find(
      (e) => e.stopName === destinationStop,
    ).eta;
    const price = Math.floor(
      (destinationETA.getTime() - boardingETA.getTime()) / (1000 * 60),
    );

    const newTicket = new this.ticketModel({
      passenger: passengerUsername,
      car_id: carId,
      boardingStop,
      destinationStop,
      price,
    });

    await newTicket.save();

    // Add the passenger to the car
    car.passengers.push(passengerUsername);
    await car.save();

    return newTicket;
  }

  async destroyTicket(passengerUsername: string) {
    const ticket = await this.ticketModel.findOneAndDelete({
      passenger: passengerUsername,
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket for ${passengerUsername} not found`);
    }

    const car = await this.carsService.getCarByDriver(ticket.car_id);
    if (!car) {
      throw new NotFoundException(`Car for ID ${ticket.car_id} not found`);
    }

    car.passengers = car.passengers.filter(
      (passenger) => passenger !== passengerUsername,
    );

    await car.save();

    return { message: 'Ticket deleted successfully' };
  }
}
