import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  //Signup user method with username and password
  async insertUser(username: string, password: string, phone: string) {
    const newUser = new this.userModel({
      username,
      password,
      phone,
    });
    try {
      await newUser.save();
      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
  //log in user using the findOne method
  async getUserByName(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async updateUserRole(
    username: string,
    newRole: string,
  ): Promise<{ username: string; role: string }> {
    if (newRole !== 'driver' && newRole !== 'passenger') {
      throw new BadRequestException('Invalid role');
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { username },
      { role: newRole },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return { username: updatedUser.username, role: updatedUser.role };
  }

  async getUsernames() {
    const users = await this.userModel.find({}, { username: 1 });
    return users;
  }

  async getUsers() {
    // get all users with username and role
    const users = await this.userModel.find({}, { username: 1, role: 1 });
    return users;
  }
}
