import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import {
    IDoctor,
    IDoctorDTO,
    IDoctorFind,
    IUpdateDoctorDTO,
} from "../interfaces/doctor.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { tokenRepository } from "../repositories/token.repository";
import { clinicService } from "./clinic.service";
import { passwordService } from "./password.service";
import { serviceService } from "./service.service";
import { tokenService } from "./token.service";

class DoctorService {
    public async getAllDoctors(
        sortField?: string,
        sortDirection?: string,
    ): Promise<IDoctor[]> {
        const doctors = await doctorRepository.getAllDoctors(
            sortField,
            sortDirection,
        );
        if (!doctors.length) {
            throw new ApiError("No doctors found", StatusCodesEnum.NOT_FOUND);
        }
        return doctors;
    }

    public async getDoctorById(id: string): Promise<IDoctor> {
        const doctor = await doctorRepository.getDoctorById(id);
        if (!doctor) {
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        }
        return doctor;
    }

    public async createDoctor(doctor: IDoctorDTO): Promise<IDoctor> {
        const clinicsArray = Array.isArray(doctor.clinics)
            ? doctor.clinics
            : [doctor.clinics];
        const servicesArray = Array.isArray(doctor.services)
            ? doctor.services
            : [doctor.services];

        const clinicIds = await clinicService.processClinicData(clinicsArray);
        const { serviceIds } = await serviceService.processServiceData(
            servicesArray,
            clinicIds,
        );
        const doctorEmail = await doctorRepository.getDoctorByEmail(
            doctor.email,
        );
        if (doctorEmail)
            throw new ApiError(
                "Doctor with this email already exists",
                StatusCodesEnum.BED_REQUEST,
            );
        const hashedPassword = await passwordService.hashPassword(
            doctor.password,
        );

        const doctorToCreate = {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            password: hashedPassword,
            clinics: clinicIds,
            services: serviceIds,
        };

        const createdDoctor =
            await doctorRepository.createDoctor(doctorToCreate);

        await clinicService.updateClinics(clinicIds, serviceIds, createdDoctor);
        await serviceService.updateServices(
            serviceIds,
            clinicIds,
            createdDoctor,
        );

        return await doctorRepository.getDoctorById(createdDoctor._id);
    }
    public async updateDoctorById(
        id: string,
        dto: IUpdateDoctorDTO,
    ): Promise<IDoctor> {
        const existingDoctor = await this.getDoctorById(id);
        if (!existingDoctor) {
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        }
        let updatedClinics = [...existingDoctor.clinics];
        if (dto.clinics) {
            const clinicsToAdd = Array.isArray(dto.clinics)
                ? dto.clinics
                : [dto.clinics];
            const newClinicIds =
                await clinicService.processClinicData(clinicsToAdd);

            const clinicIdsSet = new Set([
                ...updatedClinics.map((clinic) =>
                    typeof clinic === "string" ? clinic : clinic._id.toString(),
                ),
                ...newClinicIds,
            ]);
            updatedClinics = Array.from(clinicIdsSet) as string[];
        } else {
            updatedClinics = updatedClinics.map((clinic) =>
                typeof clinic === "string" ? clinic : clinic._id.toString(),
            );
        }
        let updatedServices = [...existingDoctor.services];
        if (dto.services) {
            const servicesToAdd = Array.isArray(dto.services)
                ? dto.services
                : [dto.services];
            const { serviceIds } = await serviceService.processServiceData(
                servicesToAdd,
                updatedClinics as string[],
            );

            const serviceIdsSet = new Set([
                ...updatedServices.map((service) =>
                    typeof service === "string"
                        ? service
                        : service._id.toString(),
                ),
                ...serviceIds,
            ]);
            updatedServices = Array.from(serviceIdsSet) as string[];
        } else {
            updatedServices = updatedServices.map((service) =>
                typeof service === "string" ? service : service._id.toString(),
            );
        }

        await clinicService.updateClinics(
            updatedClinics as string[],
            updatedServices as string[],
            existingDoctor,
        );

        await serviceService.updateServices(
            updatedServices as string[],
            updatedClinics as string[],
            existingDoctor,
        );

        const updateData: IUpdateDoctorDTO = {
            ...(dto.firstName && { firstName: dto.firstName }),
            ...(dto.lastName && { lastName: dto.lastName }),
            clinics: updatedClinics as string[],
            services: updatedServices as string[],
        };

        return await doctorRepository.updateDoctorById(id, updateData);
    }
    public async signInByDoctor(
        loginData: IAuth,
    ): Promise<{ doctor: IDoctor; tokens: ITokenPair }> {
        const doctor = await doctorRepository.getDoctorByEmailWithPassword(
            loginData.email,
        );
        if (!doctor) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }
        const isPasswordValid = await passwordService.comparePassword(
            loginData.password,
            doctor.password,
        );
        if (!isPasswordValid) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }
        const tokens = tokenService.generateTokens({
            role: doctor.role,
            doctorId: doctor._id,
        });
        await tokenRepository.create({ ...tokens, _doctorId: doctor._id });
        return { doctor, tokens };
    }
    public async searchDoctor(
        searchParams: IDoctorFind,
        sortField?: string,
        sortDirection?: string,
    ): Promise<IDoctor[]> {
        const doctors = await doctorRepository.searchDoctors(
            searchParams,
            sortField,
            sortDirection,
        );
        if (!doctors.length) {
            throw new ApiError("No doctors found", StatusCodesEnum.NOT_FOUND);
        }
        return doctors;
    }
    public async deleteDoctorById(id: string): Promise<void> {
        await this.getDoctorById(id);
        return await doctorRepository.deleteDoctorById(id);
    }
    public async updateDoctorPassword(
        id: string,
        password: string,
    ): Promise<IDoctor> {
        const doctor = await doctorRepository.updatePassword(id, password);
        if (!doctor) {
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        }
        return doctor;
    }
}
export const doctorService = new DoctorService();
