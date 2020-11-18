import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') private readonly projectModel: Model<ProjectModel>,
  ) {}

  async saveNewProject(url: string, title: string, imageId: string) {
    const newProject = new this.projectModel({
      url,
      title,
      imageId,
    });
    const project = newProject.save();
    return project;
  }

  async getProject() {
    const project = await this.projectModel.find();
    return project;
  }

  async updateProject(
    projectId: string,
    url: string,
    title: string,
    imageId: string,
  ) {
    const project = await this.findProject(projectId);
    if (url) {
      project.url = url;
    }
    if (title) {
      project.title = title;
    }
    if (imageId) {
      project.imageId = imageId;
    }
    const updatedProject = await project.save();
    return updatedProject;
  }

  async deleteProject(projectId: string) {
    const project = await this.findProject(projectId);
    await this.projectModel.deleteOne({
      _id: projectId,
    });
    return project;
  }

  async findProject(id: string) {
    let project;
    try {
      project = await this.projectModel.findById(id);
    } catch (err) {
      throw new NotFoundException('Error while fetching project');
    }
    if (!project) {
      throw new NotFoundException('Error while fetching project');
    }
    return project;
  }
}
