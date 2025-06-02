import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IDoctor,
    IDoctorDTO,
    IUpdateDoctorDTO,
} from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { clinicService } from "./clinic.service";
import { serviceService } from "./service.service";

class DoctorService {
    public async getAllDoctors(): Promise<IDoctor[]> {
        const doctors = await doctorRepository.getAllDoctors();
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

        const doctorToCreate = {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
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

        // Обробка клінік
        let updatedClinics = [...existingDoctor.clinics];
        if (dto.clinics) {
            const clinicsToAdd = Array.isArray(dto.clinics)
                ? dto.clinics
                : [dto.clinics];
            const newClinicIds =
                await clinicService.processClinicData(clinicsToAdd);

            // Додаємо нові клініки без дублювання і конвертуємо все в рядки
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

        // Обробка сервісів
        let updatedServices = [...existingDoctor.services];
        if (dto.services) {
            const servicesToAdd = Array.isArray(dto.services)
                ? dto.services
                : [dto.services];
            const { serviceIds } = await serviceService.processServiceData(
                servicesToAdd,
                updatedClinics as string[],
            );

            // Додаємо нові сервіси без дублювання і конвертуємо все в рядки
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

        // Оновлюємо зв'язки з клініками
        await clinicService.updateClinics(
            updatedClinics as string[],
            updatedServices as string[],
            existingDoctor,
        );

        // Оновлюємо зв'язки з сервісами
        await serviceService.updateServices(
            updatedServices as string[],
            updatedClinics as string[],
            existingDoctor,
        );

        // Оновлюємо дані лікаря
        const updateData: IUpdateDoctorDTO = {
            ...(dto.firstName && { firstName: dto.firstName }),
            ...(dto.lastName && { lastName: dto.lastName }),
            clinics: updatedClinics as string[],
            services: updatedServices as string[],
        };

        return await doctorRepository.updateDoctorById(id, updateData);
    }
}
export const doctorService = new DoctorService();
