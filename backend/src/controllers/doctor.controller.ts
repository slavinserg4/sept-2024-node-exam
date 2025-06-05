import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
import {
    IDoctorDTO,
    IDoctorFilter,
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
            const {
                sortField,
                sortDirection,
                firstName,
                lastName,
                phone,
                email,
                page,
                pageSize,
            } = req.query;

            const filter: IDoctorFilter = {
                ...(firstName && { firstName: firstName as string }),
                ...(lastName && { lastName: lastName as string }),
                ...(phone && { phone: phone as string }),
                ...(email && { email: email as string }),
                sortField: sortField as string,
                sortDirection: sortDirection as string,
                page: page ? Number(page) : undefined,
                pageSize: pageSize ? Number(pageSize) : undefined,
            };

            const result = await doctorService.getAllDoctors(filter);
            res.status(StatusCodesEnum.OK).json(result);
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
