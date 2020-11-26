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
    profileName: string,
    degree: string,
    institution: string,
    board: string,
    year: string,
    percentage: number,
  ) {
    const educationDetail: any = await this.educationModel.findOne({
      profileName,
    });
    const educationObj = {
      degree,
      institution,
      board,
      year,
      percentage,
    };
    if (!educationDetail) {
      const newEducation = new this.educationModel({
        profileName,
        education: [educationObj],
      });
      const result = await newEducation.save();
      return result;
    } else {
      educationDetail.education = [...educationDetail.education, educationObj];
      const result = await educationDetail.save();
      return result;
    }
  }

  async getEducation(profileName: string) {
    const education = await this.educationModel.findOne({ profileName });
    if (!education) {
      return {
        status: 'fail',
        message: `no education detail found for this ${profileName} profile`,
      };
    }
    return education;
  }

  async deleteEducationById(profileName: string, educationId: string) {
    const getEducationDetail = await this.findEducation(profileName);
    const updatedEducation = getEducationDetail['education'].filter(
      (education: EducationModel) => {
        return education.id !== educationId;
      },
    );
    getEducationDetail['education'] = updatedEducation;
    const result = await getEducationDetail.save();
    return result;
  }

  async deleteEducation(profileName: string) {
    const getEducationDetail = await this.findEducation(profileName);
    if (!getEducationDetail) {
      return {
        message: `Profile: ${profileName} does not exixts`,
        status: 'fail',
      };
    }
    await this.educationModel.deleteOne({ profileName });
    return {
      message: 'Education Detail has been deleted successfully',
      educationDetail: getEducationDetail,
    };
  }

  async updateEducation(
    profileName: string,
    educationId: string,
    degree: string,
    institution: string,
    board: string,
    year: string,
    percentage: number,
  ) {
    const getEducationDetail = await this.findEducation(profileName);
    const updatedEducationIndex = this.getEducationIndex(
      getEducationDetail['education'],
      educationId,
    );
    if (updatedEducationIndex !== -1) {
      if (degree) {
        getEducationDetail['education'][updatedEducationIndex].degree = degree;
      }
      if (institution) {
        getEducationDetail['education'][
          updatedEducationIndex
        ].institution = institution;
      }
      if (board) {
        getEducationDetail['education'][updatedEducationIndex].board = board;
      }
      if (year) {
        getEducationDetail['education'][updatedEducationIndex].year = year;
      }
      if (percentage) {
        getEducationDetail['education'][
          updatedEducationIndex
        ].percentage = percentage;
      }
      const modifyEducation = await getEducationDetail.save();
      return modifyEducation;
    } else {
      return {
        message: `Education details is not present in ${profileName} profile with education id ${educationId}`,
        status: 'fail',
      };
    }
  }

  private getEducationIndex(educations: [EducationModel], educationId: string) {
    for (let i = 0; i < educations.length; i++) {
      if (educations[i].id === educationId) {
        return i;
      }
    }
    return -1;
  }

  private async findEducation(profileName: string): Promise<EducationModel> {
    let education;
    try {
      education = await this.educationModel.findOne({ profileName }).exec();
    } catch (error) {
      throw new NotFoundException(
        `could not find the education details for ${profileName} profile`,
      );
    }

    if (!education) {
      throw new NotFoundException(
        `could not find the education details for ${profileName} profile`,
      );
    }
    return education;
  }
}
