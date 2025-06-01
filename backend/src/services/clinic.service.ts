import {
    IClinic,
    IClinicDTO,
    IClinicUpdateDTO,
} from "../interfaces/clinic.interface";
import { clinicRepository } from "../repositories/clinic.repository";

class ClinicService {
    public async createClinic(clinic: IClinicDTO) {
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
