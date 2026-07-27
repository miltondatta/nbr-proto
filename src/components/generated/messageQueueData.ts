export type QueueStatus = 'running' | 'paused' | 'error';
export type BalancingMode = 'Round Robin' | 'Least Connections';

export interface QueueTopic {
  id: string;
  en: string;
  bn: string;
  topicName: string;
  icon: string;
  producerModuleEn: string;
  producerModuleBn: string;
  consumerModulesEn: string[];
  consumerModulesBn: string[];
  status: QueueStatus;
  balancingMode: BalancingMode;
  depth: number;
  throughputPerMin: number;
  avgProcessingMs: number;
  dlqCount: number;
  lastMessageAt: string;
}

export interface QueueLogEntry {
  id: string;
  timestamp: string;
  en: string;
  bn: string;
  kind: 'info' | 'error';
}

export const statusMeta: Record<QueueStatus, {
  en: string;
  bn: string;
  color: string;
  icon: string;
}> = {
  running: {
    en: 'Running',
    bn: 'চলমান',
    color: '#00A86B',
    icon: 'play_circle'
  },
  paused: {
    en: 'Paused',
    bn: 'স্থগিত',
    color: '#B45309',
    icon: 'pause_circle'
  },
  error: {
    en: 'Error',
    bn: 'ত্রুটি',
    color: '#DC2626',
    icon: 'error'
  }
};

export const queueTopics: QueueTopic[] = [{
  id: 'q-bond-license',
  en: 'Bond License Events',
  bn: 'বন্ড লাইসেন্স ইভেন্ট',
  topicName: 'bond-license.events',
  icon: 'badge',
  producerModuleEn: 'Bond License Management',
  producerModuleBn: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
  consumerModulesEn: ['e-Bond Register', 'Notification Center', 'Business Intelligence'],
  consumerModulesBn: ['ই-বন্ড রেজিস্টার', 'নোটিফিকেশন সেন্টার', 'বিজনেস ইন্টেলিজেন্স'],
  status: 'running',
  balancingMode: 'Round Robin',
  depth: 4,
  throughputPerMin: 62,
  avgProcessingMs: 118,
  dlqCount: 0,
  lastMessageAt: '27 Jul 2026, 09:44'
}, {
  id: 'q-entitlement',
  en: 'Entitlement Approval Events',
  bn: 'এনটাইটেলমেন্ট অনুমোদন ইভেন্ট',
  topicName: 'entitlement.approval',
  icon: 'assignment_turned_in',
  producerModuleEn: 'Entitlement Management',
  producerModuleBn: 'এনটাইটেলমেন্ট ব্যবস্থাপনা',
  consumerModulesEn: ['Co-efficient Management', 'Notification Center'],
  consumerModulesBn: ['কো-এফিসিয়েন্ট ব্যবস্থাপনা', 'নোটিফিকেশন সেন্টার'],
  status: 'running',
  balancingMode: 'Least Connections',
  depth: 2,
  throughputPerMin: 24,
  avgProcessingMs: 96,
  dlqCount: 0,
  lastMessageAt: '27 Jul 2026, 09:41'
}, {
  id: 'q-coefficient',
  en: 'Co-efficient Validation Events',
  bn: 'কো-এফিসিয়েন্ট যাচাইকরণ ইভেন্ট',
  topicName: 'coefficient.validation',
  icon: 'functions',
  producerModuleEn: 'Co-efficient Management',
  producerModuleBn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা',
  consumerModulesEn: ['Utilization Permission', 'Inventory Monitoring', 'Business Intelligence'],
  consumerModulesBn: ['ইউটিলাইজেশন পারমিশন', 'ইনভেন্টরি মনিটরিং', 'বিজনেস ইন্টেলিজেন্স'],
  status: 'running',
  balancingMode: 'Round Robin',
  depth: 9,
  throughputPerMin: 41,
  avgProcessingMs: 205,
  dlqCount: 2,
  lastMessageAt: '27 Jul 2026, 09:43'
}, {
  id: 'q-notification',
  en: 'Push Notification Dispatch',
  bn: 'পুশ নোটিফিকেশন প্রেরণ',
  topicName: 'notification.push',
  icon: 'notifications_active',
  producerModuleEn: 'Notification Center',
  producerModuleBn: 'নোটিফিকেশন সেন্টার',
  consumerModulesEn: ['SMS / Email Notification Gateway'],
  consumerModulesBn: ['এসএমএস / ইমেইল নোটিফিকেশন গেটওয়ে'],
  status: 'running',
  balancingMode: 'Round Robin',
  depth: 0,
  throughputPerMin: 138,
  avgProcessingMs: 54,
  dlqCount: 0,
  lastMessageAt: '27 Jul 2026, 09:45'
}, {
  id: 'q-legal',
  en: 'Legal Procedure Escalation',
  bn: 'আইনি প্রক্রিয়া এস্কেলেশন',
  topicName: 'legal.escalation',
  icon: 'gavel',
  producerModuleEn: 'Legal Procedures',
  producerModuleBn: 'আইনি প্রক্রিয়া',
  consumerModulesEn: ['Case Information', 'Notification Center'],
  consumerModulesBn: ['কেস তথ্য', 'নোটিফিকেশন সেন্টার'],
  status: 'paused',
  balancingMode: 'Least Connections',
  depth: 6,
  throughputPerMin: 0,
  avgProcessingMs: 142,
  dlqCount: 0,
  lastMessageAt: '27 Jul 2026, 08:20'
}, {
  id: 'q-lien-bank',
  en: 'Lien Bank Guarantee Sync',
  bn: 'লিয়েন ব্যাংক গ্যারান্টি সিঙ্ক',
  topicName: 'lien-bank.guarantee',
  icon: 'account_balance',
  producerModuleEn: 'Lien Bank Portal & Change',
  producerModuleBn: 'লিয়েন ব্যাংক পোর্টাল ও পরিবর্তন',
  consumerModulesEn: ['Inter-Bond Transfer', 'Sub Contract Management'],
  consumerModulesBn: ['ইন্টার-বন্ড স্থানান্তর', 'সাব কন্ট্রাক্ট ব্যবস্থাপনা'],
  status: 'error',
  balancingMode: 'Round Robin',
  depth: 14,
  throughputPerMin: 3,
  avgProcessingMs: 890,
  dlqCount: 5,
  lastMessageAt: '27 Jul 2026, 09:10'
}, {
  id: 'q-user-role',
  en: 'User & Role Sync Events',
  bn: 'ব্যবহারকারী ও রোল সিঙ্ক ইভেন্ট',
  topicName: 'user-role.sync',
  icon: 'group',
  producerModuleEn: 'User Management',
  producerModuleBn: 'ব্যবহারকারী ব্যবস্থাপনা',
  consumerModulesEn: ['Role Management', 'Audit Logs'],
  consumerModulesBn: ['রোল ব্যবস্থাপনা', 'অডিট লগ'],
  status: 'running',
  balancingMode: 'Round Robin',
  depth: 1,
  throughputPerMin: 12,
  avgProcessingMs: 68,
  dlqCount: 0,
  lastMessageAt: '27 Jul 2026, 09:30'
}];

