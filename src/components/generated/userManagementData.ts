import type { RoleTierId } from './roleManagementData';

export type AccountStatus = 'active' | 'suspended' | 'pending-activation';
export type AuthMethod = 'password-2fa' | 'password-only' | 'nid-otp';

export interface SystemUserRecord {
  id: string;
  nameEn: string;
  nameBn: string;
  designationEn: string;
  designationBn: string;
  roleTier: RoleTierId;
  email: string;
  phone: string;
  status: AccountStatus;
  authMethod: AuthMethod;
  lastLogin: string;
  createdDate: string;
}

export const authMethodLabels: Record<AuthMethod, { en: string; bn: string }> = {
  'password-2fa': { en: 'Password + 2FA', bn: 'পাসওয়ার্ড + টুএফএ' },
  'password-only': { en: 'Password Only', bn: 'শুধু পাসওয়ার্ড' },
  'nid-otp': { en: 'NID + OTP', bn: 'এনআইডি + ওটিপি' }
};

export const statusLabels: Record<AccountStatus, { en: string; bn: string; color: string }> = {
  active: { en: 'Active', bn: 'সক্রিয়', color: '#00A86B' },
  suspended: { en: 'Suspended', bn: 'স্থগিত', color: '#DC2626' },
  'pending-activation': { en: 'Pending Activation', bn: 'সক্রিয়করণ মুলতুবি', color: '#B45309' }
};

