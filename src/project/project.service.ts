import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') private readonly projectModel: Model<ProjectModel>,
  ) {}
}
