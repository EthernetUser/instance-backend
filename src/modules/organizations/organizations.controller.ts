import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';

@Controller('api/organization')
export class OrganizationsController {
    constructor(private organizationsService: OrganizationsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getOrganizationById(@Param('id') id: string, @Res() res: Response) {
        const result = await this.organizationsService.getOrganizationById(Number(id));
        return res.status(result.status).send(result);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/email')
    async getOrganizationByEmail(@Body('email') email: string, @Res() res: Response) {
        const result = await this.organizationsService.getOrganizationByEmail(email);
        return res.status(result.status).send(result);
    }
}
