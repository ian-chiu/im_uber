import {
  Inject,
  forwardRef,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './tickets.model';
import { UsersService } from '../users/users.service';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CarsService))
    private readonly carsService: CarsService,
  ) {}

  async createTicket(
    passengerUsername: string,
    carId: string,
    boardingStop: string,
    destinationStop: string,
  ) {
    const passenger = await this.usersService.getUserByName(passengerUsername);

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

    const car = await this.carsService.getCarById(ticket.car_id);
    if (!car) {
      throw new NotFoundException(`Car for ID ${ticket.car_id} not found`);
    }

    car.passengers = car.passengers.filter(
      (passenger) => passenger !== passengerUsername,
    );

    await car.save();

    return { message: 'Ticket deleted successfully' };
  }

  async getTicketsByPassenger(passengerUsername: string) {
    const tickets = await this.ticketModel.find({
      passenger: passengerUsername,
    });

    const updatedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const car = await this.carsService.getCarById(ticket.car_id);
        const passengerPhone = (
          await this.usersService.getUserByName(passengerUsername)
        ).phone;
        const departureStop = car.stops.find(
          (e) => e.stopName === ticket.boardingStop,
        );
        const arrivalStop = car.stops.find(
          (e) => e.stopName === ticket.destinationStop,
        );

        if (!departureStop || !arrivalStop) {
          throw new Error('Stop not found');
        }

        return {
          ...ticket.toObject(),
          passenger_phone: passengerPhone,
          departure_time: departureStop.eta,
          arrival_time: arrivalStop.eta,
          ride: car,
        };
      }),
    );

    return updatedTickets;
  }

  async getTicketsByCarId(carId: string) {
    const tickets = await this.ticketModel.find({
      car_id: carId,
    });
    if (!tickets) {
      throw new BadRequestException('No tickets found');
    }

    const updatedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const passenger_phone = (
          await this.usersService.getUserByName(ticket.passenger)
        ).phone;
        return {
          ...ticket.toObject(),
          passenger_phone: passenger_phone,
        };
      }),
    );

    return updatedTickets;
  }

  async calculateTotalPrice(carId: string) {
    const tickets = await this.ticketModel.find({
      car_id: carId,
    });
    if (!tickets) {
      throw new BadRequestException('No tickets found');
    }
    let totalPrice = 0;
    tickets.forEach((ticket) => {
      totalPrice += ticket.price;
    });
    return totalPrice;
  }
}
