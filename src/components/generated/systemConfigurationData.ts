export type SettingType = 'text' | 'number' | 'toggle' | 'select';

export interface ConfigSection {
  id: string;
  en: string;
  bn: string;
  icon: string;
  color: string;
}

export interface ConfigSetting {
  id: string;
  sectionId: string;
  en: string;
  bn: string;
  descriptionEn: string;
  descriptionBn: string;
  type: SettingType;
  value: string | number | boolean;
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
  lastModified: string;
}

export interface SystemInfoItem {
  id: string;
  en: string;
  bn: string;
  value: string;
  icon: string;
}

export interface ConfigHistoryEntry {
  id: string;
  timestamp: string;
  actor: string;
  en: string;
  bn: string;
}

export const configSections: ConfigSection[] = [{
  id: 'general',
  en: 'General',
  bn: 'সাধারণ',
  icon: 'tune',
  color: '#0A4D8C'
}, {
  id: 'security',
  en: 'Security Policy',
  bn: 'নিরাপত্তা নীতি',
  icon: 'security',
  color: '#DC2626'
}, {
  id: 'file-upload',
  en: 'File & Upload',
  bn: 'ফাইল ও আপলোড',
  icon: 'upload_file',
  color: '#1E88E5'
}, {
  id: 'maintenance',
  en: 'Maintenance & Backup',
  bn: 'রক্ষণাবেক্ষণ ও ব্যাকআপ',
  icon: 'build',
  color: '#B45309'
}];

