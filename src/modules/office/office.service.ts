import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Office, OfficeDocument } from './office.schema';
import { CreateOfficeDto, UpdateOfficeDto } from './dto';

function escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function assertId(id?: string) { if (id && !isValidObjectId(id)) throw new BadRequestException('Invalid MongoDB identifier'); }

@Injectable()
export class OfficeService {
  constructor(@InjectModel(Office.name) private model: Model<OfficeDocument>) {}

  async list(search?: string, districtId?: string, page = 1, limit = 20, departmentId?: string) {
    assertId(districtId); assertId(departmentId);
    const query: Record<string, any> = { isActive: true };
    if (search?.trim()) {
      const term = escapeRegex(search.trim().slice(0, 100));
      query.$or = [{ name: { $regex: term, $options: 'i' } }, { code: { $regex: term, $options: 'i' } }, { place: { $regex: term, $options: 'i' } }];
    }
    if (districtId) query.districtId = districtId;
    if (departmentId) query.departmentId = departmentId;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(query).populate('departmentId', 'name shortName code').populate('districtId', 'name code').sort({ name: 1 }).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async find(id: string) {
    assertId(id);
    const office = await this.model.findOne({ _id: id, isActive: true }).populate('departmentId', 'name shortName code').populate('districtId', 'name code').lean();
    if (!office) throw new NotFoundException('Office not found');
    return office;
  }

  async create(dto: CreateOfficeDto) { return this.model.create(dto); }
  async update(id: string, dto: UpdateOfficeDto) {
    assertId(id);
    const office = await this.model.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!office) throw new NotFoundException('Office not found');
    return office;
  }
}
