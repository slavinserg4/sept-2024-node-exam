import { IServiceDTO } from "../interfaces/service.interface";
import { serviceRepository } from "../repositories/service.repository";

class ServiceService {
    public async getAllServices() {
        return await serviceRepository.getAllServices();
    }
    public async createService(service: IServiceDTO) {
        return await serviceRepository.createService(service);
    }
    public async getServiceById(id: string) {
        return await serviceRepository.getServiceById(id);
    }
    public async getServicesByName(name: string) {
        return await serviceRepository.getServiceByName(name);
    }
    public async updateServiceById(id: string, dto: IServiceDTO) {
        return await serviceRepository.updateServiceById(id, dto);
    }
}
export const serviceService = new ServiceService();
