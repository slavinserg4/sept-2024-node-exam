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
            const { sort, page, pageSize } = req.query;
            const pageNumber = page ? parseInt(page as string) : undefined;
            const limit = pageSize ? parseInt(pageSize as string) : undefined;
            const services = await serviceService.getAllServices(
                sort as string,
                pageNumber,
                limit,
            );
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
    public async getServiceByName(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const sortDirection = req.query.sort as string;
            const { name, page, pageSize } = req.query;
            const service = await serviceService.getServicesByNameOnController(
                name as string,
                sortDirection,
                page ? parseInt(page as string) : undefined,
                pageSize ? parseInt(pageSize as string) : undefined,
            );
            res.status(StatusCodesEnum.OK).json(service);
        } catch (e) {
            next(e);
        }
    }
    public async deleteServiceById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await serviceService.deleteServiceById(id);
            res.status(StatusCodesEnum.NO_CONTENT).send();
        } catch (e) {
            next(e);
        }
    }
}
export const serviceController = new ServiceController();
