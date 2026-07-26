export type NotificationType = 'action-required' | 'informational' | 'alert';
export type NotificationModuleId = 'license-database' | 'annual-audit' | 'entitlement' | 'coefficient' | 'utilization-permission' | 'inventory-monitoring' | 'legal-procedures' | 'case-information' | 'inter-bond-transfer' | 'sub-contract' | 'reports' | 'system';
export type NotificationPriority = 'high' | 'normal';

export interface AppNotification {
  id: string;
  moduleId: NotificationModuleId;
  type: NotificationType;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  refId?: string;
  recipient: { en: string; bn: string };
  timestamp: string;
  read: boolean;
  priority: NotificationPriority;
}

export const officerPool = [{
  en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)'
}, {
  en: 'Sharmin Akter (ARO, Gazipur Zone)',
  bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)'
}, {
  en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)'
}];

export const moduleTagLabels: Record<NotificationModuleId, { en: string; bn: string; icon: string }> = {
  'license-database': { en: 'Bond License', bn: 'বন্ড লাইসেন্স', icon: 'assignment' },
  'annual-audit': { en: 'Annual Audit', bn: 'বার্ষিক নিরীক্ষা', icon: 'fact_check' },
  entitlement: { en: 'Entitlement', bn: 'এনটাইটেলমেন্ট', icon: 'pie_chart' },
  coefficient: { en: 'Co-efficient', bn: 'কো-এফিসিয়েন্ট', icon: 'functions' },
  'utilization-permission': { en: 'UP Management', bn: 'ইউপি ব্যবস্থাপনা', icon: 'verified_user' },
  'inventory-monitoring': { en: 'Inventory Monitoring', bn: 'ইনভেন্টরি মনিটরিং', icon: 'monitoring' },
  'legal-procedures': { en: 'Legal Procedures', bn: 'আইনি প্রক্রিয়া', icon: 'policy' },
  'case-information': { en: 'Case Information', bn: 'মামলার তথ্য', icon: 'folder_special' },
  'inter-bond-transfer': { en: 'Inter-Bond Transfer', bn: 'ইন্টার-বন্ড ট্রান্সফার', icon: 'compare_arrows' },
  'sub-contract': { en: 'Sub Contract', bn: 'সাব কন্ট্রাক্ট', icon: 'handshake' },
  reports: { en: 'Reports', bn: 'প্রতিবেদন', icon: 'bar_chart' },
  system: { en: 'System', bn: 'সিস্টেম', icon: 'settings_suggest' }
};

export const typeMeta: Record<NotificationType, { en: string; bn: string; icon: string; color: string }> = {
  'action-required': { en: 'Action Required', bn: 'পদক্ষেপ প্রয়োজন', icon: 'bolt', color: '#B45309' },
  informational: { en: 'Informational', bn: 'তথ্যমূলক', icon: 'info', color: '#1E88E5' },
  alert: { en: 'Alert', bn: 'সতর্কতা', icon: 'warning', color: '#DC2626' }
};

