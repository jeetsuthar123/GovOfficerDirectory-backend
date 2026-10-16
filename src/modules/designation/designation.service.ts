function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Designation, DesignationDocument } from './designation.schema';
import { CreateDesignationDto, UpdateDesignationDto } from './dto';
@Injectable()
export class DesignationService {
  constructor(@InjectModel(Designation.name) private model: Model<DesignationDocument>) {}
  async list(search?: string) {
    const q: any = { isActive: true };
    if (search) q.name = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: 'i' };
    return this.model.find(q).sort({ seniority: 1, name: 1 }).lean();
  }
  async find(id: string) {
    const d = await this.model.findOne({ _id: id, isActive: true }).lean();
    if (!d) throw new NotFoundException('Designation not found');
    return d;
  }
  async create(dto: CreateDesignationDto) {
    return this.model.create(dto);
  }
  async update(id: string, dto: UpdateDesignationDto) {
    const d = await this.model.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!d) throw new NotFoundException('Designation not found');
    return d;
  }
}
