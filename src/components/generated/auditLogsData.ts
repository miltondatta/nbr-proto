export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  moduleEn: string;
  moduleBn: string;
  actionTypeEn: string;
  actionTypeBn: string;
  severity: AuditSeverity;
  summaryEn: string;
  summaryBn: string;
  detailEn: string;
  detailBn: string;
  channel: 'Web App' | 'Mobile App' | 'System';
}

export const severityMeta: Record<AuditSeverity, {
  en: string;
  bn: string;
  color: string;
  icon: string;
}> = {
  info: {
    en: 'Info',
    bn: 'তথ্য',
    color: '#1E88E5',
    icon: 'info'
  },
  warning: {
    en: 'Warning',
    bn: 'সতর্কতা',
    color: '#B45309',
    icon: 'warning'
  },
  critical: {
    en: 'Critical',
    bn: 'সংকটাপন্ন',
    color: '#DC2626',
    icon: 'report'
  }
};

export const auditModules = ['Role Management', 'User Management', 'Workflow Management', 'Business Rules', 'Bond License Management', 'Entitlement Management', 'Co-efficient Management', 'Legal Procedures', 'Integration Monitoring', 'Message Queue', 'Push Notification', 'Lien Bank Portal'];

export const auditLogEntries: AuditLogEntry[] = [{
  id: 'a1',
  timestamp: '27 Jul 2026, 09:46',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'Integration Monitoring',
  moduleBn: 'ইন্টিগ্রেশন মনিটরিং',
  actionTypeEn: 'Connection Test',
  actionTypeBn: 'সংযোগ পরীক্ষা',
  severity: 'critical',
  summaryEn: 'VAT Online System connection test failed — service refused connection.',
  summaryBn: 'ভ্যাট অনলাইন সিস্টেম সংযোগ পরীক্ষা ব্যর্থ হয়েছে — সেবা সংযোগ প্রত্যাখ্যান করেছে।',
  detailEn: 'Manual test connection triggered from Integration Monitoring. Result: down. Last successful check was 27 Jul 2026, 08:30, before the scheduled maintenance window began.',
  detailBn: 'ইন্টিগ্রেশন মনিটরিং থেকে ম্যানুয়াল টেস্ট সংযোগ চালু করা হয়েছিল। ফলাফল: বিচ্ছিন্ন। সর্বশেষ সফল চেক ছিল ২৭ জুলাই ২০২৬, ০৮:৩০, নির্ধারিত রক্ষণাবেক্ষণ শুরুর আগে।',
  channel: 'Web App'
}, {
  id: 'a2',
  timestamp: '27 Jul 2026, 09:30',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'Workflow Management',
  moduleBn: 'ওয়ার্কফ্লো ব্যবস্থাপনা',
  actionTypeEn: 'Configuration Changed',
  actionTypeBn: 'কনফিগারেশন পরিবর্তিত',
  severity: 'warning',
  summaryEn: 'RO/ARO Field Verification SLA extended from 5 to 7 days on New Bond License Approval workflow.',
  summaryBn: 'নতুন বন্ড লাইসেন্স অনুমোদন ওয়ার্কফ্লোতে আরও/এআরও মাঠ যাচাই এসএলএ ৫ থেকে ৭ দিনে বাড়ানো হয়েছে।',
  detailEn: 'Workflow "New Bond License Approval" updated to version 3. Stage "RO/ARO Field Verification" SLA changed from 5 to 7 days.',
  detailBn: 'ওয়ার্কফ্লো "নতুন বন্ড লাইসেন্স অনুমোদন" সংস্করণ ৩-এ হালনাগাদ হয়েছে। "আরও/এআরও মাঠ যাচাই" স্টেজের এসএলএ ৫ থেকে ৭ দিনে পরিবর্তিত হয়েছে।',
  channel: 'Web App'
}, {
  id: 'a3',
  timestamp: '27 Jul 2026, 09:10',
  actor: 'System',
  actorRole: 'System',
  moduleEn: 'Message Queue',
  moduleBn: 'মেসেজ কিউ',
  actionTypeEn: 'Dead-Letter Event',
  actionTypeBn: 'ডেড-লেটার ইভেন্ট',
  severity: 'critical',
  summaryEn: 'Lien Bank Guarantee Sync — 5 messages moved to dead-letter queue after repeated failures.',
  summaryBn: 'লিয়েন ব্যাংক গ্যারান্টি সিঙ্ক — বারবার ব্যর্থতার পর ৫টি বার্তা ডেড-লেটার কিউতে স্থানান্তরিত হয়েছে।',
  detailEn: 'Topic lien-bank.guarantee reported 5 consecutive processing failures downstream at Inter-Bond Transfer consumer. Messages retained for manual requeue.',
  detailBn: 'টপিক lien-bank.guarantee ইন্টার-বন্ড স্থানান্তর কনজিউমারে পরপর ৫টি প্রসেসিং ব্যর্থতা রিপোর্ট করেছে। ম্যানুয়াল পুনরায় সারিবদ্ধকরণের জন্য বার্তা সংরক্ষিত।',
  channel: 'System'
}, {
  id: 'a4',
  timestamp: '26 Jul 2026, 16:40',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'Role Management',
  moduleBn: 'রোল ব্যবস্থাপনা',
  actionTypeEn: 'Created',
  actionTypeBn: 'তৈরি',
  severity: 'info',
  summaryEn: 'Custom role "Zone Audit Supervisor" created, cloned from System User permissions.',
  summaryBn: 'কাস্টম রোল "জোন অডিট সুপারভাইজার" তৈরি হয়েছে, সিস্টেম ইউজার পারমিশন থেকে ক্লোন করা হয়েছে।',
  detailEn: 'New custom role added to the permission matrix with individually adjusted module access levels.',
  detailBn: 'পারমিশন ম্যাট্রিক্সে পৃথকভাবে সামঞ্জস্যকৃত মডিউল অ্যাক্সেস স্তরসহ নতুন কাস্টম রোল যুক্ত হয়েছে।',
  channel: 'Web App'
}, {
  id: 'a5',
  timestamp: '26 Jul 2026, 15:05',
  actor: 'Md. Faridul Islam',
  actorRole: 'RO, Dhaka Zone-2',
  moduleEn: 'Bond License Management',
  moduleBn: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
  actionTypeEn: 'Approved',
  actionTypeBn: 'অনুমোদিত',
  severity: 'info',
  summaryEn: 'Field verification completed and approved for Bond License application BL-2026-0442.',
  summaryBn: 'বন্ড লাইসেন্স আবেদন BL-2026-0442-এর জন্য মাঠ যাচাই সম্পন্ন ও অনুমোদিত হয়েছে।',
  detailEn: 'RO/ARO Field Verification stage completed within SLA. Forwarded to AC/DC Document Review.',
  detailBn: 'আরও/এআরও মাঠ যাচাই স্টেজ এসএলএর মধ্যে সম্পন্ন হয়েছে। এসি/ডিসি নথি পর্যালোচনায় প্রেরিত।',
  channel: 'Mobile App'
}, {
  id: 'a6',
  timestamp: '26 Jul 2026, 14:20',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'Business Rules',
  moduleBn: 'বিজনেস রুলস',
  actionTypeEn: 'Configuration Changed',
  actionTypeBn: 'কনফিগারেশন পরিবর্তিত',
  severity: 'warning',
  summaryEn: 'Input-Output Co-efficient Tolerance tightened from 5% to 3%.',
  summaryBn: 'ইনপুট-আউটপুট কো-এফিসিয়েন্ট সহনশীলতা ৫% থেকে ৩%-এ কঠোর করা হয়েছে।',
  detailEn: 'Calculation parameter updated under Co-efficient & Machinery category. Effective immediately for new submissions.',
  detailBn: 'কো-এফিসিয়েন্ট ও মেশিনারি বিভাগের অধীনে গণনার প্যারামিটার হালনাগাদ হয়েছে। নতুন জমার জন্য অবিলম্বে কার্যকর।',
  channel: 'Web App'
}, {
  id: 'a7',
  timestamp: '26 Jul 2026, 11:50',
  actor: 'Sharmin Akter',
  actorRole: 'ARO, Gazipur Zone',
  moduleEn: 'Co-efficient Management',
  moduleBn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা',
  actionTypeEn: 'Updated',
  actionTypeBn: 'হালনাগাদ',
  severity: 'info',
  summaryEn: 'e-Calculation & Comparison Report generated for submission CE-2026-1187.',
  summaryBn: 'জমা CE-2026-1187-এর জন্য ই-ক্যালকুলেশন ও তুলনা প্রতিবেদন তৈরি হয়েছে।',
  detailEn: 'Comparison report generated after DEDO database match check passed.',
  detailBn: 'ডিইডিও ডাটাবেস মিল যাচাই সফল হওয়ার পর তুলনা প্রতিবেদন তৈরি হয়েছে।',
  channel: 'Web App'
}, {
  id: 'a8',
  timestamp: '25 Jul 2026, 17:15',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'User Management',
  moduleBn: 'ব্যবহারকারী ব্যবস্থাপনা',
  actionTypeEn: 'Deactivated',
  actionTypeBn: 'নিষ্ক্রিয়',
  severity: 'warning',
  summaryEn: 'User account for a former Assistant Revenue Officer deactivated after role transfer.',
  summaryBn: 'পদ স্থানান্তরের পর একজন প্রাক্তন সহকারী রাজস্ব কর্মকর্তার ব্যবহারকারী অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।',
  detailEn: 'Account deactivated; access to all 27 governed modules revoked immediately.',
  detailBn: 'অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে; ২৭টি নিয়ন্ত্রিত মডিউলে অ্যাক্সেস অবিলম্বে প্রত্যাহার করা হয়েছে।',
  channel: 'Web App'
}, {
  id: 'a9',
  timestamp: '25 Jul 2026, 10:05',
  actor: 'Kamruzzaman Bhuiyan',
  actorRole: 'RO, Chattogram Zone',
  moduleEn: 'Legal Procedures',
  moduleBn: 'আইনি প্রক্রিয়া',
  actionTypeEn: 'Escalated',
  actionTypeBn: 'এস্কেলেটেড',
  severity: 'warning',
  summaryEn: 'Case LP-2026-0093 escalated to Adjudication after hearing concluded.',
  summaryBn: 'শুনানি শেষ হওয়ার পর LP-2026-0093 মামলা বিচারাদেশে এস্কেলেট করা হয়েছে।',
  detailEn: 'Hearing stage marked complete; case forwarded to ADC/JC for adjudication per the configured escalation ladder.',
  detailBn: 'শুনানি স্টেজ সম্পন্ন চিহ্নিত হয়েছে; কনফিগার করা এস্কেলেশন সিঁড়ি অনুযায়ী মামলা বিচারাদেশের জন্য এডিসি/জেসি-তে প্রেরিত।',
  channel: 'Web App'
}, {
  id: 'a10',
  timestamp: '24 Jul 2026, 13:30',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'Workflow Management',
  moduleBn: 'ওয়ার্কফ্লো ব্যবস্থাপনা',
  actionTypeEn: 'Configuration Changed',
  actionTypeBn: 'কনফিগারেশন পরিবর্তিত',
  severity: 'info',
  summaryEn: 'Outsourced Provider Verification added as an exception branch on Co-efficient Validation workflow.',
  summaryBn: 'কো-এফিসিয়েন্ট যাচাইকরণ ওয়ার্কফ্লোতে আউটসোর্সড প্রোভাইডার যাচাই ব্যতিক্রম শাখা হিসাবে যুক্ত করা হয়েছে।',
  detailEn: 'Workflow updated to version 4. New exception-branch stage inserted after DEDO Database Match Check.',
  detailBn: 'ওয়ার্কফ্লো সংস্করণ ৪-এ হালনাগাদ হয়েছে। ডিইডিও ডাটাবেস মিল যাচাইয়ের পর নতুন ব্যতিক্রম-শাখা স্টেজ যুক্ত হয়েছে।',
  channel: 'Web App'
}, {
  id: 'a11',
  timestamp: '23 Jul 2026, 09:00',
  actor: 'System Admin',
  actorRole: 'System Admin',
  moduleEn: 'Bond License Management',
  moduleBn: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
  actionTypeEn: 'Created',
  actionTypeBn: 'তৈরি',
  severity: 'info',
  summaryEn: 'New Bond License Approval workflow configured from module defaults.',
  summaryBn: 'নতুন বন্ড লাইসেন্স অনুমোদন ওয়ার্কফ্লো মডিউল ডিফল্ট থেকে কনফিগার করা হয়েছে।',
  detailEn: 'Initial workflow version 1 created with six stages spanning submission to license issuance.',
  detailBn: 'জমা থেকে লাইসেন্স ইস্যু পর্যন্ত ছয়টি স্টেজসহ প্রাথমিক ওয়ার্কফ্লো সংস্করণ ১ তৈরি হয়েছে।',
  channel: 'Web App'
}];
