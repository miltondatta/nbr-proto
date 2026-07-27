export type ConnectionStatus = 'connected' | 'degraded' | 'down';
export type AuthType = 'API Key' | 'OAuth 2.0' | 'Basic Auth' | 'Access Token';

export interface IntegrationConnection {
  id: string;
  en: string;
  bn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  relatedModuleEn: string;
  relatedModuleBn: string;
  status: ConnectionStatus;
  url: string;
  username: string;
  authType: AuthType;
  sampleRequest: string;
  sampleResponse: string;
  lastChecked: string;
  latencyMs: number;
  uptimePercent: number;
  lastIncidentEn?: string;
  lastIncidentBn?: string;
}

export interface ConnectionLogEntry {
  id: string;
  timestamp: string;
  en: string;
  bn: string;
  result: 'ok' | 'fault';
}

export const statusMeta: Record<ConnectionStatus, {
  en: string;
  bn: string;
  color: string;
  icon: string;
}> = {
  connected: {
    en: 'Connected',
    bn: 'সংযুক্ত',
    color: '#00A86B',
    icon: 'check_circle'
  },
  degraded: {
    en: 'Degraded',
    bn: 'হ্রাসপ্রাপ্ত',
    color: '#B45309',
    icon: 'warning'
  },
  down: {
    en: 'Down',
    bn: 'বিচ্ছিন্ন',
    color: '#DC2626',
    icon: 'cancel'
  }
};

