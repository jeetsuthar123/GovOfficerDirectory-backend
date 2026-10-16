import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District, DistrictDocument } from './district.schema';
import { CreateDistrictDto, UpdateDistrictDto } from './dto';
@Injectable()
export class DistrictService {
  constructor(@InjectModel(District.name) private model: Model<DistrictDocument>) {}
  async list(search?: string) {
    const q: any = { isActive: true };
    if (search) q.name = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: 'i' };
    return this.model.find(q).sort({ name: 1 }).lean();
  }
  async find(id: string) {
    const d = await this.model.findOne({ _id: id, isActive: true }).lean();
    if (!d) throw new NotFoundException('District not found');
    return d;
  }
  async create(dto: CreateDistrictDto) {
    return this.model.create(dto);
  }
  async update(id: string, dto: UpdateDistrictDto) {
    const d = await this.model.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!d) throw new NotFoundException('District not found');
    return d;
  }
}
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
