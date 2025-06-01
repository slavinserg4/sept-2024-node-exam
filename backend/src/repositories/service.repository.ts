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

    private getBaseQuery(query: any) {
        return query
            .select(this.defaultSelect.select)
            .populate(this.defaultSelect.clinicPopulate)
            .populate(this.defaultSelect.doctorPopulate);
    }

    public async getAllServices(): Promise<IService[]> {
        return this.getBaseQuery(Service.find()).exec();
    }

    public async getServiceById(id: string): Promise<IService> {
        return this.getBaseQuery(Service.findById(id)).exec();
    }

    public async getServiceByName(name: string): Promise<IService> {
        return this.getBaseQuery(
            Service.findOne({
                name: { $regex: new RegExp("^" + name + "$", "i") },
            }),
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
