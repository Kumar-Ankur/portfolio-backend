import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly UserModel: Model<UserModel>,
  ) {}

  async insertUserDetail(
    name,
    company,
    overview,
    description,
    experience,
    skills,
  ) {
    const newUser = new this.UserModel({
      name,
      company,
      overview,
      description,
      experience,
      skills,
    });
    const result = await newUser.save();
    return result as UserModel;
  }

  async getUserData() {
    const userResponse = this.UserModel.find();
    return userResponse;
  }

  async updateUser(
    userId,
    name,
    company,
    overview,
    description,
    experience,
    skills,
  ) {
    const findProduct = await this.findUser(userId);
    if (name) {
      findProduct.name = name;
    }

    if (company) {
      findProduct.company = company;
    }

    if (overview) {
      findProduct.overview = overview;
    }

    if (description) {
      findProduct.description = description;
    }

    if (experience) {
      findProduct.experience = experience;
    }

    if (skills) {
      findProduct.skills = skills;
    }
    const result = await findProduct.save();
    return result;
  }

  async deleteUser(userId: string) {
    await this.UserModel.deleteOne({ _id: userId });
    return 'User has been delete successfully';
  }

  private async findUser(id: string): Promise<UserModel> {
    let user;
    try {
      user = await this.UserModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('could not find the user');
    }

    if (!user) {
      throw new NotFoundException('could not find the user');
    }
    return user;
  }
}
