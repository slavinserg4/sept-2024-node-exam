import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IDoctorDTO, IUpdateDoctorDTO } from "../interfaces/doctor.interface";
import { doctorService } from "../services/doctor.service";

class DoctorController {
    public async getAllDoctors(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const doctors = await doctorService.getAllDoctors();
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
}
export const doctorController = new DoctorController();
