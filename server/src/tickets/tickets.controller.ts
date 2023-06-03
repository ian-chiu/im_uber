import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create')
  async createTicket(
    @Req() request,
    @Body('driverUsername') driverUsername: string,
    @Body('boardingStop') boardingStop: string,
    @Body('destinationStop') destinationStop: string,
    @Body('price') price: number,
  ) {
    const passengerUsername = request.session?.passport?.user?.userName;

    const newTicket = await this.ticketsService.createTicket(
      passengerUsername,
      driverUsername,
      boardingStop,
      destinationStop,
      price,
    );

    return newTicket;
  }

  @Post('delete')
  async destroyTicket(@Req() request) {
    const passengerUsername = request.session?.passport?.user?.userName;
    const result = await this.ticketsService.destroyTicket(passengerUsername);
    return result;
  }
}