export const seedNotifications: AppNotification[] = [{
  id: 'NTF-2026-0421',
  moduleId: 'utilization-permission',
  type: 'action-required',
  titleEn: 'UP application awaiting your verification',
  titleBn: 'ইউপি আবেদন আপনার যাচাইয়ের অপেক্ষায়',
  bodyEn: 'UP-2026-0512 has been assigned to you for verification and e-UD cross-check.',
  bodyBn: 'UP-2026-0512 যাচাইকরণ ও ই-ইউডি ক্রস-চেকের জন্য আপনাকে বরাদ্দ করা হয়েছে।',
  refId: 'UP-2026-0512',
  recipient: officerPool[0],
  timestamp: '26 Jul 2026, 09:14',
  read: false,
  priority: 'high'
}, {
  id: 'NTF-2026-0420',
  moduleId: 'legal-procedures',
  type: 'action-required',
  titleEn: 'e-Note & Nothi forwarded for your recommendation',
  titleBn: 'সুপারিশের জন্য ই-নোট ও নথি ফরওয়ার্ড করা হয়েছে',
  bodyEn: 'LC-2026-101 hearing outcome requires your adjudication recommendation before forwarding to Commissioner.',
  bodyBn: 'LC-2026-101 শুনানির ফলাফলে কমিশনারের কাছে পাঠানোর আগে আপনার আদেশ সুপারিশ প্রয়োজন।',
  refId: 'LC-2026-101',
  recipient: officerPool[2],
  timestamp: '26 Jul 2026, 08:47',
  read: false,
  priority: 'high'
}, {
  id: 'NTF-2026-0419',
  moduleId: 'sub-contract',
  type: 'informational',
  titleEn: 'e-Approval Letter issued',
  titleBn: 'ই-অনুমোদন পত্র ইস্যু করা হয়েছে',
  bodyEn: 'Sub-Contract SC-2026-0120 approved — e-Risk Bond No. RB-2026-0120 and Approval Letter No. SCAL-2026-0120 generated.',
  bodyBn: 'সাব-কন্ট্রাক্ট SC-2026-0120 অনুমোদিত — ই-রিস্ক বন্ড নং RB-2026-0120 ও অনুমোদন পত্র নং SCAL-2026-0120 তৈরি হয়েছে।',
  refId: 'SC-2026-0120',
  recipient: officerPool[2],
  timestamp: '25 Jul 2026, 17:20',
  read: false,
  priority: 'normal'
}, {
  id: 'NTF-2026-0418',
  moduleId: 'coefficient',
  type: 'action-required',
  titleEn: 'DEDO consent required for outsourced validation',
  titleBn: 'আউটসোর্সড যাচাইয়ের জন্য ডিইডিও সম্মতি প্রয়োজন',
  bodyEn: 'A bonder-selected outsourced provider is awaiting DEDO consent before provider payment can proceed.',
  bodyBn: 'বন্ডকারী-নির্বাচিত আউটসোর্সড প্রোভাইডার প্রোভাইডার পেমেন্টের আগে ডিইডিও সম্মতির অপেক্ষায় রয়েছে।',
  recipient: officerPool[0],
  timestamp: '25 Jul 2026, 15:02',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0417',
  moduleId: 'inter-bond-transfer',
  type: 'action-required',
  titleEn: 'Risk Bond consent pending from receiving Bonder',
  titleBn: 'গ্রহীতা বন্ডকারীর কাছ থেকে রিস্ক বন্ড সম্মতি মুলতুবি',
  bodyEn: 'IBT-2026-0801 cannot proceed to RO/ARO verification until both bonders confirm e-Risk Bond consent.',
  bodyBn: 'উভয় বন্ডকারী ই-রিস্ক বন্ড সম্মতি নিশ্চিত না করা পর্যন্ত IBT-2026-0801 আরও/এআরও যাচাইয়ে যেতে পারবে না।',
  refId: 'IBT-2026-0801',
  recipient: officerPool[1],
  timestamp: '25 Jul 2026, 11:33',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0416',
  moduleId: 'annual-audit',
  type: 'alert',
  titleEn: 'Bonder added to Audit Disapproved List',
  titleBn: 'বন্ডকারীকে নিরীক্ষা অননুমোদিত তালিকায় যুক্ত করা হয়েছে',
  bodyEn: 'Audit disapproval finalized — bonder status set to non-compliant and notification letter dispatched.',
  bodyBn: 'নিরীক্ষা অননুমোদন চূড়ান্ত — বন্ডকারীর অবস্থা অসম্মত নির্ধারণ করা হয়েছে এবং নোটিশ পত্র পাঠানো হয়েছে।',
  recipient: officerPool[1],
  timestamp: '24 Jul 2026, 16:48',
  read: false,
  priority: 'high'
}, {
  id: 'NTF-2026-0415',
  moduleId: 'case-information',
  type: 'informational',
  titleEn: 'Verdict forwarded to Legal Procedure Management',
  titleBn: 'রায় আইনি প্রক্রিয়া ব্যবস্থাপনায় ফরওয়ার্ড করা হয়েছে',
  bodyEn: 'CBC-2026-501 High Court verdict has been linked to its Legal Procedure case for continued tracking.',
  bodyBn: 'CBC-2026-501-এর হাইকোর্ট রায় ধারাবাহিক ট্র্যাকিংয়ের জন্য এর আইনি প্রক্রিয়া মামলার সাথে সংযুক্ত করা হয়েছে।',
  refId: 'CBC-2026-501',
  recipient: officerPool[2],
  timestamp: '24 Jul 2026, 13:05',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0414',
  moduleId: 'utilization-permission',
  type: 'alert',
  titleEn: 'UP application reverted to Bonder',
  titleBn: 'ইউপি আবেদন বন্ডকারীর কাছে ফেরত পাঠানো হয়েছে',
  bodyEn: 'UP-2026-0480 reverted — e-Co-efficient comparison exceeded the configured variance threshold.',
  bodyBn: 'UP-2026-0480 ফেরত — ই-কো-এফিসিয়েন্ট তুলনা নির্ধারিত তারতম্য সীমা অতিক্রম করেছে।',
  refId: 'UP-2026-0480',
  recipient: officerPool[0],
  timestamp: '23 Jul 2026, 10:40',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0413',
  moduleId: 'entitlement',
  type: 'informational',
  titleEn: 'Inclusion/Addition request issued',
  titleBn: 'অন্তর্ভুক্তি/সংযোজন অনুরোধ ইস্যু করা হয়েছে',
  bodyEn: 'INC-2026-0031 approved by Commissioner and entitlement record ENT-2026-0203 issued.',
  bodyBn: 'INC-2026-0031 কমিশনার কর্তৃক অনুমোদিত এবং এনটাইটেলমেন্ট রেকর্ড ENT-2026-0203 ইস্যু করা হয়েছে।',
  refId: 'ENT-2026-0203',
  recipient: officerPool[1],
  timestamp: '22 Jul 2026, 14:12',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0412',
  moduleId: 'reports',
  type: 'informational',
  titleEn: 'Report generated successfully',
  titleBn: 'প্রতিবেদন সফলভাবে তৈরি হয়েছে',
  bodyEn: '"Bond License Issuance Summary" (GEN-2026-0091) is ready for download in PDF format.',
  bodyBn: '"বন্ড লাইসেন্স ইস্যু সারসংক্ষেপ" (GEN-2026-0091) পিডিএফ ফরম্যাটে ডাউনলোডের জন্য প্রস্তুত।',
  refId: 'GEN-2026-0091',
  recipient: officerPool[0],
  timestamp: '25 Jul 2026, 10:43',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0411',
  moduleId: 'inventory-monitoring',
  type: 'alert',
  titleEn: 'Ledger balance variance exceeds threshold',
  titleBn: 'লেজার ব্যালেন্স তারতম্য সীমা অতিক্রম করেছে',
  bodyEn: 'Ideal-usage vs. ledger-balance comparison flagged a discrepancy above the configured tolerance.',
  bodyBn: 'আদর্শ-ব্যবহার বনাম লেজার-ব্যালেন্স তুলনায় নির্ধারিত সহনশীলতার বেশি একটি অসঙ্গতি চিহ্নিত হয়েছে।',
  recipient: officerPool[2],
  timestamp: '21 Jul 2026, 09:55',
  read: true,
  priority: 'high'
}, {
  id: 'NTF-2026-0410',
  moduleId: 'license-database',
  type: 'informational',
  titleEn: 'License ownership change completed',
  titleBn: 'লাইসেন্স মালিকানা পরিবর্তন সম্পন্ন হয়েছে',
  bodyEn: 'Ownership change request finalized and the License Database record has been updated.',
  bodyBn: 'মালিকানা পরিবর্তনের অনুরোধ চূড়ান্ত হয়েছে এবং লাইসেন্স ডেটাবেজ রেকর্ড আপডেট করা হয়েছে।',
  recipient: officerPool[1],
  timestamp: '20 Jul 2026, 12:00',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0409',
  moduleId: 'sub-contract',
  type: 'action-required',
  titleEn: 'Additional supporting documents requested',
  titleBn: 'অতিরিক্ত সহায়ক নথি চাওয়া হয়েছে',
  bodyEn: 'SC-2026-0198 RO verification is on hold pending additional documents from the sub-contractor Bonder.',
  bodyBn: 'সাব-কন্ট্রাক্টর বন্ডকারীর কাছ থেকে অতিরিক্ত নথির অপেক্ষায় SC-2026-0198-এর আরও যাচাই স্থগিত রয়েছে।',
  refId: 'SC-2026-0198',
  recipient: officerPool[0],
  timestamp: '19 Jul 2026, 16:30',
  read: true,
  priority: 'normal'
}, {
  id: 'NTF-2026-0408',
  moduleId: 'system',
  type: 'informational',
  titleEn: 'Scheduled maintenance window',
  titleBn: 'নির্ধারিত রক্ষণাবেক্ষণ সময়',
  bodyEn: 'CBMS will undergo scheduled maintenance from 2:00 AM to 3:00 AM. Brief service interruption expected.',
  bodyBn: 'সিবিএমএস রাত ২টা থেকে ৩টা পর্যন্ত নির্ধারিত রক্ষণাবেক্ষণের মধ্যে থাকবে। সংক্ষিপ্ত সেবা বিঘ্নের সম্ভাবনা রয়েছে।',
  recipient: officerPool[1],
  timestamp: '18 Jul 2026, 20:00',
  read: true,
  priority: 'normal'
}];

