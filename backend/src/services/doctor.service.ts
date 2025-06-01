import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IClinic } from "../interfaces/clinic.interface";
import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { clinicRepository } from "../repositories/clinic.repository";
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

        const clinicPromises = clinicsArray.map((clinicName) =>
            clinicService.getClinicByName(clinicName),
        );
        const clinics = (await Promise.all(clinicPromises)) as IClinic[];

        if (clinics.every((clinic) => !clinic)) {
            throw new ApiError(
                "No clinics found, please create clinic first",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        const clinicIds = clinics
            .filter((clinic): clinic is IClinic => clinic !== null)
            .map((clinic) => clinic._id.toString());

        // Створюємо/отримуємо сервіси і зберігаємо їх
        const servicesWithIds = await Promise.all(
            servicesArray.map(async (serviceName) => {
                let service =
                    await serviceService.getServicesByName(serviceName);
                if (!service) {
                    service = await serviceService.createService({
                        name: serviceName,
                        clinicId: clinicIds,
                    });
                }
                return {
                    id: service._id.toString(),
                    name: service.name,
                };
            }),
        );

        const serviceIds = servicesWithIds.map((service) => service.id);

        const doctorToCreate = {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            clinics: clinicIds,
            services: serviceIds,
        };

        const createdDoctor =
            await doctorRepository.createDoctor(doctorToCreate);

        // Оновлюємо клініки з сервісами та докторами
        await Promise.all(
            clinicIds.map(async (clinicId) => {
                const clinic = await clinicRepository.getClinicById(clinicId);
                if (!clinic) return;

                const existingDoctors = (clinic.doctors || []).map((doc) =>
                    typeof doc === "string" ? doc : doc._id.toString(),
                );

                const existingServices = (clinic.services || []).map((serv) =>
                    typeof serv === "string" ? serv : serv._id.toString(),
                );

                // Додаємо нового доктора
                if (!existingDoctors.includes(createdDoctor._id.toString())) {
                    existingDoctors.push(createdDoctor._id.toString());
                }

                // Додаємо нові сервіси
                serviceIds.forEach((serviceId) => {
                    if (!existingServices.includes(serviceId)) {
                        existingServices.push(serviceId);
                    }
                });

                // Оновлюємо клініку з новими сервісами та докторами
                return await clinicRepository.updateClinicById(clinicId, {
                    doctors: existingDoctors,
                    services: existingServices,
                });
            }),
        );

        // Оновлюємо сервіси з докторами
        await Promise.all(
            serviceIds.map(async (serviceId) => {
                const service = await serviceService.getServiceById(serviceId);
                if (!service) return;

                const updatedDoctors = (service.doctorId || []).map((doc) =>
                    typeof doc === "string" ? doc : doc._id.toString(),
                );

                if (!updatedDoctors.includes(createdDoctor._id.toString())) {
                    updatedDoctors.push(createdDoctor._id.toString());
                }

                return await serviceService.updateServiceById(serviceId, {
                    name: service.name,
                    doctorId: updatedDoctors,
                    clinicId: clinicIds, // Оновлюємо зв'язок з клініками
                });
            }),
        );

        return await doctorRepository.getDoctorById(createdDoctor._id);
    }
}

export const doctorService = new DoctorService();
