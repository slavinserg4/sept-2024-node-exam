import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
import {
    IDoctorDTO,
    IDoctorFind,
    IUpdateDoctorDTO,
} from "../interfaces/doctor.interface";
import { doctorService } from "../services/doctor.service";

class DoctorController {
    public async getAllDoctors(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const sortField = req.query.sortField as string;
            const sortDirection = req.query.sortDirection as string;
            const { firstName, lastName, phone, email } =
                req.query as IDoctorFind;
            if (firstName || lastName || phone || email) {
                const searchParams: IDoctorFind = {
                    ...(firstName && { firstName: firstName as string }),
                    ...(lastName && { lastName: lastName as string }),
                    ...(phone && { phone: phone as string }),
                    ...(email && { email: email as string }),
                };
                const doctors = await doctorService.searchDoctor(
                    searchParams,
                    sortField,
                    sortDirection,
                );
                return res.status(StatusCodesEnum.OK).json(doctors);
            }
            const doctors = await doctorService.getAllDoctors(
                sortField,
                sortDirection,
            );
            res.status(StatusCodesEnum.OK).json(doctors);
        } catch (e) {
            next(e);
        }
    }
    public async getDoctorById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const doctor = await doctorService.getDoctorById(id);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }
    public async createDoctor(req: Request, res: Response, next: NextFunction) {
        try {
            const doctorDTO = req.body as IDoctorDTO;
            const doctor = await doctorService.createDoctor(doctorDTO);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }
    public async updateDoctorById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const doctorDTO = req.body as IUpdateDoctorDTO;
            const doctor = await doctorService.updateDoctorById(id, doctorDTO);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }
    public async signInByDoctor(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const body = req.body as IAuth;
            const doctor = await doctorService.signInByDoctor(body);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }
    public async deleteDoctorById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await doctorService.deleteDoctorById(id);
            res.status(StatusCodesEnum.NO_CONTENT).send();
        } catch (e) {
            next(e);
        }
    }
}
export const doctorController = new DoctorController();
