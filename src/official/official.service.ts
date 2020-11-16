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
    employer: string,
    client: string,
    projectDescription: string[],
    role: string,
    teamSize: number,
    responsibility: string[],
  ) {
    const newOfficialProject = new this.officialModel({
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    });

    const result = await newOfficialProject.save();
    return result;
  }

  async fetchedProject() {
    const fetchedResponse = await this.officialModel.find();
    return fetchedResponse;
  }

  async deleteOfficialProject(projectId: string) {
    await this.officialModel.deleteOne({
      _id: projectId,
    });
    return 'Project has been deleted successfully';
  }

  async updateProject(
    projectId: string,
    employer: string,
    client: string,
    projectDescription: string[],
    role: string,
    teamSize: number,
    responsibility: string[],
  ) {
    const project = await this.findOfficial(projectId);
    if (employer) {
      project.employer = employer;
    }
    if (client) {
      project.client = client;
    }
    if (projectDescription) {
      project.projectDescription = projectDescription;
    }
    if (role) {
      project.role = role;
    }
    if (teamSize) {
      project.teamSize = teamSize;
    }
    if (responsibility) {
      project.responsibility = responsibility;
    }
    const updatedResult = await project.save();
    return updatedResult;
  }

  private async findOfficial(id: string): Promise<OfficialModel> {
    let user;
    try {
      user = await this.officialModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('could not find the official project');
    }

    if (!user) {
      throw new NotFoundException('could not find the official project');
    }
    return user;
  }
}
