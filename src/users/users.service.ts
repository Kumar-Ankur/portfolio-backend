import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileModel } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Profile') private readonly ProfileModel: Model<ProfileModel>,
  ) {}

  async insertUserDetail(
    profileName,
    name,
    company,
    overview,
    description,
    experience,
    skills,
  ) {
    const newUser = new this.ProfileModel({
      profileName,
      profile: { name, company, overview, description, experience, skills },
    });
    const result = await newUser.save();
    return result as ProfileModel;
  }

  async getUserData(profileName: string) {
    const userResponse = await this.findUser(profileName);
    return userResponse;
  }

  async updateUser(
    profileName,
    name,
    company,
    overview,
    description,
    experience,
    skills,
  ) {
    const findProduct: any = await this.findUser(profileName);
    if (name) {
      findProduct.profile.name = name;
    }

    if (company) {
      findProduct.profile.company = company;
    }

    if (overview) {
      findProduct.profile.overview = overview;
    }

    if (description) {
      findProduct.profile.description = description;
    }

    if (experience) {
      findProduct.profile.experience = experience;
    }

    if (skills) {
      findProduct.profile.skills = skills;
    }
    const result = await findProduct.save();
    return result;
  }

  async deleteUser(profileName: string) {
    const profile = await this.findUser(profileName);
    await this.ProfileModel.deleteOne({ profileName });
    return {
      message: 'Profile has been deleted successfully',
      response: profile,
    };
  }

  private async findUser(profileName: string): Promise<ProfileModel> {
    let profile;
    try {
      profile = await this.ProfileModel.findOne({ profileName }).exec();
    } catch (error) {
      throw new NotFoundException('could not find profile');
    }

    if (!profile) {
      throw new NotFoundException('could not find profile');
    }
    return profile;
  }
}
