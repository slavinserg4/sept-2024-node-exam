import { IService, IServiceDTO } from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class ServiceRepository {
    public createService(service: IServiceDTO): Promise<IService> {
        return Service.create(service);
    }

    public getAllServices(): Promise<IService[]> {
        return Service.find();
    }

    public getServiceById(id: string): Promise<IService> {
        return Service.findById(id);
    }

    public getServiceByName(name: string): Promise<IService> {
        return Service.findOne({
            name: { $regex: new RegExp("^" + name + "$", "i") },
        });
    }
    public updateServiceById(id: string, dto: IServiceDTO): Promise<IService> {
        return Service.findByIdAndUpdate(id, dto);
    }
}

export const serviceRepository = new ServiceRepository();
