import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IServiceDTO } from "../interfaces/service.interface";
import { serviceService } from "../services/service.service";

class ServiceController {
    public async getAllServices(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const services = await serviceService.getAllServices();
            res.status(StatusCodesEnum.OK).json(services);
        } catch (e) {
            next(e);
        }
    }
    public async getServiceById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const service = await serviceService.getServiceById(id);
            res.status(StatusCodesEnum.OK).json(service);
        } catch (e) {
            next(e);
        }
    }
    public async createService(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const body = req.body as IServiceDTO;
            const service = await serviceService.createService(body);
            res.status(StatusCodesEnum.CREATED).json(service);
        } catch (e) {
            next(e);
        }
    }
}
export const serviceController = new ServiceController();