export const incomingPool: Omit<AppNotification, 'id' | 'timestamp' | 'read'>[] = [{
  moduleId: 'utilization-permission',
  type: 'action-required',
  titleEn: 'New UP application submitted',
  titleBn: 'নতুন ইউপি আবেদন দাখিল হয়েছে',
  bodyEn: 'A new Utilization Permission application has entered the assignment queue.',
  bodyBn: 'একটি নতুন ইউটিলাইজেশন পারমিশন আবেদন বরাদ্দ সারিতে প্রবেশ করেছে।',
  recipient: officerPool[0],
  priority: 'high'
}, {
  moduleId: 'legal-procedures',
  type: 'alert',
  titleEn: 'Hearing scheduled within 3 days',
  titleBn: '৩ দিনের মধ্যে শুনানি নির্ধারিত',
  bodyEn: 'An upcoming hearing date is approaching — ensure case documents are prepared.',
  bodyBn: 'একটি আসন্ন শুনানির তারিখ ঘনিয়ে আসছে — মামলার নথি প্রস্তুত রাখুন।',
  recipient: officerPool[2],
  priority: 'high'
}, {
  moduleId: 'coefficient',
  type: 'informational',
  titleEn: 'Co-efficient validated via DB-match',
  titleBn: 'ডিবি-মিলের মাধ্যমে কো-এফিসিয়েন্ট যাচাইকৃত',
  bodyEn: 'A co-efficient validation request was resolved instantly against the existing database archive.',
  bodyBn: 'বিদ্যমান ডেটাবেজ আর্কাইভের বিপরীতে একটি কো-এফিসিয়েন্ট যাচাই অনুরোধ তাৎক্ষণিকভাবে সমাধান হয়েছে।',
  recipient: officerPool[1],
  priority: 'normal'
}, {
  moduleId: 'inter-bond-transfer',
  type: 'action-required',
  titleEn: 'Inspection report awaiting your score entry',
  titleBn: 'পরিদর্শন প্রতিবেদন আপনার স্কোর এন্ট্রির অপেক্ষায়',
  bodyEn: 'The inspection team has completed the site visit — weighted criteria scoring is now due.',
  bodyBn: 'পরিদর্শন দল সরেজমিন পরিদর্শন সম্পন্ন করেছে — ওজনযুক্ত মানদণ্ড স্কোরিং এখন প্রয়োজন।',
  recipient: officerPool[2],
  priority: 'high'
}, {
  moduleId: 'reports',
  type: 'informational',
  titleEn: 'Custom report ready',
  titleBn: 'কাস্টম প্রতিবেদন প্রস্তুত',
  bodyEn: 'Your on-demand custom report has finished generating and is available in the history tab.',
  bodyBn: 'আপনার চাহিদা অনুযায়ী কাস্টম প্রতিবেদন তৈরি সম্পন্ন হয়েছে এবং ইতিহাস ট্যাবে উপলব্ধ।',
  recipient: officerPool[0],
  priority: 'normal'
}];
