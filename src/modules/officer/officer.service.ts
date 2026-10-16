import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Officer, OfficerDocument } from './officer.schema';
import { CreateOfficerDto, UpdateOfficerDto } from './dto';
import { Office, OfficeDocument } from '../office/office.schema';

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function assertId(id?: string) {
  if (id && !isValidObjectId(id)) throw new BadRequestException('Invalid MongoDB identifier');
}

@Injectable()
export class OfficerService {
  constructor(
    @InjectModel(Officer.name) private model: Model<OfficerDocument>,
    @InjectModel(Office.name) private offices: Model<OfficeDocument>,
  ) {}

  async list(
    search?: string,
    designationId?: string,
    districtId?: string,
    officeId?: string,
    page = 1,
    limit = 20,
    departmentId?: string,
  ) {
    assertId(designationId);
    assertId(districtId);
    assertId(officeId);
    assertId(departmentId);
    const query: Record<string, any> = { isActive: true, isPublic: true };
    if (search?.trim()) {
      const term = escapeRegex(search.trim().slice(0, 100));
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { employeeCode: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { mobile: { $regex: term, $options: 'i' } },
      ];
    }
    if (designationId) query.designationId = designationId;
    if (districtId) query.districtId = districtId;
    if (departmentId) {
      const matchingOffices = await this.offices
        .find({ departmentId: new Types.ObjectId(departmentId), isActive: true })
        .distinct('_id');
      if (officeId)
        query.officeId = matchingOffices.some((id) => String(id) === officeId)
          ? officeId
          : { $in: [] };
      else query.officeId = { $in: matchingOffices };
    } else if (officeId) {
      query.officeId = officeId;
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .populate('designationId', 'name code level seniority')
        .populate({
          path: 'officeId',
          select: 'name code address place phone email latitude longitude departmentId',
          populate: { path: 'departmentId', select: 'name shortName code' },
        })
        .populate('districtId', 'name code')
        .sort({ designationSeniority: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);
    return {
      success: true,
      message: 'Officers fetched successfully',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async find(id: string) {
    assertId(id);
    const officer = await this.model
      .findOne({ _id: id, isActive: true, isPublic: true })
      .populate('designationId', 'name code level seniority')
      .populate({
        path: 'officeId',
        select: 'name code address place phone email latitude longitude departmentId',
        populate: { path: 'departmentId', select: 'name shortName code' },
      })
      .populate('districtId', 'name code')
      .lean();
    if (!officer) throw new NotFoundException('Officer not found');
    return officer;
  }

  async create(dto: CreateOfficerDto) {
    return this.model.create(dto);
  }
  async update(id: string, dto: UpdateOfficerDto) {
    assertId(id);
    const officer = await this.model.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!officer) throw new NotFoundException('Officer not found');
    return officer;
  }
}
