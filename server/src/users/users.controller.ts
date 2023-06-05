import {
  UseGuards,
  Controller,
  Get,
  Post,
  Req,
  NotFoundException,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('role')
  async getRole(@Req() request): Promise<string> {
    const username = request.session?.passport?.user?.userName;
    if (!username) {
      throw new NotFoundException('No user is currently logged in');
    }

    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    return user.role;
  }

  @Post('role')
  async updateRole(
    @Req() request,
    @Body('role') newRole: string,
  ): Promise<any> {
    const username = request.session?.passport?.user?.userName;
    if (!username) {
      throw new BadRequestException('No user is currently logged in');
    }

    const currentUser = await this.usersService.getUser(username);
    if (!currentUser) {
      throw new BadRequestException(`User ${username} not found`);
    }

    const updatedUser = await this.usersService.updateUserRole(
      username,
      newRole,
    );

    return {
      message: 'User role updated successfully',
      user: {
        username: currentUser.username,
        oldRole: currentUser.role,
        newRole: updatedUser.role,
      },
    };
  }

  @Get('name')
  async getUsername(@Req() request): Promise<any> {
    const username = request.session?.passport?.user?.userName;
    if (!username) {
      throw new BadRequestException('No user is currently logged in');
    }
    return { username };
  }

  @Get('names')
  async getUsernames(): Promise<any> {
    const usernames = await this.usersService.getUsernames();
    if (!usernames) {
      throw new BadRequestException('No Users exist');
    }
    return usernames;
  }

  @Get()
  async getUsers(): Promise<any> {
    const users = await this.usersService.getUsers();
    if (!users) {
      throw new BadRequestException('No Users exist');
    }
    return users;
  }
}
