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
    driverUsername: string,
    boardingStop: string,
    destinationStop: string,
    price: number,
  ) {
    const passenger = await this.usersService.getUser(passengerUsername);

    if (passenger.role !== 'passenger') {
      throw new BadRequestException('Invalid roles for passenger or driver');
    }

    const car = await this.carsService.getCarByDriver(driverUsername);

    if (!car) {
      throw new BadRequestException(
        'The driver does not have an associated car',
      );
    }

    if (car.passengers && car.passengers.length >= 3) {
      throw new BadRequestException('The car is full');
    }

    const newTicket = new this.ticketModel({
      passenger: passengerUsername,
      driver: driverUsername,
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

    const car = await this.carsService.getCarByDriver(ticket.driver);
    if (!car) {
      throw new NotFoundException(`Car for driver ${ticket.driver} not found`);
    }

    car.passengers = car.passengers.filter(
      (passenger) => passenger !== passengerUsername,
    );

    await car.save();

    return { message: 'Ticket deleted successfully' };
  }
}
