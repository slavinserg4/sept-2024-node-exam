import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IClinic,
    IClinicDTO,
    IClinicUpdateDTO,
} from "../interfaces/clinic.interface";
import { IDoctor } from "../interfaces/doctor.interface";
import { clinicRepository } from "../repositories/clinic.repository";

class ClinicService {
    private normalizeIds(items: Array<string | { _id: string }>): string[] {
        return (items || []).map((item) =>
            typeof item === "string" ? item : item._id.toString(),
        );
    }

    public async processClinicData(clinicsArray: string[]): Promise<string[]> {
        const clinicPromises = clinicsArray.map((clinicName) =>
            this.getClinicByName(clinicName),
        );
        const clinics = (await Promise.all(clinicPromises)) as IClinic[];

        if (clinics.every((clinic) => !clinic)) {
            throw new ApiError(
                "No clinics found, please create clinic first",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        return clinics
            .filter((clinic): clinic is IClinic => clinic !== null)
            .map((clinic) => clinic._id.toString());
    }
    public async updateClinics(
        clinicIds: string[],
        serviceIds: string[],
        createdDoctor: IDoctor,
    ): Promise<void> {
        await Promise.all(
            clinicIds.map(async (clinicId) => {
                const clinic = await this.getClinicById(clinicId);
                if (!clinic) return;

                const existingDoctors = this.normalizeIds(clinic.doctors);
                const existingServices = this.normalizeIds(clinic.services);

                if (!existingDoctors.includes(createdDoctor._id.toString())) {
                    existingDoctors.push(createdDoctor._id.toString());
                }

                serviceIds.forEach((serviceId) => {
                    if (!existingServices.includes(serviceId)) {
                        existingServices.push(serviceId);
                    }
                });

                return await this.updateClinicById(clinicId, {
                    doctors: existingDoctors,
                    services: existingServices,
                });
            }),
        );
    }

    public async createClinic(clinic: IClinicDTO) {
        const createdClinic = await clinicRepository.getClinicByExactName(
            clinic.name,
        );
        if (createdClinic) {
            throw new ApiError(
                "Clinic is already exists",
                StatusCodesEnum.BED_REQUEST,
            );
        }
        return await clinicRepository.createClinic(clinic);
    }
    public async getClinicByName(name: string) {
        return await clinicRepository.getClinicByName(name);
    }
    public async getClinicById(id: string) {
        return await clinicRepository.getClinicById(id);
    }
    public async getAllClinics(): Promise<IClinic[]> {
        return await clinicRepository.getAllClinics();
    }
    public async updateClinicById(id: string, dto: IClinicUpdateDTO) {
        return await clinicRepository.updateClinicById(id, dto);
    }
}
export const clinicService = new ClinicService();