export const integrationConnections: IntegrationConnection[] = [{
  id: 'int-dedo',
  en: 'DEDO Co-efficient Database',
  bn: 'ডিইডিও কো-এফিসিয়েন্ট ডাটাবেস',
  descriptionEn: 'National Duty Exemption & Drawback Office database used to match submitted Input-Output Co-efficients.',
  descriptionBn: 'জমাকৃত ইনপুট-আউটপুট কো-এফিসিয়েন্ট মেলাতে ব্যবহৃত জাতীয় ডিউটি এক্সেম্পশন ও ড্রব্যাক অফিস ডাটাবেস।',
  icon: 'functions',
  relatedModuleEn: 'Co-efficient Management',
  relatedModuleBn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা',
  status: 'connected',
  url: 'https://dedo-api.nbr.gov.bd/v2/coefficient-match',
  username: 'cbms-service-account',
  authType: 'API Key',
  sampleRequest: '{\n  "hsCode": "8471.30.00",\n  "productName": "Assembled PCB",\n  "requestedBy": "CBC-DHK-02"\n}',
  sampleResponse: '{\n  "matchFound": true,\n  "coefficientId": "DEDO-4471",\n  "ioRatio": 1.08\n}',
  lastChecked: '27 Jul 2026, 09:40',
  latencyMs: 210,
  uptimePercent: 99.6
}, {
  id: 'int-corebanking',
  en: 'Lien Bank Core Banking System',
  bn: 'লিয়েন ব্যাংক কোর ব্যাংকিং সিস্টেম',
  descriptionEn: 'Real-time bank guarantee balance and lien confirmation feed from scheduled lien banks.',
  descriptionBn: 'নির্ধারিত লিয়েন ব্যাংক থেকে রিয়েল-টাইম ব্যাংক গ্যারান্টি ব্যালেন্স ও লিয়েন নিশ্চিতকরণ ফিড।',
  icon: 'account_balance',
  relatedModuleEn: 'Lien Bank Portal & Change Management',
  relatedModuleBn: 'লিয়েন ব্যাংক পোর্টাল ও পরিবর্তন ব্যবস্থাপনা',
  status: 'degraded',
  url: 'https://corebanking.lienbank.bd/api/guarantee-status',
  username: 'nbr-cbms-integration',
  authType: 'OAuth 2.0',
  sampleRequest: '{\n  "guaranteeNo": "LG-2026-88213",\n  "bonderLicenseNo": "BL-2024-1187"\n}',
  sampleResponse: '{\n  "status": "active",\n  "balance": 4500000,\n  "expiresOn": "2027-03-01"\n}',
  lastChecked: '27 Jul 2026, 09:12',
  latencyMs: 1840,
  uptimePercent: 96.2,
  lastIncidentEn: 'Response latency exceeded 1500ms threshold for 3 consecutive checks.',
  lastIncidentBn: 'পরপর ৩টি চেকে রেসপন্স লেটেন্সি ১৫০০ মিলিসেকেন্ড থ্রেশহোল্ড অতিক্রম করেছে।'
}, {
  id: 'int-bepza',
  en: 'BEPZA Approval Gateway',
  bn: 'বিইপিজেডএ অনুমোদন গেটওয়ে',
  descriptionEn: 'Bangladesh Export Processing Zones Authority endpoint used to confirm Sub-Contract approvals.',
  descriptionBn: 'সাব-কন্ট্রাক্ট অনুমোদন নিশ্চিত করতে ব্যবহৃত বাংলাদেশ রপ্তানি প্রক্রিয়াকরণ অঞ্চল কর্তৃপক্ষ এন্ডপয়েন্ট।',
  icon: 'handshake',
  relatedModuleEn: 'Sub Contract Management',
  relatedModuleBn: 'সাব কন্ট্রাক্ট ব্যবস্থাপনা',
  status: 'connected',
  url: 'https://gateway.bepza.gov.bd/approvals/v1',
  username: 'cbms-bepza-link',
  authType: 'Access Token',
  sampleRequest: '{\n  "applicationId": "SC-2026-0512",\n  "riskBondNo": "RB-77291"\n}',
  sampleResponse: '{\n  "approved": true,\n  "completionDurationDays": 90\n}',
  lastChecked: '27 Jul 2026, 09:38',
  latencyMs: 340,
  uptimePercent: 99.1
}, {
  id: 'int-asycuda',
  en: 'ASYCUDA World (Customs)',
  bn: 'অ্যাসাইকুডা ওয়ার্ল্ড (কাস্টমস)',
  descriptionEn: 'Bangladesh Customs automated system feed for ex-bond entries, goods declaration and duty assessment.',
  descriptionBn: 'এক্স-বন্ড এন্ট্রি, পণ্য ঘোষণা ও শুল্ক মূল্যায়নের জন্য বাংলাদেশ কাস্টমসের স্বয়ংক্রিয় সিস্টেম ফিড।',
  icon: 'local_shipping',
  relatedModuleEn: 'e-Bond Register / Ex-Bond Entry',
  relatedModuleBn: 'ই-বন্ড রেজিস্টার / এক্স-বন্ড এন্ট্রি',
  status: 'connected',
  url: 'https://asycuda.customs.gov.bd/api/exbond',
  username: 'cbc-cbms-node',
  authType: 'API Key',
  sampleRequest: '{\n  "bcdNo": "BCD-2026-33021",\n  "hsCode": "8542.31.00",\n  "quantity": 1200\n}',
  sampleResponse: '{\n  "accepted": true,\n  "dutyAssessed": 615000\n}',
  lastChecked: '27 Jul 2026, 09:41',
  latencyMs: 165,
  uptimePercent: 99.8
}, {
  id: 'int-vat-online',
  en: 'VAT Online System',
  bn: 'ভ্যাট অনলাইন সিস্টেম',
  descriptionEn: 'National Board of Revenue VAT Online Project used for VAT/AIT reconciliation during audits.',
  descriptionBn: 'অডিট চলাকালীন ভ্যাট/এআইটি মিলকরণে ব্যবহৃত জাতীয় রাজস্ব বোর্ডের ভ্যাট অনলাইন প্রকল্প।',
  icon: 'receipt_long',
  relatedModuleEn: 'Annual Audit',
  relatedModuleBn: 'বার্ষিক অডিট',
  status: 'down',
  url: 'https://vat.gov.bd/api/reconciliation',
  username: 'cbms-audit-svc',
  authType: 'OAuth 2.0',
  sampleRequest: '{\n  "binNo": "000456789-0102",\n  "period": "2026-Q2"\n}',
  sampleResponse: '{\n  "vatPaid": 3120000,\n  "aitPaid": 890000\n}',
  lastChecked: '27 Jul 2026, 08:55',
  latencyMs: 0,
  uptimePercent: 91.4,
  lastIncidentEn: 'Connection refused — VAT Online scheduled maintenance window since 08:30.',
  lastIncidentBn: 'সংযোগ প্রত্যাখ্যাত — ভ্যাট অনলাইনের নির্ধারিত রক্ষণাবেক্ষণ ০৮:৩০ থেকে চলছে।'
}, {
  id: 'int-nid',
  en: 'NID Verification Service',
  bn: 'এনআইডি যাচাইকরণ সেবা',
  descriptionEn: 'Election Commission National ID verification used during Bonder profile and officer onboarding checks.',
  descriptionBn: 'বন্ডার প্রোফাইল ও কর্মকর্তা অন্তর্ভুক্তি যাচাইয়ে ব্যবহৃত নির্বাচন কমিশনের জাতীয় পরিচয়পত্র যাচাইকরণ সেবা।',
  icon: 'badge',
  relatedModuleEn: 'e-Licensee Profile Creation / User Management',
  relatedModuleBn: 'ই-লাইসেন্সি প্রোফাইল তৈরি / ব্যবহারকারী ব্যবস্থাপনা',
  status: 'connected',
  url: 'https://nidw.gov.bd/api/verify',
  username: 'nbr-cbms-nid',
  authType: 'Access Token',
  sampleRequest: '{\n  "nidNumber": "1993xxxxxxxxxx",\n  "dateOfBirth": "1993-04-12"\n}',
  sampleResponse: '{\n  "match": true,\n  "nameMatchScore": 100\n}',
  lastChecked: '27 Jul 2026, 09:35',
  latencyMs: 480,
  uptimePercent: 98.9
}, {
  id: 'int-ibas',
  en: 'iBAS++ Treasury Interface',
  bn: 'আইব্যাস++ ট্রেজারি ইন্টারফেস',
  descriptionEn: 'Integrated Budget and Accounting System interface for treasury challan verification.',
  descriptionBn: 'ট্রেজারি চালান যাচাইয়ের জন্য সমন্বিত বাজেট ও হিসাব ব্যবস্থার ইন্টারফেস।',
  icon: 'account_balance_wallet',
  relatedModuleEn: 'General Bond Management',
  relatedModuleBn: 'সাধারণ বন্ড ব্যবস্থাপনা',
  status: 'connected',
  url: 'https://ibas.finance.gov.bd/api/challan-verify',
  username: 'cbms-treasury-svc',
  authType: 'Basic Auth',
  sampleRequest: '{\n  "challanNo": "TR-2026-991823",\n  "amount": 250000\n}',
  sampleResponse: '{\n  "verified": true,\n  "depositDate": "2026-07-20"\n}',
  lastChecked: '27 Jul 2026, 09:20',
  latencyMs: 390,
  uptimePercent: 99.3
}, {
  id: 'int-notify',
  en: 'SMS / Email Notification Gateway',
  bn: 'এসএমএস / ইমেইল নোটিফিকেশন গেটওয়ে',
  descriptionEn: 'Third-party gateway dispatching e-notifications and push alerts from the Notification Center.',
  descriptionBn: 'নোটিফিকেশন সেন্টার থেকে ই-নোটিফিকেশন ও পুশ অ্যালার্ট পাঠানোর তৃতীয় পক্ষের গেটওয়ে।',
  icon: 'sms',
  relatedModuleEn: 'Notification Center',
  relatedModuleBn: 'নোটিফিকেশন সেন্টার',
  status: 'connected',
  url: 'https://notify-gateway.bd/api/dispatch',
  username: 'cbms-notify-svc',
  authType: 'API Key',
  sampleRequest: '{\n  "channel": "sms",\n  "to": "+8801xxxxxxxxx",\n  "templateId": "APPROVAL_PENDING"\n}',
  sampleResponse: '{\n  "queued": true,\n  "messageId": "MSG-88213"\n}',
  lastChecked: '27 Jul 2026, 09:42',
  latencyMs: 95,
  uptimePercent: 99.9
}];

export const connectionLogSeed: ConnectionLogEntry[] = [{
  id: 'l1',
  timestamp: '27 Jul 2026, 08:55',
  en: 'VAT Online System — connection refused during scheduled maintenance.',
  bn: 'ভ্যাট অনলাইন সিস্টেম — নির্ধারিত রক্ষণাবেক্ষণের সময় সংযোগ প্রত্যাখ্যাত হয়েছে।',
  result: 'fault'
}, {
  id: 'l2',
  timestamp: '27 Jul 2026, 09:12',
  en: 'Lien Bank Core Banking System — response latency exceeded 1500ms.',
  bn: 'লিয়েন ব্যাংক কোর ব্যাংকিং সিস্টেম — রেসপন্স লেটেন্সি ১৫০০ মিলিসেকেন্ড অতিক্রম করেছে।',
  result: 'fault'
}, {
  id: 'l3',
  timestamp: '27 Jul 2026, 09:35',
  en: 'NID Verification Service — health check passed.',
  bn: 'এনআইডি যাচাইকরণ সেবা — হেলথ চেক সফল হয়েছে।',
  result: 'ok'
}];
