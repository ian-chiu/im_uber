import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthenticatedGuard } from '../auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create')
  async createTicket(
    @Req() request,
    @Body('car_id') carId: string,
    @Body('boardingStop') boardingStop: string,
    @Body('destinationStop') destinationStop: string,
  ) {
    const passengerUsername = request.session?.passport?.user?.userName;

    const newTicket = await this.ticketsService.createTicket(
      passengerUsername,
      carId,
      boardingStop,
      destinationStop,
    );

    return newTicket;
  }

  @Post('delete')
  async destroyTicket(@Req() request) {
    const passengerUsername = request.session?.passport?.user?.userName;
    const result = await this.ticketsService.destroyTicket(passengerUsername);
    return result;
  }

  @Get()
  async getTicket(@Req() request) {
    const passengerUsername = request.session?.passport?.user?.userName;
    const result = await this.ticketsService.getTicketsByPassenger(
      passengerUsername,
    );
    return result;
  }
}
