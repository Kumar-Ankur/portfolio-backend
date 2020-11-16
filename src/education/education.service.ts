import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EducationModel } from './education.model';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel('Education')
    private readonly educationModel: Model<EducationModel>,
  ) {}

  async insertEducation(
    degree: string,
    institution: string,
    board: string,
    year: string,
    percentage: number,
  ) {
    const newEducation = new this.educationModel({
      degree,
      institution,
      board,
      year,
      percentage,
    });
    const result = await newEducation.save();
    return result;
  }

  async getEducation() {
    const education = await this.educationModel.find();
    return education;
  }

  async deleteEducation(educationId: string) {
    await this.educationModel.deleteOne({
      _id: educationId,
    });
    return 'education has been deleted successfully';
  }

  async updateEducation(
    educationId: string,
    degree: string,
    institution: string,
    board: string,
    year: string,
    percentage: number,
  ) {
    const education = await this.findEducation(educationId);
    if (degree) {
      education.degree = degree;
    }
    if (institution) {
      education.institution = institution;
    }
    if (board) {
      education.board = board;
    }
    if (year) {
      education.year = year;
    }
    if (percentage) {
      education.percentage = percentage;
    }
    const modifyEducation = await education.save();
    return modifyEducation;
  }

  private async findEducation(id: string): Promise<EducationModel> {
    let user;
    try {
      user = await this.educationModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('could not find the user');
    }

    if (!user) {
      throw new NotFoundException('could not find the user');
    }
    return user;
  }
}
