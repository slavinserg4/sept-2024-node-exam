import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IDoctor } from "../interfaces/doctor.interface";
import { IPaginatedResponse } from "../interfaces/paginated.response";
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

    public async getAllServices(
        sortDirection?: string,
        page?: number,
        pageSize?: number,
    ): Promise<IPaginatedResponse<IService>> {
        const query = page && pageSize ? { page, pageSize } : undefined;

        const { services, total: totalItems } =
            await serviceRepository.getAllServices(query, sortDirection);

        if (!query) {
            return {
                data: services,
                totalItems,
                totalPages: 1,
                previousPage: false,
                nextPage: false,
            };
        }

        const totalPages = Math.ceil(totalItems / query.pageSize);

        return {
            data: services,
            totalItems,
            totalPages,
            previousPage: query.page > 1,
            nextPage: query.page < totalPages,
        };
    }
    public async createService(service: IServiceDTO): Promise<IService> {
        const foundedService = await this.getServicesByName(service.name);
        if (foundedService.length)
            throw new ApiError(
                "Service is already exists",
                StatusCodesEnum.BED_REQUEST,
            );
        return await serviceRepository.createService(service);
    }
    public async getServiceById(id: string): Promise<IService> {
        const service = await serviceRepository.getServiceById(id);
        if (!service) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
        return service;
    }
    public async getServicesByName(
        name: string,
        sortDirection?: string,
    ): Promise<IService[]> {
        const { services } = await serviceRepository.getServiceByName(
            name,
            sortDirection,
        );
        return services;
    }
    public async getServicesByNameOnController(
        name: string,
        sortDirection?: string,
        page?: number,
        pageSize?: number,
    ): Promise<IPaginatedResponse<IService>> {
        const query = page && pageSize ? { page, pageSize } : undefined;
        const { services, total: totalItems } =
            await serviceRepository.getServiceByName(
                name,
                sortDirection,
                query,
            );

        if (!services.length) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }

        if (!query) {
            return {
                data: services,
                totalItems,
                totalPages: 1,
                previousPage: false,
                nextPage: false,
            };
        }

        const totalPages = Math.ceil(totalItems / query.pageSize);

        return {
            data: services,
            totalItems,
            totalPages,
            previousPage: query.page > 1,
            nextPage: query.page < totalPages,
        };
    }
    public async updateServiceById(
        id: string,
        dto: IServiceDTO,
    ): Promise<IService> {
        return await serviceRepository.updateServiceById(id, dto);
    }
    public async deleteServiceById(id: string): Promise<void> {
        const service = await this.getServiceById(id);
        if (!service) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
        return await serviceRepository.deleteServiceById(id);
    }
}
export const serviceService = new ServiceService();