export const systemUsers: SystemUserRecord[] = [{
  id: 'USR-1001',
  nameEn: 'Tanvir Ahmed',
  nameBn: 'তানভীর আহমেদ',
  designationEn: 'System Manager',
  designationBn: 'সিস্টেম ম্যানেজার',
  roleTier: 'system-admin',
  email: 'tanvir.ahmed@nbr.gov.bd',
  phone: '+880 1811-100201',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '26 Jul 2026, 08:52',
  createdDate: '02 Jan 2022'
}, {
  id: 'USR-1002',
  nameEn: 'Nusrat Jahan',
  nameBn: 'নুসরাত জাহান',
  designationEn: 'Senior System Analyst',
  designationBn: 'সিনিয়র সিস্টেম অ্যানালিস্ট',
  roleTier: 'system-admin',
  email: 'nusrat.jahan@nbr.gov.bd',
  phone: '+880 1811-100202',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '25 Jul 2026, 18:10',
  createdDate: '14 Mar 2022'
}, {
  id: 'USR-1010',
  nameEn: 'Md. Abdur Rahman Chowdhury',
  nameBn: 'মোঃ আব্দুর রহমান চৌধুরী',
  designationEn: 'Chairman',
  designationBn: 'চেয়ারম্যান',
  roleTier: 'monitoring-authority',
  email: 'chairman@nbr.gov.bd',
  phone: '+880 1811-200101',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '24 Jul 2026, 11:05',
  createdDate: '10 Jan 2021'
}, {
  id: 'USR-1011',
  nameEn: 'Nasreen Sultana',
  nameBn: 'নাসরিন সুলতানা',
  designationEn: 'Commissioner',
  designationBn: 'কমিশনার',
  roleTier: 'monitoring-authority',
  email: 'nasreen.sultana@nbr.gov.bd',
  phone: '+880 1811-200102',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '26 Jul 2026, 09:30',
  createdDate: '05 Jun 2021'
}, {
  id: 'USR-1020',
  nameEn: 'Md. Faridul Islam',
  nameBn: 'মোঃ ফরিদুল ইসলাম',
  designationEn: 'Revenue Officer, Dhaka Zone-2',
  designationBn: 'রাজস্ব কর্মকর্তা, ঢাকা জোন-২',
  roleTier: 'system-user',
  email: 'faridul.islam@nbr.gov.bd',
  phone: '+880 1811-300301',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '26 Jul 2026, 09:14',
  createdDate: '18 Aug 2020'
}, {
  id: 'USR-1021',
  nameEn: 'Sharmin Akter',
  nameBn: 'শারমিন আক্তার',
  designationEn: 'Assistant Revenue Officer, Gazipur Zone',
  designationBn: 'সহকারী রাজস্ব কর্মকর্তা, গাজীপুর জোন',
  roleTier: 'system-user',
  email: 'sharmin.akter@nbr.gov.bd',
  phone: '+880 1811-300302',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '25 Jul 2026, 16:40',
  createdDate: '02 Feb 2021'
}, {
  id: 'USR-1022',
  nameEn: 'Kamruzzaman Bhuiyan',
  nameBn: 'কামরুজ্জামান ভূঁইয়া',
  designationEn: 'Revenue Officer, Chattogram Zone',
  designationBn: 'রাজস্ব কর্মকর্তা, চট্টগ্রাম জোন',
  roleTier: 'system-user',
  email: 'kamruzzaman.bhuiyan@nbr.gov.bd',
  phone: '+880 1811-300303',
  status: 'active',
  authMethod: 'password-only',
  lastLogin: '26 Jul 2026, 08:47',
  createdDate: '22 Sep 2021'
}, {
  id: 'USR-1023',
  nameEn: 'Mahfuzur Rahman',
  nameBn: 'মাহফুজুর রহমান',
  designationEn: 'Deputy Commissioner',
  designationBn: 'উপ কমিশনার',
  roleTier: 'system-user',
  email: 'mahfuzur.rahman@nbr.gov.bd',
  phone: '+880 1811-300304',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '23 Jul 2026, 14:22',
  createdDate: '11 Nov 2019'
}, {
  id: 'USR-1024',
  nameEn: 'Shirin Parveen',
  nameBn: 'শিরিন পারভীন',
  designationEn: 'Assistant Commissioner',
  designationBn: 'সহকারী কমিশনার',
  roleTier: 'system-user',
  email: 'shirin.parveen@nbr.gov.bd',
  phone: '+880 1811-300305',
  status: 'pending-activation',
  authMethod: 'password-only',
  lastLogin: '—',
  createdDate: '20 Jul 2026'
}, {
  id: 'USR-1025',
  nameEn: 'Aminul Haque',
  nameBn: 'আমিনুল হক',
  designationEn: 'Head Assistant',
  designationBn: 'হেড সহকারী',
  roleTier: 'system-user',
  email: 'aminul.haque@nbr.gov.bd',
  phone: '+880 1811-300306',
  status: 'suspended',
  authMethod: 'password-only',
  lastLogin: '02 Jun 2026, 10:15',
  createdDate: '15 May 2018'
}, {
  id: 'USR-1030',
  nameEn: 'Farida Yasmin',
  nameBn: 'ফরিদা ইয়াসমিন',
  designationEn: 'Member (VAT Policy)',
  designationBn: 'সদস্য (ভ্যাট নীতি)',
  roleTier: 'system-viewer',
  email: 'farida.yasmin@nbr.gov.bd',
  phone: '+880 1811-400401',
  status: 'active',
  authMethod: 'password-2fa',
  lastLogin: '21 Jul 2026, 13:00',
  createdDate: '08 Apr 2020'
}, {
  id: 'USR-1031',
  nameEn: 'Golam Mostafa',
  nameBn: 'গোলাম মোস্তফা',
  designationEn: 'First Secretary (Customs Valuation)',
  designationBn: 'প্রথম সচিব (কাস্টমস ভ্যালুয়েশন)',
  roleTier: 'system-viewer',
  email: 'golam.mostafa@nbr.gov.bd',
  phone: '+880 1811-400402',
  status: 'active',
  authMethod: 'password-only',
  lastLogin: '19 Jul 2026, 10:48',
  createdDate: '30 Oct 2020'
}, {
  id: 'USR-1040',
  nameEn: 'Square Fashions Ltd. (Bond Licensee)',
  nameBn: 'স্কয়ার ফ্যাশনস লিমিটেড (বন্ড লাইসেন্সধারী)',
  designationEn: 'Bond Licensee',
  designationBn: 'বন্ড লাইসেন্সধারী',
  roleTier: 'general-user',
  email: 'compliance@squarefashions.com.bd',
  phone: '+880 1711-223344',
  status: 'active',
  authMethod: 'nid-otp',
  lastLogin: '25 Jul 2026, 15:38',
  createdDate: '15 Jan 2026'
}, {
  id: 'USR-1041',
  nameEn: 'Beximco Textiles Limited (Bond Licensee)',
  nameBn: 'বেক্সিমকো টেক্সটাইলস লিমিটেড (বন্ড লাইসেন্সধারী)',
  designationEn: 'Bond Licensee',
  designationBn: 'বন্ড লাইসেন্সধারী',
  roleTier: 'general-user',
  email: 'bond@beximcotextiles.com.bd',
  phone: '+880 1713-889900',
  status: 'active',
  authMethod: 'nid-otp',
  lastLogin: '24 Jul 2026, 12:11',
  createdDate: '21 Jun 2023'
}, {
  id: 'USR-1042',
  nameEn: 'Sonali Bank, Motijheel Corporate Branch',
  nameBn: 'সোনালী ব্যাংক, মতিঝিল কর্পোরেট শাখা',
  designationEn: 'Lien Bank (AD Branch)',
  designationBn: 'লিয়েন ব্যাংক (এডি শাখা)',
  roleTier: 'general-user',
  email: 'motijheel.corporate@sonalibank.com.bd',
  phone: '+880 2-9551234',
  status: 'active',
  authMethod: 'password-only',
  lastLogin: '22 Jul 2026, 09:05',
  createdDate: '03 Feb 2021'
}, {
  id: 'USR-1043',
  nameEn: 'M. Karim & Associates (C&F Agent)',
  nameBn: 'এম করিম অ্যান্ড অ্যাসোসিয়েটস (সিএন্ডএফ এজেন্ট)',
  designationEn: 'Commercials / C&F Agent',
  designationBn: 'কমার্শিয়াল / সিএন্ডএফ এজেন্ট',
  roleTier: 'general-user',
  email: 'info@mkarimassociates.com.bd',
  phone: '+880 1911-556677',
  status: 'pending-activation',
  authMethod: 'nid-otp',
  lastLogin: '—',
  createdDate: '25 Jul 2026'
}];