export const configSettings: ConfigSetting[] = [{
  id: 's-portal-name-en',
  sectionId: 'general',
  en: 'Portal Name (English)',
  bn: 'পোর্টালের নাম (ইংরেজি)',
  descriptionEn: 'Displayed in the header and browser title across the portal.',
  descriptionBn: 'পোর্টাল জুড়ে হেডার ও ব্রাউজার টাইটেলে প্রদর্শিত হয়।',
  type: 'text',
  value: 'Customs Bond Management System',
  lastModified: '10 Jul 2026'
}, {
  id: 's-default-language',
  sectionId: 'general',
  en: 'Default Language',
  bn: 'ডিফল্ট ভাষা',
  descriptionEn: 'Language shown to a user on first login before they switch manually.',
  descriptionBn: 'ব্যবহারকারী ম্যানুয়ালি পরিবর্তন করার আগে প্রথম লগইনে যে ভাষা দেখানো হয়।',
  type: 'select',
  value: 'English',
  options: ['English', 'বাংলা'],
  lastModified: '10 Jul 2026'
}, {
  id: 's-date-format',
  sectionId: 'general',
  en: 'Date Format',
  bn: 'তারিখের ফরম্যাট',
  descriptionEn: 'Format used to display dates across all modules and reports.',
  descriptionBn: 'সকল মডিউল ও প্রতিবেদন জুড়ে তারিখ প্রদর্শনে ব্যবহৃত ফরম্যাট।',
  type: 'select',
  value: 'DD MMM YYYY',
  options: ['DD MMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
  lastModified: '10 Jul 2026'
}, {
  id: 's-timezone',
  sectionId: 'general',
  en: 'Timezone',
  bn: 'টাইমজোন',
  descriptionEn: 'System-wide timezone used for timestamps and SLA calculations.',
  descriptionBn: 'টাইমস্ট্যাম্প ও এসএলএ গণনায় ব্যবহৃত সিস্টেম-ব্যাপী টাইমজোন।',
  type: 'select',
  value: 'Asia/Dhaka (GMT+6)',
  options: ['Asia/Dhaka (GMT+6)'],
  lastModified: '10 Jul 2026'
}, {
  id: 's-session-timeout',
  sectionId: 'general',
  en: 'Session Timeout',
  bn: 'সেশন টাইমআউট',
  descriptionEn: 'How long an inactive session stays logged in before requiring re-authentication.',
  descriptionBn: 'পুনরায় প্রমাণীকরণ প্রয়োজন হওয়ার আগে একটি নিষ্ক্রিয় সেশন কতক্ষণ লগইন থাকে।',
  type: 'number',
  value: 30,
  unit: 'minutes',
  min: 5,
  max: 240,
  lastModified: '15 Jul 2026'
}, {
  id: 's-min-password-length',
  sectionId: 'security',
  en: 'Minimum Password Length',
  bn: 'সর্বনিম্ন পাসওয়ার্ডের দৈর্ঘ্য',
  descriptionEn: 'Minimum number of characters required for any system user password.',
  descriptionBn: 'যেকোনো সিস্টেম ব্যবহারকারীর পাসওয়ার্ডের জন্য প্রয়োজনীয় সর্বনিম্ন অক্ষর সংখ্যা।',
  type: 'number',
  value: 10,
  unit: 'characters',
  min: 6,
  max: 32,
  lastModified: '15 Jul 2026'
}, {
  id: 's-password-expiry',
  sectionId: 'security',
  en: 'Password Expiry',
  bn: 'পাসওয়ার্ডের মেয়াদ',
  descriptionEn: 'Number of days before a user is required to change their password.',
  descriptionBn: 'ব্যবহারকারীকে পাসওয়ার্ড পরিবর্তন করতে হওয়ার আগে দিনের সংখ্যা।',
  type: 'number',
  value: 90,
  unit: 'days',
  min: 30,
  max: 365,
  lastModified: '15 Jul 2026'
}, {
  id: 's-lockout-threshold',
  sectionId: 'security',
  en: 'Failed Login Lockout Threshold',
  bn: 'ব্যর্থ লগইন লকআউট থ্রেশহোল্ড',
  descriptionEn: 'Number of consecutive failed login attempts before an account is temporarily locked.',
  descriptionBn: 'একটি অ্যাকাউন্ট সাময়িকভাবে লক হওয়ার আগে পরপর ব্যর্থ লগইন প্রচেষ্টার সংখ্যা।',
  type: 'number',
  value: 5,
  unit: 'attempts',
  min: 3,
  max: 10,
  lastModified: '15 Jul 2026'
}, {
  id: 's-two-factor',
  sectionId: 'security',
  en: 'Two-Factor Authentication',
  bn: 'দ্বি-স্তর প্রমাণীকরণ',
  descriptionEn: 'Require an OTP in addition to password for System Admin and Monitoring Authority users.',
  descriptionBn: 'সিস্টেম অ্যাডমিন ও মনিটরিং অথরিটি ব্যবহারকারীদের জন্য পাসওয়ার্ডের পাশাপাশি ওটিপি প্রয়োজন।',
  type: 'toggle',
  value: true,
  lastModified: '18 Jul 2026'
}, {
  id: 's-idle-logout',
  sectionId: 'security',
  en: 'Idle Session Auto-Logout',
  bn: 'নিষ্ক্রিয় সেশন স্বয়ংক্রিয়-লগআউট',
  descriptionEn: 'Automatically end a session once the configured Session Timeout is reached.',
  descriptionBn: 'কনফিগার করা সেশন টাইমআউট পৌঁছালে স্বয়ংক্রিয়ভাবে সেশন শেষ করুন।',
  type: 'toggle',
  value: true,
  lastModified: '18 Jul 2026'
}, {
  id: 's-max-upload-size',
  sectionId: 'file-upload',
  en: 'Max Upload File Size',
  bn: 'সর্বোচ্চ আপলোড ফাইল সাইজ',
  descriptionEn: 'Largest single file size accepted for document uploads across all modules.',
  descriptionBn: 'সকল মডিউল জুড়ে নথি আপলোডের জন্য গৃহীত সর্বোচ্চ একক ফাইল সাইজ।',
  type: 'number',
  value: 10,
  unit: 'MB',
  min: 1,
  max: 50,
  lastModified: '12 Jul 2026'
}, {
  id: 's-allowed-file-types',
  sectionId: 'file-upload',
  en: 'Allowed File Types',
  bn: 'অনুমোদিত ফাইলের ধরন',
  descriptionEn: 'Comma-separated list of file extensions accepted for document uploads.',
  descriptionBn: 'নথি আপলোডের জন্য গৃহীত ফাইল এক্সটেনশনের কমা-বিভক্ত তালিকা।',
  type: 'text',
  value: 'pdf, jpg, png, docx, xlsx',
  lastModified: '12 Jul 2026'
}, {
  id: 's-doc-retention',
  sectionId: 'file-upload',
  en: 'Document Retention Period',
  bn: 'নথি সংরক্ষণকাল',
  descriptionEn: 'Number of years uploaded documents are retained before archival.',
  descriptionBn: 'আর্কাইভ হওয়ার আগে আপলোডকৃত নথি সংরক্ষিত থাকার বছরের সংখ্যা।',
  type: 'number',
  value: 7,
  unit: 'years',
  min: 1,
  max: 20,
  lastModified: '12 Jul 2026'
}, {
  id: 's-maintenance-mode',
  sectionId: 'maintenance',
  en: 'Maintenance Mode',
  bn: 'রক্ষণাবেক্ষণ মোড',
  descriptionEn: 'When enabled, only System Admin users can log in; all others see the maintenance message.',
  descriptionBn: 'সক্রিয় হলে, শুধুমাত্র সিস্টেম অ্যাডমিন ব্যবহারকারীরা লগইন করতে পারবেন; বাকি সবাই রক্ষণাবেক্ষণ বার্তা দেখবেন।',
  type: 'toggle',
  value: false,
  lastModified: '05 Jul 2026'
}, {
  id: 's-maintenance-message',
  sectionId: 'maintenance',
  en: 'Maintenance Message',
  bn: 'রক্ষণাবেক্ষণ বার্তা',
  descriptionEn: 'Message shown to users while Maintenance Mode is active.',
  descriptionBn: 'রক্ষণাবেক্ষণ মোড সক্রিয় থাকাকালীন ব্যবহারকারীদের দেখানো বার্তা।',
  type: 'text',
  value: 'CBMS is undergoing scheduled maintenance. Please try again later.',
  lastModified: '05 Jul 2026'
}, {
  id: 's-backup-frequency',
  sectionId: 'maintenance',
  en: 'Backup Frequency',
  bn: 'ব্যাকআপের সময়সীমা',
  descriptionEn: 'How often a full database backup is scheduled.',
  descriptionBn: 'কত ঘন ঘন সম্পূর্ণ ডাটাবেস ব্যাকআপ নির্ধারিত হয়।',
  type: 'select',
  value: 'Daily',
  options: ['Daily', 'Weekly', 'Monthly'],
  lastModified: '05 Jul 2026'
}];

export const systemInfoItems: SystemInfoItem[] = [{
  id: 'info-version',
  en: 'Application Version',
  bn: 'অ্যাপ্লিকেশন সংস্করণ',
  value: 'CBMS v1.4.0',
  icon: 'info'
}, {
  id: 'info-environment',
  en: 'Environment',
  bn: 'পরিবেশ',
  value: 'Production (NBR Data Center)',
  icon: 'dns'
}, {
  id: 'info-last-deploy',
  en: 'Last Deployment',
  bn: 'সর্বশেষ ডিপ্লয়মেন্ট',
  value: '26 Jul 2026, 22:10',
  icon: 'rocket_launch'
}, {
  id: 'info-db-status',
  en: 'Database Status',
  bn: 'ডাটাবেস অবস্থা',
  value: 'Healthy — 12ms avg. query time',
  icon: 'database'
}, {
  id: 'info-last-backup',
  en: 'Last Successful Backup',
  bn: 'সর্বশেষ সফল ব্যাকআপ',
  value: '27 Jul 2026, 03:00',
  icon: 'backup'
}, {
  id: 'info-uptime',
  en: 'System Uptime',
  bn: 'সিস্টেম আপটাইম',
  value: '46 days, 8 hours',
  icon: 'schedule'
}];

export const configHistorySeed: ConfigHistoryEntry[] = [{
  id: 'ch1',
  timestamp: '18 Jul 2026',
  actor: 'System Admin',
  en: 'Two-Factor Authentication enabled for System Admin and Monitoring Authority users.',
  bn: 'সিস্টেম অ্যাডমিন ও মনিটরিং অথরিটি ব্যবহারকারীদের জন্য দ্বি-স্তর প্রমাণীকরণ সক্রিয় করা হয়েছে।'
}, {
  id: 'ch2',
  timestamp: '15 Jul 2026',
  actor: 'System Admin',
  en: 'Session Timeout reduced from 60 to 30 minutes as a security hardening measure.',
  bn: 'নিরাপত্তা কঠোরকরণের ব্যবস্থা হিসাবে সেশন টাইমআউট ৬০ থেকে ৩০ মিনিটে কমানো হয়েছে।'
}, {
  id: 'ch3',
  timestamp: '05 Jul 2026',
  actor: 'System Admin',
  en: 'Backup Frequency confirmed as Daily following infrastructure review.',
  bn: 'অবকাঠামো পর্যালোচনার পর ব্যাকআপের সময়সীমা দৈনিক হিসাবে নিশ্চিত করা হয়েছে।'
}];
