import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IClinic } from "../interfaces/clinic.interface";
import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
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
        const clinicPromises = doctor.clinics.map((clinicName) =>
            clinicService.getClinicByName(clinicName),
        );
        const clinics = (await Promise.all(clinicPromises)) as IClinic[];

        if (clinics.every((clinic) => !clinic)) {
            throw new ApiError(
                "No clinics found, please create clinic first",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        // Фільтруємо null значення та збираємо ID клінік
        const clinicIds = clinics
            .filter((clinic) => clinic !== null)
            .map((clinic) => clinic._id);

        // Перевіряємо та створюємо сервіси
        const serviceIds = await Promise.all(
            doctor.services.map(async (serviceName) => {
                let service =
                    await serviceService.getServicesByName(serviceName);
                if (!service) {
                    service = await serviceService.createService({
                        name: serviceName,
                        clinicId: clinicIds,
                    });
                }
                return service._id;
            }),
        );

        // Створюємо доктора з ID клінік та сервісів
        const doctorToCreate = {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            clinics: clinicIds,
            services: serviceIds,
        };
        const createdDoctor =
            await doctorRepository.createDoctor(doctorToCreate);
        await Promise.all(
            serviceIds.map((serviceId) =>
                serviceService.updateServiceById(serviceId, {
                    doctorId: [createdDoctor._id],
                }),
            ),
        );

        return createdDoctor;
    }

    public async getDoctorsByClinic(clinicId: string): Promise<IDoctor[]> {
        const doctors = await doctorRepository.getDoctorsByClinic(clinicId);

        if (!doctors.length) {
            throw new ApiError(
                "No doctors found in this clinic",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        return doctors;
    }

    public async getDoctorsByService(serviceId: string): Promise<IDoctor[]> {
        const doctors = await doctorRepository.getDoctorsByService(serviceId);

        if (!doctors.length) {
            throw new ApiError(
                "No doctors found with this service",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        return doctors;
    }
}

export const doctorService = new DoctorService();
