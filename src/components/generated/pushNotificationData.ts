export type NotificationPriority = 'high' | 'normal' | 'low';

export interface NotificationChannels {
  inApp: boolean;
  sms: boolean;
  email: boolean;
}

export interface NotificationTemplate {
  id: string;
  eventKey: string;
  en: string;
  bn: string;
  triggerModuleEn: string;
  triggerModuleBn: string;
  bodyEn: string;
  bodyBn: string;
  channels: NotificationChannels;
  priority: NotificationPriority;
  active: boolean;
  lastModified: string;
}

export interface BroadcastLogEntry {
  id: string;
  timestamp: string;
  templateEn: string;
  templateBn: string;
  recipients: number;
  deliveredInstant: number;
  queuedOffline: number;
}

export const priorityMeta: Record<NotificationPriority, {
  en: string;
  bn: string;
  color: string;
}> = {
  high: {
    en: 'High',
    bn: 'উচ্চ',
    color: '#DC2626'
  },
  normal: {
    en: 'Normal',
    bn: 'স্বাভাবিক',
    color: '#1E88E5'
  },
  low: {
    en: 'Low',
    bn: 'নিম্ন',
    color: '#64748B'
  }
};

export const notificationTemplates: NotificationTemplate[] = [{
  id: 'tpl-approval-pending',
  eventKey: 'approval_pending',
  en: 'Approval Pending',
  bn: 'অনুমোদন মুলতুবি',
  triggerModuleEn: 'Bond License Management',
  triggerModuleBn: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
  bodyEn: 'You have a new {{stageName}} approval pending for {{referenceNo}}.',
  bodyBn: '{{referenceNo}}-এর জন্য একটি নতুন {{stageName}} অনুমোদন মুলতুবি রয়েছে।',
  channels: {
    inApp: true,
    sms: true,
    email: true
  },
  priority: 'high',
  active: true,
  lastModified: '22 Jul 2026'
}, {
  id: 'tpl-entitlement-approved',
  eventKey: 'entitlement_approved',
  en: 'Entitlement Approved',
  bn: 'এনটাইটেলমেন্ট অনুমোদিত',
  triggerModuleEn: 'Entitlement Management',
  triggerModuleBn: 'এনটাইটেলমেন্ট ব্যবস্থাপনা',
  bodyEn: 'Your entitlement request {{referenceNo}} has been approved.',
  bodyBn: 'আপনার এনটাইটেলমেন্ট অনুরোধ {{referenceNo}} অনুমোদিত হয়েছে।',
  channels: {
    inApp: true,
    sms: false,
    email: true
  },
  priority: 'normal',
  active: true,
  lastModified: '20 Jul 2026'
}, {
  id: 'tpl-coefficient-exception',
  eventKey: 'coefficient_exception',
  en: 'Co-efficient Validation Exception',
  bn: 'কো-এফিসিয়েন্ট যাচাই ব্যতিক্রম',
  triggerModuleEn: 'Co-efficient Management',
  triggerModuleBn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা',
  bodyEn: 'Submission {{referenceNo}} was routed to Outsourced Provider Verification — no DEDO match found.',
  bodyBn: 'জমা {{referenceNo}} আউটসোর্সড প্রোভাইডার যাচাইয়ে পাঠানো হয়েছে — কোনো ডিইডিও মিল পাওয়া যায়নি।',
  channels: {
    inApp: true,
    sms: false,
    email: false
  },
  priority: 'normal',
  active: true,
  lastModified: '24 Jul 2026'
}, {
  id: 'tpl-legal-hearing',
  eventKey: 'legal_hearing_scheduled',
  en: 'Legal Hearing Scheduled',
  bn: 'আইনি শুনানি নির্ধারিত',
  triggerModuleEn: 'Legal Procedures',
  triggerModuleBn: 'আইনি প্রক্রিয়া',
  bodyEn: 'A hearing for case {{caseNo}} has been scheduled on {{hearingDate}}.',
  bodyBn: '{{caseNo}} মামলার জন্য {{hearingDate}} তারিখে শুনানি নির্ধারিত হয়েছে।',
  channels: {
    inApp: true,
    sms: true,
    email: true
  },
  priority: 'high',
  active: true,
  lastModified: '12 Jul 2026'
}, {
  id: 'tpl-audit-notice',
  eventKey: 'annual_audit_notice',
  en: 'Annual Audit Notice',
  bn: 'বার্ষিক অডিট নোটিশ',
  triggerModuleEn: 'Annual Audit',
  triggerModuleBn: 'বার্ষিক অডিট',
  bodyEn: 'Your Annual Audit is scheduled to begin on {{auditDate}}. Please prepare required documents.',
  bodyBn: 'আপনার বার্ষিক অডিট {{auditDate}} তারিখে শুরু হওয়ার কথা। প্রয়োজনীয় নথি প্রস্তুত রাখুন।',
  channels: {
    inApp: true,
    sms: false,
    email: true
  },
  priority: 'normal',
  active: true,
  lastModified: '14 Jul 2026'
}, {
  id: 'tpl-guarantee-expiry',
  eventKey: 'guarantee_expiry_warning',
  en: 'Bank Guarantee Expiry Warning',
  bn: 'ব্যাংক গ্যারান্টি মেয়াদোত্তীর্ণের সতর্কতা',
  triggerModuleEn: 'Lien Bank Portal',
  triggerModuleBn: 'লিয়েন ব্যাংক পোর্টাল',
  bodyEn: 'Bank guarantee {{guaranteeNo}} expires in {{daysLeft}} days.',
  bodyBn: 'ব্যাংক গ্যারান্টি {{guaranteeNo}} আর {{daysLeft}} দিনে মেয়াদোত্তীর্ণ হবে।',
  channels: {
    inApp: true,
    sms: true,
    email: false
  },
  priority: 'high',
  active: false,
  lastModified: '11 Jul 2026'
}, {
  id: 'tpl-integration-down',
  eventKey: 'integration_connection_down',
  en: 'Integration Connection Down',
  bn: 'ইন্টিগ্রেশন সংযোগ বিচ্ছিন্ন',
  triggerModuleEn: 'Integration Monitoring',
  triggerModuleBn: 'ইন্টিগ্রেশন মনিটরিং',
  bodyEn: '{{integrationName}} is down. Last successful check: {{lastChecked}}.',
  bodyBn: '{{integrationName}} বিচ্ছিন্ন রয়েছে। সর্বশেষ সফল চেক: {{lastChecked}}।',
  channels: {
    inApp: true,
    sms: true,
    email: true
  },
  priority: 'high',
  active: true,
  lastModified: '27 Jul 2026'
}];

export const broadcastLogSeed: BroadcastLogEntry[] = [{
  id: 'bl1',
  timestamp: '27 Jul 2026, 09:20',
  templateEn: 'Approval Pending',
  templateBn: 'অনুমোদন মুলতুবি',
  recipients: 14,
  deliveredInstant: 9,
  queuedOffline: 5
}, {
  id: 'bl2',
  timestamp: '27 Jul 2026, 08:55',
  templateEn: 'Integration Connection Down',
  templateBn: 'ইন্টিগ্রেশন সংযোগ বিচ্ছিন্ন',
  recipients: 6,
  deliveredInstant: 4,
  queuedOffline: 2
}, {
  id: 'bl3',
  timestamp: '27 Jul 2026, 08:10',
  templateEn: 'Legal Hearing Scheduled',
  templateBn: 'আইনি শুনানি নির্ধারিত',
  recipients: 3,
  deliveredInstant: 3,
  queuedOffline: 0
}];
