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

  @Post()
  @ApiCreatedResponse({
    description: 'Education has been inserted sucessfully',
    type: EducationDTO,
  })
  @ApiBody({
    required: true,
    type: EducationDTO,
  })
  async insertEducation(@Body() education: EducationModel) {
    const { degree, institution, board, year, percentage } = education;
    const newEducation = await this.educationService.insertEducation(
      degree,
      institution,
      board,
      year,
      percentage,
    );
    return newEducation;
  }

  @Get()
  @ApiOkResponse({
    description: 'Fetched education data successfully',
    type: [EducationDTO],
  })
  async getEducation() {
    const fetchedEducation = await this.educationService.getEducation();
    return fetchedEducation;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Education has been successfully deleted',
  })
  async deleteEducation(@Param('id') educationId: string) {
    const deleteEducation = await this.educationService.deleteEducation(
      educationId,
    );
    return { message: deleteEducation };
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Education has been updated successfully',
    type: EducationDTO,
  })
  @ApiBody({
    required: true,
    type: EducationDTO,
  })
  async updateEducation(
    @Param('id') educationId: string,
    @Body() education: EducationModel,
  ) {
    const { degree, institution, board, year, percentage } = education;
    const updatedEducation = await this.educationService.updateEducation(
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
