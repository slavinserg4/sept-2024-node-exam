import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IClinicDTO, IClinicFilter } from "../interfaces/clinic.interface";
import { clinicService } from "../services/clinic.service";

class ClinicController {
    public async createClinic(req: Request, res: Response, next: NextFunction) {
        try {
            const clinicDTO = req.body as IClinicDTO;
            const clinic = await clinicService.createClinic(clinicDTO);
            res.status(StatusCodesEnum.CREATED).json(clinic);
        } catch (error) {
            next(error);
        }
    }
    public async getClinicById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const clinic = await clinicService.getClinicById(id);
            res.status(StatusCodesEnum.OK).json(clinic);
        } catch (error) {
            next(error);
        }
    }

    public async getAllClinics(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const {
                sortDirection,
                clinicName,
                serviceName,
                doctorName,
                page,
                pageSize,
            } = req.query as IClinicFilter;
            const clinics = await clinicService.getAllClinics({
                sortDirection,
                clinicName,
                serviceName,
                doctorName,
                page,
                pageSize,
            });
            res.status(StatusCodesEnum.OK).json(clinics);
        } catch (error) {
            next(error);
        }
    }
    public async deleteClinicById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await clinicService.deleteClinicById(id);
            res.status(StatusCodesEnum.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }
}

export const clinicController = new ClinicController();
