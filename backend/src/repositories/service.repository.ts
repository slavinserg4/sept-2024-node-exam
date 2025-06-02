import { IService, IServiceDTO } from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class ServiceRepository {
    private readonly defaultSelect = {
        select: "name",
        doctorPopulate: {
            path: "doctorId",
            select: "_id firstName lastName",
        },
        clinicPopulate: {
            path: "clinicId",
            select: "_id name",
        },
    };

    private getBaseQuery(query: any, sortDirection?: string) {
        const baseQuery = query
            .select(this.defaultSelect.select)
            .populate(this.defaultSelect.clinicPopulate)
            .populate(this.defaultSelect.doctorPopulate);
        if (sortDirection) {
            baseQuery.sort({ name: sortDirection === "asc" ? 1 : -1 });
        }
        return baseQuery;
    }

    public async getAllServices(sortDirection?: string): Promise<IService[]> {
        return this.getBaseQuery(Service.find(), sortDirection).exec();
    }

    public async getServiceById(id: string): Promise<IService> {
        return this.getBaseQuery(Service.findById(id)).exec();
    }

    public async getServiceByName(
        name: string,
        sortDirection?: string,
    ): Promise<IService[]> {
        return this.getBaseQuery(
            Service.find({
                name: { $regex: name, $options: "i" },
            }),
            sortDirection,
        ).exec();
    }

    public async createService(service: IServiceDTO): Promise<IService> {
        const createdService = await Service.create(service);
        return this.getBaseQuery(Service.findById(createdService._id)).exec();
    }

    public async updateServiceById(
        id: string,
        dto: IServiceDTO,
    ): Promise<IService> {
        return this.getBaseQuery(
            Service.findByIdAndUpdate(id, dto, { new: true }),
        ).exec();
    }
}

export const serviceRepository = new ServiceRepository();
