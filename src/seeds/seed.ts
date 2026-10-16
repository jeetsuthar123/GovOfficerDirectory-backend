import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Department, DepartmentSchema } from '../modules/department/department.schema';
import { District, DistrictSchema } from '../modules/district/district.schema';
import { Designation, DesignationSchema } from '../modules/designation/designation.schema';
import { Office, OfficeSchema } from '../modules/office/office.schema';
import { Officer, OfficerSchema } from '../modules/officer/officer.schema';
import { Admin, AdminSchema } from '../modules/auth/admin.schema';

async function seed() {
  await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gov_officer_directory',
  );
  const db = mongoose.connection;
  const departments = db.model(Department.name, DepartmentSchema);
  const districts = db.model(District.name, DistrictSchema);
  const designations = db.model(Designation.name, DesignationSchema);
  const offices = db.model(Office.name, OfficeSchema);
  const officers = db.model(Officer.name, OfficerSchema);
  const admins = db.model(Admin.name, AdminSchema);

  // Idempotent demo seed. Existing records are preserved; demo office ownership is backfilled.
  const departmentRows = [
    {
      name: 'Department of Government Services',
      shortName: 'Government Services',
      code: 'DEPT001',
      description: 'Sample department for local development.',
      website: 'https://example.gov.in',
      email: 'info@example.gov.in',
      phone: '0141-2220000',
      address: 'Government Secretariat, Rajasthan',
      isActive: true,
    },
    {
      name: 'Department of Information Technology',
      shortName: 'IT Department',
      code: 'DEPT002',
      description: 'Sample IT department for local development.',
      website: 'https://example.gov.in',
      email: 'it@example.gov.in',
      phone: '0141-2220001',
      address: 'Jaipur, Rajasthan',
      isActive: true,
    },
  ];
  for (const row of departmentRows)
    await departments.updateOne({ code: row.code }, { $setOnInsert: row }, { upsert: true });
  const departmentDocs = await departments
    .find({ code: { $in: departmentRows.map((x) => x.code) } })
    .lean();
  const depmap = Object.fromEntries(departmentDocs.map((x) => [x.code, x._id] as const));

  const districtRows = [
    { name: 'Bikaner', code: 'BIK' },
    { name: 'Jaipur', code: 'JAI' },
    { name: 'Jodhpur', code: 'JOD' },
    { name: 'Kota', code: 'KOT' },
  ];
  for (const row of districtRows)
    await districts.updateOne(
      { code: row.code },
      { $setOnInsert: { ...row, isActive: true } },
      { upsert: true },
    );
  const districtDocs = await districts
    .find({ code: { $in: districtRows.map((x) => x.code) } })
    .lean();
  const dmap = Object.fromEntries(districtDocs.map((x) => [x.code, x._id] as const));

  const designationRows = [
    { name: 'Director', code: 'DIR', level: 1, seniority: 1, description: 'Department leadership' },
    {
      name: 'Deputy Director',
      code: 'DD',
      level: 2,
      seniority: 2,
      description: 'Senior departmental officer',
    },
    {
      name: 'Assistant Director',
      code: 'AD',
      level: 3,
      seniority: 3,
      description: 'Department officer',
    },
    {
      name: 'Administrative Officer',
      code: 'AO',
      level: 4,
      seniority: 4,
      description: 'Administrative operations',
    },
  ];
  for (const row of designationRows)
    await designations.updateOne(
      { code: row.code },
      { $setOnInsert: { ...row, isActive: true } },
      { upsert: true },
    );
  const designationDocs = await designations
    .find({ code: { $in: designationRows.map((x) => x.code) } })
    .lean();
  const gmap = Object.fromEntries(designationDocs.map((x) => [x.code, x._id] as const));

  const officeRows = [
    {
      name: 'Head Office',
      code: 'HO',
      departmentId: depmap.DEPT001,
      districtId: dmap.JAI,
      address: 'Government Secretariat, Jaipur',
      phone: '0141-2220001',
      officeType: 'Head Office',
      latitude: 26.9124,
      longitude: 75.7873,
    },
    {
      name: 'District Office Bikaner',
      code: 'DOB',
      departmentId: depmap.DEPT001,
      districtId: dmap.BIK,
      address: 'District Office Campus, Bikaner',
      phone: '0151-2220002',
      officeType: 'District Office',
      latitude: 28.0229,
      longitude: 73.3119,
    },
    {
      name: 'Regional Office Jodhpur',
      code: 'ROJ',
      departmentId: depmap.DEPT002,
      districtId: dmap.JOD,
      address: 'Regional Office Campus, Jodhpur',
      phone: '0291-2220003',
      officeType: 'Regional Office',
      latitude: 26.2389,
      longitude: 73.0243,
    },
    {
      name: 'District Office Kota',
      code: 'DOK',
      departmentId: depmap.DEPT002,
      districtId: dmap.KOT,
      address: 'District Office Campus, Kota',
      phone: '0744-2220004',
      officeType: 'District Office',
      latitude: 25.2138,
      longitude: 75.8648,
    },
  ];
  for (const row of officeRows) {
    const { departmentId, ...officeFields } = row;
    await offices.updateOne(
      { code: row.code },
      { $set: { departmentId }, $setOnInsert: { ...officeFields, isActive: true } },
      { upsert: true },
    );
  }
  const officeDocs = await offices.find({ code: { $in: officeRows.map((x) => x.code) } }).lean();
  const omap = Object.fromEntries(officeDocs.map((x) => [x.code, x._id] as const));

  const officerRows = [
    {
      employeeCode: 'EMP001',
      name: 'Rajesh Kumar',
      dob: new Date('1980-04-12T00:00:00.000Z'),
      designationId: gmap.DIR,
      officeId: omap.HO,
      districtId: dmap.JAI,
      mobile: '+919876543210',
      email: 'rajesh.kumar@example.gov.in',
      designationSeniority: 1,
    },
    {
      employeeCode: 'EMP002',
      name: 'Anil Sharma',
      dob: new Date('1984-09-25T00:00:00.000Z'),
      designationId: gmap.DD,
      officeId: omap.DOB,
      districtId: dmap.BIK,
      mobile: '+919876543211',
      email: 'anil.sharma@example.gov.in',
      designationSeniority: 2,
    },
    {
      employeeCode: 'EMP003',
      name: 'Priya Singh',
      dob: new Date('1987-01-08T00:00:00.000Z'),
      designationId: gmap.AD,
      officeId: omap.HO,
      districtId: dmap.JAI,
      mobile: '+919876543212',
      email: 'priya.singh@example.gov.in',
      designationSeniority: 3,
    },
    {
      employeeCode: 'EMP004',
      name: 'Mohit Joshi',
      dob: new Date('1982-06-17T00:00:00.000Z'),
      designationId: gmap.AO,
      officeId: omap.ROJ,
      districtId: dmap.JOD,
      mobile: '+919876543213',
      email: 'mohit.joshi@example.gov.in',
      designationSeniority: 4,
    },
    {
      employeeCode: 'EMP005',
      name: 'Neha Verma',
      dob: new Date('1988-11-03T00:00:00.000Z'),
      designationId: gmap.DD,
      officeId: omap.DOK,
      districtId: dmap.KOT,
      mobile: '+919876543214',
      email: 'neha.verma@example.gov.in',
      designationSeniority: 2,
    },
  ];
  for (const row of officerRows)
    await officers.updateOne(
      { employeeCode: row.employeeCode },
      { $setOnInsert: { ...row, isActive: true, isPublic: true } },
      { upsert: true },
    );

  if (!(await admins.exists({ username: 'admin' }))) {
    await admins.create({
      username: 'admin',
      passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@123', 12),
      role: 'ADMIN',
      isActive: true,
    });
  }
  console.log(
    'Seed complete. Sample admin: admin / Admin@123 (unless SEED_ADMIN_PASSWORD was set). Existing records were preserved.',
  );
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