export const queueLogSeed: QueueLogEntry[] = [{
  id: 'ql1',
  timestamp: '27 Jul 2026, 09:10',
  en: 'Lien Bank Guarantee Sync — 5 messages moved to dead-letter queue after repeated processing failures.',
  bn: 'লিয়েন ব্যাংক গ্যারান্টি সিঙ্ক — বারবার প্রসেসিং ব্যর্থতার পর ৫টি বার্তা ডেড-লেটার কিউতে স্থানান্তরিত হয়েছে।',
  kind: 'error'
}, {
  id: 'ql2',
  timestamp: '27 Jul 2026, 08:20',
  en: 'Legal Procedure Escalation — topic paused by System Admin for maintenance.',
  bn: 'আইনি প্রক্রিয়া এস্কেলেশন — রক্ষণাবেক্ষণের জন্য টপিক সিস্টেম অ্যাডমিন দ্বারা স্থগিত করা হয়েছে।',
  kind: 'info'
}, {
  id: 'ql3',
  timestamp: '27 Jul 2026, 09:43',
  en: 'Co-efficient Validation Events — 2 messages currently in dead-letter queue, review recommended.',
  bn: 'কো-এফিসিয়েন্ট যাচাইকরণ ইভেন্ট — বর্তমানে ২টি বার্তা ডেড-লেটার কিউতে, পর্যালোচনার পরামর্শ দেওয়া হচ্ছে।',
  kind: 'error'
}];
