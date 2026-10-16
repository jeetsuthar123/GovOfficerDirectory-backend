import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './department.schema';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department.name) private model: Model<DepartmentDocument>) {}

  async get(search?: string) {
    const query: Record<string, any> = { isActive: true };
    if (search?.trim()) {
      const term = escapeRegex(search.trim().slice(0, 100));
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { shortName: { $regex: term, $options: 'i' } },
        { code: { $regex: term, $options: 'i' } },
      ];
    }
    return this.model.find(query).sort({ name: 1 }).lean();
  }

  async find(id: string) {
    const department = await this.model.findOne({ _id: id, isActive: true }).lean();
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async create(dto: CreateDepartmentDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.model.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }
}
