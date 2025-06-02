import { IDoctor } from "../interfaces/doctor.interface";
import { IService, IServiceDTO } from "../interfaces/service.interface";
import { serviceRepository } from "../repositories/service.repository";

class ServiceService {
    private normalizeIds(items: Array<string | { _id: string }>): string[] {
        return (items || []).map((item) =>
            typeof item === "string" ? item : item._id.toString(),
        );
    }

    public async processServiceData(
        servicesArray: string[],
        clinicIds: string[],
    ): Promise<{
        serviceIds: string[];
        servicesWithIds: Array<{ id: string; name: string }>;
    }> {
        const servicesWithIds = await Promise.all(
            servicesArray.map(async (serviceName) => {
                const services = await this.getServicesByName(serviceName);
                let service = services.length
                    ? services.find((s) =>
                          s.name
                              .toLowerCase()
                              .includes(serviceName.toLowerCase()),
                      ) || services[0]
                    : null;

                if (!service) {
                    service = await this.createService({
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

        return {
            serviceIds: servicesWithIds.map((service) => service.id),
            servicesWithIds,
        };
    }
    public async updateServices(
        serviceIds: string[],
        clinicIds: string[],
        createdDoctor: IDoctor,
    ): Promise<void> {
        await Promise.all(
            serviceIds.map(async (serviceId) => {
                const service = await this.getServiceById(serviceId);
                if (!service) return;

                const updatedDoctors = this.normalizeIds(service.doctorId);

                if (!updatedDoctors.includes(createdDoctor._id.toString())) {
                    updatedDoctors.push(createdDoctor._id.toString());
                }

                return await this.updateServiceById(serviceId, {
                    name: service.name,
                    doctorId: updatedDoctors,
                    clinicId: clinicIds,
                });
            }),
        );
    }

    public async getAllServices(sortDirection?: string) {
        return await serviceRepository.getAllServices(sortDirection);
    }
    public async createService(service: IServiceDTO) {
        return await serviceRepository.createService(service);
    }
    public async getServiceById(id: string) {
        return await serviceRepository.getServiceById(id);
    }
    public async getServicesByName(
        name: string,
        sortDirection?: string,
    ): Promise<IService[]> {
        return await serviceRepository.getServiceByName(name, sortDirection);
    }
    public async getExactServiceByName(name: string): Promise<IService | null> {
        const services = await serviceRepository.getServiceByName(name);
        return (
            services.find(
                (service) => service.name.toLowerCase() === name.toLowerCase(),
            ) || null
        );
    }

    public async updateServiceById(id: string, dto: IServiceDTO) {
        return await serviceRepository.updateServiceById(id, dto);
    }
}
export const serviceService = new ServiceService();
