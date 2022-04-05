import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Get()
  getUsers() {
    return this.userModel.find();
  }

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    const user = new this.userModel({
      displayName: userDto.displayName,
      email: userDto.email,
      password: userDto.password,
      role: userDto.role,
    });

    void user.save();
    return user;
  }
}
