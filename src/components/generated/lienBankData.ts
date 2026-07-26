export type PortalStatus = 'authorized' | 'pending-authorization' | 'not-onboarded';

export interface LienBankBranch {
  id: string;
  nameEn: string;
  nameBn: string;
  branchCode: string;
  address: string;
  contactOfficer: string;
  contactPhone: string;
  contactEmail: string;
}

export interface LienBank {
  bankCode: string;
  nameEn: string;
  nameBn: string;
  portalStatus: PortalStatus;
  mainBranch: LienBankBranch;
  adBranches: LienBankBranch[];
}

export const portalStatusLabels: Record<PortalStatus, {en: string;bn: string;color: string;}> = {
  authorized: { en: 'Portal Authorized', bn: 'পোর্টাল অনুমোদিত', color: '#00A86B' },
  'pending-authorization': { en: 'Pending CBC Authorization', bn: 'সিবিসি অনুমোদনের অপেক্ষায়', color: '#B45309' },
  'not-onboarded': { en: 'Not Onboarded', bn: 'নিবন্ধিত নয়', color: '#94A3B8' }
};

export const lienBanks: LienBank[] = [
{
  bankCode: 'SBL',
  nameEn: 'Sonali Bank',
  nameBn: 'সোনালী ব্যাংক',
  portalStatus: 'authorized',
  mainBranch: {
    id: 'SBL-MAIN',
    nameEn: 'Motijheel Corporate Branch',
    nameBn: 'মতিঝিল কর্পোরেট শাখা',
    branchCode: 'SBL-0001',
    address: '35-42 Motijheel C/A, Dhaka-1000',
    contactOfficer: 'Md. Anisur Rahman',
    contactPhone: '+880 2-9551234',
    contactEmail: 'motijheel.corp@sonalibank.com.bd'
  },
  adBranches: [
  { id: 'SBL-AD1', nameEn: 'Savar Branch', nameBn: 'সাভার শাখা', branchCode: 'SBL-0114', address: 'Savar Bazar Road, Savar, Dhaka', contactOfficer: 'Nasima Begum', contactPhone: '+880 1711-330011', contactEmail: 'savar.branch@sonalibank.com.bd' },
  { id: 'SBL-AD2', nameEn: 'Agrabad Corporate Branch', nameBn: 'আগ্রাবাদ কর্পোরেট শাখা', branchCode: 'SBL-0209', address: 'Agrabad C/A, Chattogram', contactOfficer: 'Kazi Reazul Karim', contactPhone: '+880 1712-441122', contactEmail: 'agrabad.corp@sonalibank.com.bd' },
  { id: 'SBL-AD3', nameEn: 'Gazipur Branch', nameBn: 'গাজীপুর শাখা', branchCode: 'SBL-0318', address: 'Chandana Chowrasta, Gazipur', contactOfficer: 'Farhana Yasmin', contactPhone: '+880 1713-552233', contactEmail: 'gazipur.branch@sonalibank.com.bd' }]

},
{
  bankCode: 'SCB',
  nameEn: 'Standard Chartered Bank',
  nameBn: 'স্ট্যান্ডার্ড চার্টার্ড ব্যাংক',
  portalStatus: 'authorized',
  mainBranch: {
    id: 'SCB-MAIN',
    nameEn: 'Gulshan Branch',
    nameBn: 'গুলশান শাখা',
    branchCode: 'SCB-0001',
    address: 'Gulshan Avenue, Gulshan-1, Dhaka-1212',
    contactOfficer: 'Tanvir Ahmed',
    contactPhone: '+880 2-8837400',
    contactEmail: 'trade.gulshan@sc.com'
  },
  adBranches: []
},
{
  bankCode: 'EBL',
  nameEn: 'Eastern Bank Limited',
  nameBn: 'ইস্টার্ন ব্যাংক লিমিটেড',
  portalStatus: 'authorized',
  mainBranch: {
    id: 'EBL-MAIN',
    nameEn: 'Motijheel Branch',
    nameBn: 'মতিঝিল শাখা',
    branchCode: 'EBL-0001',
    address: 'Jiban Bima Bhaban, Motijheel C/A, Dhaka',
    contactOfficer: 'Shirin Sultana',
    contactPhone: '+880 2-9563401',
    contactEmail: 'trade.motijheel@ebl.com.bd'
  },
  adBranches: [
  { id: 'EBL-AD1', nameEn: 'Narayanganj Branch', nameBn: 'নারায়ণগঞ্জ শাখা', branchCode: 'EBL-0142', address: 'Chashara, Narayanganj', contactOfficer: 'Mizanur Rahman', contactPhone: '+880 1714-663344', contactEmail: 'narayanganj.branch@ebl.com.bd' },
  { id: 'EBL-AD2', nameEn: 'Savar Branch', nameBn: 'সাভার শাখা', branchCode: 'EBL-0177', address: 'Savar Bus Stand, Savar, Dhaka', contactOfficer: 'Ruhul Amin', contactPhone: '+880 1715-774455', contactEmail: 'savar.branch@ebl.com.bd' }]

},
{
  bankCode: 'DBBL',
  nameEn: 'Dutch-Bangla Bank Limited',
  nameBn: 'ডাচ-বাংলা ব্যাংক লিমিটেড',
  portalStatus: 'authorized',
  mainBranch: {
    id: 'DBBL-MAIN',
    nameEn: 'Agrabad Branch',
    nameBn: 'আগ্রাবাদ শাখা',
    branchCode: 'DBBL-0001',
    address: 'Agrabad C/A, Chattogram',
    contactOfficer: 'Golam Mostafa',
    contactPhone: '+880 31-2510098',
    contactEmail: 'trade.agrabad@dbbl.com.bd'
  },
  adBranches: [
  { id: 'DBBL-AD1', nameEn: 'Gazipur Branch', nameBn: 'গাজীপুর শাখা', branchCode: 'DBBL-0133', address: 'Board Bazar, Gazipur', contactOfficer: 'Selina Akter', contactPhone: '+880 1716-885566', contactEmail: 'gazipur.branch@dbbl.com.bd' },
  { id: 'DBBL-AD2', nameEn: 'Narayanganj Branch', nameBn: 'নারায়ণগঞ্জ শাখা', branchCode: 'DBBL-0158', address: 'Tanbazar, Narayanganj', contactOfficer: 'Jashim Uddin', contactPhone: '+880 1717-996677', contactEmail: 'narayanganj.branch@dbbl.com.bd' }]

},
{
  bankCode: 'PBL',
  nameEn: 'Prime Bank Limited',
  nameBn: 'প্রাইম ব্যাংক লিমিটেড',
  portalStatus: 'pending-authorization',
  mainBranch: {
    id: 'PBL-MAIN',
    nameEn: 'Dilkusha Corporate Branch',
    nameBn: 'দিলকুশা কর্পোরেট শাখা',
    branchCode: 'PBL-0001',
    address: 'Adamjee Court, Motijheel C/A, Dhaka',
    contactOfficer: 'Nazmul Haque',
    contactPhone: '+880 2-9553877',
    contactEmail: 'trade.dilkusha@primebank.com.bd'
  },
  adBranches: []
}];

export function bankByCode(bankCode: string): LienBank | undefined {
  return lienBanks.find((b) => b.bankCode === bankCode);
}

export function branchLabel(branch: LienBankBranch, lang: 'en' | 'bn'): string {
  return lang === 'en' ? branch.nameEn : branch.nameBn;
}