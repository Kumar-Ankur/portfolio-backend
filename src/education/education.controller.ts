import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EducationService } from './education.service';
import { EducationModel } from './education.model';
import { EducationDTO } from './education.dto';

@ApiTags('Education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post(':profileName')
  @ApiCreatedResponse({
    description: 'Education has been inserted sucessfully',
    type: EducationDTO,
  })
  @ApiBody({
    required: true,
    type: EducationDTO,
  })
  async insertEducation(
    @Param('profileName') profileName: string,
    @Body() education: EducationModel,
  ) {
    const { degree, institution, board, year, percentage } = education;
    const newEducation = await this.educationService.insertEducation(
      profileName,
      degree,
      institution,
      board,
      year,
      percentage,
    );
    return newEducation;
  }

  @Get(':profileName')
  @ApiOkResponse({
    description: 'Fetched education data successfully',
    type: [EducationDTO],
  })
  async getEducation(@Param('profileName') profileName: string) {
    const fetchedEducation = await this.educationService.getEducation(
      profileName,
    );
    return fetchedEducation;
  }

  @Delete(':profileName/:id')
  @ApiOkResponse({
    description: 'Education has been successfully deleted',
  })
  async deleteEducationById(
    @Param('profileName') profileName: string,
    @Param('id') educationId: string,
  ) {
    const deleteEducation = await this.educationService.deleteEducationById(
      profileName,
      educationId,
    );
    return { message: deleteEducation };
  }

  @Delete(':profileName')
  @ApiOkResponse({
    description: 'Education has been successfully deleted',
  })
  async deleteEducation(@Param('profileName') profileName: string) {
    const deleteEducation = await this.educationService.deleteEducation(
      profileName,
    );
    return deleteEducation;
  }

  @Patch(':profileName/:id')
  @ApiOkResponse({
    description: 'Education has been updated successfully',
    type: EducationDTO,
  })
  @ApiBody({
    required: true,
    type: EducationDTO,
  })
  async updateEducation(
    @Param('profileName') profileName: string,
    @Param('id') educationId: string,
    @Body() education: EducationModel,
  ) {
    const { degree, institution, board, year, percentage } = education;
    const updatedEducation = await this.educationService.updateEducation(
      profileName,
      educationId,
      degree,
      institution,
      board,
      year,
      percentage,
    );
    return updatedEducation;
  }
}
