import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfficialModel } from './official.model';

@Injectable()
export class OfficialService {
  constructor(
    @InjectModel('Official')
    private readonly officialModel: Model<OfficialModel>,
  ) {}

  async insertOfficialProject(
    profileName: string,
    employer: string,
    client: string,
    projectDescription: string[],
    role: string,
    teamSize: number,
    responsibility: string[],
  ) {
    const getOfficialProjectDetail = await this.officialModel.findOne({
      profileName,
    });
    const newOfficialProject = {
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    };

    if (!getOfficialProjectDetail) {
      const newProject = new this.officialModel({
        profileName,
        officialProject: newOfficialProject,
      });
      const result = await newProject.save();
      return result;
    } else {
      getOfficialProjectDetail['officialProject'] = [
        ...getOfficialProjectDetail['officialProject'],
        newOfficialProject,
      ];
      const result = await getOfficialProjectDetail.save();
      return result;
    }
  }

  async fetchedProject(profileName: string) {
    const getOfficialProjectDetail = await this.officialModel.findOne({
      profileName,
    });
    if (!getOfficialProjectDetail) {
      return {
        message: `No official project records find for ${profileName} profile`,
        status: 'fail',
      };
    }
    return getOfficialProjectDetail;
  }

  async deleteOfficialProjectById(profileName: string, projectId: string) {
    const getOfficialProjectDetail = await this.officialModel.findOne({
      profileName,
    });
    if (!getOfficialProjectDetail) {
      return {
        message: `official project having ID: ${projectId} does not find in profile ${profileName}`,
        status: 'fail',
      };
    }
    const updatedOfficialProject = getOfficialProjectDetail[
      'officialProject'
    ].filter((project: OfficialModel) => {
      return project.id !== projectId;
    });
    getOfficialProjectDetail['officialProject'] = updatedOfficialProject;
    const result = await getOfficialProjectDetail.save();
    return {
      message: `Official project for profile ${profileName} having ID: ${projectId} has been deleted successfully`,
      deletedOfficialProject: result,
    };
  }

  async deleteOfficialProject(profileName: string) {
    const getOfficialProjectDetail = await this.officialModel.findOne({
      profileName,
    });
    if (!getOfficialProjectDetail) {
      return {
        message: `Profile: ${profileName} does not exixts`,
        status: 'fail',
      };
    }
    await this.officialModel.deleteOne({ profileName });
    return {
      message: `Profile Detail has been deleted successfully for profile: ${profileName}`,
      profileDetail: getOfficialProjectDetail,
    };
  }

  async updateProject(
    profileName: string,
    projectId: string,
    employer: string,
    client: string,
    projectDescription: string[],
    role: string,
    teamSize: number,
    responsibility: string[],
  ) {
    const getOfficialProjectDetail = await this.officialModel.findOne({
      profileName,
    });
    if (!getOfficialProjectDetail) {
      return {
        message: `Profile: ${profileName} does not exixts`,
        status: 'fail',
      };
    }
    const updatedProjectIndex = this.getOfficialProjectIndex(
      getOfficialProjectDetail['officialProject'],
      projectId,
    );

    if (updatedProjectIndex !== -1) {
      if (employer) {
        getOfficialProjectDetail['officialProject'][
          updatedProjectIndex
        ].employer = employer;
      }
      if (client) {
        getOfficialProjectDetail['officialProject'][
          updatedProjectIndex
        ].client = client;
      }
      if (projectDescription) {
        getOfficialProjectDetail['officialProject'][
          updatedProjectIndex
        ].projectDescription = projectDescription;
      }
      if (role) {
        getOfficialProjectDetail['officialProject'][
          updatedProjectIndex
        ].role = role;
      }
      if (teamSize) {
        getOfficialProjectDetail['officialProject'][
          updatedProjectIndex
        ].teamSize = teamSize;
      }
      if (responsibility) {
        getOfficialProjectDetail['officialProject'][
          updatedProjectIndex
        ].responsibility = responsibility;
      }
      const updatedResult = await getOfficialProjectDetail.save();
      return updatedResult;
    } else {
      return {
        message: `Official Project details is not present in ${profileName} profile with education id ${projectId}`,
        status: 'fail',
      };
    }
  }

  private getOfficialProjectIndex(
    projects: [OfficialModel],
    projectId: string,
  ) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === projectId) {
        return i;
      }
    }
    return -1;
  }
}
