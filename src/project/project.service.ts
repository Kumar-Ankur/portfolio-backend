import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') private readonly projectModel: Model<ProjectModel>,
  ) {}

  async saveNewProject(
    profileName: string,
    url: string,
    title: string,
    description: string,
    imageId: string,
  ) {
    const projectDetail: any = await this.projectModel.findOne({
      profileName,
    });
    const projectObj = {
      url,
      title,
      description,
      imageId,
    };
    if (!projectDetail) {
      const newProject = new this.projectModel({
        profileName,
        project: [projectObj],
      });
      const result = await newProject.save();
      return result;
    } else {
      projectDetail.project = [...projectDetail.project, projectObj];
      const result = await projectDetail.save();
      return result;
    }
  }

  async getProject(profileName) {
    const projectDetail: any = await this.projectModel.findOne({
      profileName,
    });
    if (!projectDetail) {
      return {
        status: 'fail',
        message: `no project detail found for this ${profileName} profile`,
      };
    }
    return projectDetail;
  }

  async deleteProjectById(profileName: string, projectId: string) {
    const projectDetail: any = await this.projectModel.findOne({
      profileName,
    });
    if (!projectDetail) {
      return {
        message: `Project having ID: ${projectId} does not find in profile ${profileName}`,
        status: 'fail',
      };
    }
    const updatedEducation = projectDetail['project'].filter(
      (project: ProjectModel) => {
        return project.id !== projectId;
      },
    );
    projectDetail['project'] = updatedEducation;
    const result = await projectDetail.save();
    return result;
  }

  async deleteProject(profileName: string) {
    const projectDetail = await this.projectModel.findOne({
      profileName,
    });
    if (!projectDetail) {
      return {
        message: `Profile: ${profileName} does not exixts`,
        status: 'fail',
      };
    }
    await this.projectModel.deleteOne({ profileName });
    return {
      message: `Profile Detail has been deleted successfully for profile: ${profileName}`,
      profileDetail: projectDetail,
    };
  }

  async updateProject(
    profileName: string,
    projectId: string,
    url: string,
    title: string,
    description: string,
    imageId: string,
  ) {
    const projectDetail = await this.projectModel.findOne({
      profileName,
    });
    if (!projectDetail) {
      return {
        message: `Profile: ${profileName} does not exixts`,
        status: 'fail',
      };
    }
    const updatedProjectIndex = this.getProjectIndex(
      projectDetail['project'],
      projectId,
    );

    if (updatedProjectIndex !== -1) {
      if (url) {
        projectDetail['project'][updatedProjectIndex].url = url;
      }
      if (title) {
        projectDetail['project'][updatedProjectIndex].title = title;
      }
      if (description) {
        projectDetail['project'][updatedProjectIndex].description = description;
      }
      if (imageId) {
        projectDetail['project'][updatedProjectIndex].imageId = imageId;
      }
      const updatedResult = await projectDetail.save();
      return updatedResult;
    } else {
      return {
        message: `Project details is not present in ${profileName} profile with education id ${projectId}`,
        status: 'fail',
      };
    }
  }

  private getProjectIndex(projects: [ProjectModel], projectId: string) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === projectId) {
        return i;
      }
    }
    return -1;
  }
}
