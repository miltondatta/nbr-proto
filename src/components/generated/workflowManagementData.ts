export interface WorkflowStage {
  id: string;
  en: string;
  bn: string;
  role: string;
  slaDays: number;
  isException?: boolean;
}

export interface WorkflowHistoryEntry {
  id: string;
  timestamp: string;
  actor: string;
  en: string;
  bn: string;
}

export type WorkflowCategory = 'license' | 'bond' | 'financial' | 'legal' | 'inventory';

export interface WorkflowDefinition {
  id: string;
  en: string;
  bn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  category: WorkflowCategory;
  thresholdLabelEn?: string;
  thresholdLabelBn?: string;
  thresholdValue?: number;
  stages: WorkflowStage[];
  version: number;
  lastModified: string;
  history: WorkflowHistoryEntry[];
}

export const roleOptions = ['System', 'Bonder', 'RO / ARO', 'AC / DC', 'ADC / JC', 'Commissioner', 'Lien Bank Official', 'BEPZA'];

export const categoryMeta: Record<WorkflowCategory, {
  en: string;
  bn: string;
  color: string;
}> = {
  license: {
    en: 'Bond License',
    bn: 'বন্ড লাইসেন্স',
    color: '#0A4D8C'
  },
  bond: {
    en: 'Bond Operations',
    bn: 'বন্ড কার্যক্রম',
    color: '#1E88E5'
  },
  financial: {
    en: 'Financial / Utilization',
    bn: 'আর্থিক / ব্যবহার',
    color: '#00A86B'
  },
  legal: {
    en: 'Legal & Case',
    bn: 'আইনি ও মামলা',
    color: '#DC2626'
  },
  inventory: {
    en: 'Transfer & Inventory',
    bn: 'স্থানান্তর ও ইনভেন্টরি',
    color: '#B45309'
  }
};

export const workflowDefinitions: WorkflowDefinition[] = [{
  id: 'wf-new-bond-license',
  en: 'New Bond License Approval',
  bn: 'নতুন বন্ড লাইসেন্স অনুমোদন',
  descriptionEn: 'Routing for new e-Bond License applications from submission to license issuance.',
  descriptionBn: 'জমা দেওয়া থেকে লাইসেন্স ইস্যু পর্যন্ত নতুন ই-বন্ড লাইসেন্স আবেদনের রাউটিং।',
  icon: 'badge',
  category: 'license',
  thresholdLabelEn: 'Investment value requiring Commissioner sign-off (BDT)',
  thresholdLabelBn: 'কমিশনার অনুমোদন প্রয়োজনীয় বিনিয়োগ মূল্য (৳)',
  thresholdValue: 50000000,
  version: 3,
  lastModified: '26 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Application Submitted',
    bn: 'আবেদন জমা',
    role: 'Bonder',
    slaDays: 1
  }, {
    id: 's2',
    en: 'RO/ARO Field Verification',
    bn: 'আরও/এআরও মাঠ যাচাই',
    role: 'RO / ARO',
    slaDays: 7
  }, {
    id: 's3',
    en: 'AC/DC Document Review',
    bn: 'এসি/ডিসি নথি পর্যালোচনা',
    role: 'AC / DC',
    slaDays: 5
  }, {
    id: 's4',
    en: 'JC/ADC Escalation (above threshold)',
    bn: 'জেসি/এডিসি এস্কেলেশন (থ্রেশহোল্ডের উপরে)',
    role: 'ADC / JC',
    slaDays: 4,
    isException: true
  }, {
    id: 's5',
    en: 'Commissioner Final Approval',
    bn: 'কমিশনার চূড়ান্ত অনুমোদন',
    role: 'Commissioner',
    slaDays: 3
  }, {
    id: 's6',
    en: 'License Issued & Bond Registered',
    bn: 'লাইসেন্স ইস্যু ও বন্ড নিবন্ধিত',
    role: 'System',
    slaDays: 1
  }],
  history: [{
    id: 'h1',
    timestamp: '23 Jul 2026',
    actor: 'System Admin',
    en: 'Workflow created from Bond License Application module defaults.',
    bn: 'বন্ড লাইসেন্স আবেদন মডিউলের ডিফল্ট থেকে ওয়ার্কফ্লো তৈরি হয়েছে।'
  }, {
    id: 'h2',
    timestamp: '26 Jul 2026',
    actor: 'System Admin',
    en: 'RO/ARO Field Verification SLA extended from 5 to 7 days.',
    bn: 'আরও/এআরও মাঠ যাচাই এসএলএ ৫ থেকে ৭ দিনে বাড়ানো হয়েছে।'
  }]
}, {
  id: 'wf-license-ownership-change',
  en: 'License Ownership Change',
  bn: 'লাইসেন্স মালিকানা পরিবর্তন',
  descriptionEn: 'Routing for transferring a bond license to a new legal owner.',
  descriptionBn: 'বন্ড লাইসেন্স নতুন আইনগত মালিকের কাছে হস্তান্তরের রাউটিং।',
  icon: 'swap_horiz',
  category: 'license',
  version: 1,
  lastModified: '15 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Ownership Change Request',
    bn: 'মালিকানা পরিবর্তনের অনুরোধ',
    role: 'Bonder',
    slaDays: 1
  }, {
    id: 's2',
    en: 'RO/ARO Verification',
    bn: 'আরও/এআরও যাচাই',
    role: 'RO / ARO',
    slaDays: 5
  }, {
    id: 's3',
    en: 'AC/DC Approval',
    bn: 'এসি/ডিসি অনুমোদন',
    role: 'AC / DC',
    slaDays: 3
  }, {
    id: 's4',
    en: 'License Database Updated',
    bn: 'লাইসেন্স ডাটাবেস হালনাগাদ',
    role: 'System',
    slaDays: 1
  }],
  history: [{
    id: 'h1',
    timestamp: '15 Jul 2026',
    actor: 'System Admin',
    en: 'Workflow configured to match License Ownership Change module.',
    bn: 'লাইসেন্স মালিকানা পরিবর্তন মডিউলের সাথে মিলিয়ে ওয়ার্কফ্লো কনফিগার করা হয়েছে।'
  }]
}, {
  id: 'wf-entitlement',
  en: 'Entitlement Approval',
  bn: 'এনটাইটেলমেন্ট অনুমোদন',
  descriptionEn: 'Auto-issuance and manual approval routing for Entitlement inclusion/addition requests.',
  descriptionBn: 'এনটাইটেলমেন্ট অন্তর্ভুক্তি/সংযোজন অনুরোধের জন্য স্বয়ংক্রিয়-ইস্যু ও ম্যানুয়াল অনুমোদন রাউটিং।',
  icon: 'assignment_turned_in',
  category: 'financial',
  thresholdLabelEn: 'Value above which Commissioner review is triggered (BDT)',
  thresholdLabelBn: 'যে মূল্যের উপরে কমিশনার পর্যালোচনা প্রয়োজন (৳)',
  thresholdValue: 20000000,
  version: 2,
  lastModified: '20 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Inclusion/Addition Request',
    bn: 'অন্তর্ভুক্তি/সংযোজন অনুরোধ',
    role: 'Bonder',
    slaDays: 1
  }, {
    id: 's2',
    en: 'RO/ARO Assignment',
    bn: 'আরও/এআরও নিয়োগ',
    role: 'RO / ARO',
    slaDays: 4
  }, {
    id: 's3',
    en: 'Auto-Issuance Formula Check',
    bn: 'স্বয়ংক্রিয়-ইস্যু সূত্র যাচাই',
    role: 'System',
    slaDays: 1
  }, {
    id: 's4',
    en: 'Commissioner Approval',
    bn: 'কমিশনার অনুমোদন',
    role: 'Commissioner',
    slaDays: 3
  }],
  history: [{
    id: 'h1',
    timestamp: '20 Jul 2026',
    actor: 'System Admin',
    en: 'Auto-issuance threshold lowered from BDT 30,000,000 to BDT 20,000,000.',
    bn: 'স্বয়ংক্রিয়-ইস্যু থ্রেশহোল্ড ৩,০০,০০,০০০ থেকে ২,০০,০০,০০০ টাকায় কমানো হয়েছে।'
  }]
}, {
  id: 'wf-coefficient',
  en: 'Co-efficient Validation',
  bn: 'কো-এফিসিয়েন্ট যাচাইকরণ',
  descriptionEn: 'Branching validation pipeline used to accept or reject an Input-Output Co-efficient submission.',
  descriptionBn: 'ইনপুট-আউটপুট কো-এফিসিয়েন্ট জমা গ্রহণ বা প্রত্যাখ্যান করতে ব্যবহৃত শাখাযুক্ত যাচাইকরণ পাইপলাইন।',
  icon: 'functions',
  category: 'financial',
  version: 4,
  lastModified: '24 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Co-efficient Submission',
    bn: 'কো-এফিসিয়েন্ট জমা',
    role: 'Bonder',
    slaDays: 1
  }, {
    id: 's2',
    en: 'DEDO Database Match Check',
    bn: 'ডিইডিও ডাটাবেস মিল যাচাই',
    role: 'System',
    slaDays: 1
  }, {
    id: 's3',
    en: 'Outsourced Provider Verification',
    bn: 'আউটসোর্সড প্রোভাইডার যাচাই',
    role: 'System',
    slaDays: 3,
    isException: true
  }, {
    id: 's4',
    en: 'e-Calculation & Comparison Report',
    bn: 'ই-ক্যালকুলেশন ও তুলনা প্রতিবেদন',
    role: 'RO / ARO',
    slaDays: 2
  }, {
    id: 's5',
    en: 'Co-efficient DB Archive Approval',
    bn: 'কো-এফিসিয়েন্ট ডিবি আর্কাইভ অনুমোদন',
    role: 'AC / DC',
    slaDays: 2
  }],
  history: [{
    id: 'h1',
    timestamp: '24 Jul 2026',
    actor: 'System Admin',
    en: 'Added Outsourced Provider Verification as an exception branch.',
    bn: 'আউটসোর্সড প্রোভাইডার যাচাইকে ব্যতিক্রম শাখা হিসাবে যুক্ত করা হয়েছে।'
  }]
}, {
  id: 'wf-utilization-permission',
  en: 'Utilization Permission (UP)',
  bn: 'ইউটিলাইজেশন পারমিশন (ইউপি)',
  descriptionEn: 'RO/ARO assignment through value-based officer routing for Utilization Permission requests.',
  descriptionBn: 'ইউটিলাইজেশন পারমিশন অনুরোধের জন্য আরও/এআরও নিয়োগ থেকে মূল্য-ভিত্তিক কর্মকর্তা রাউটিং।',
  icon: 'fact_check',
  category: 'financial',
  thresholdLabelEn: 'Value above which ADC/JC routing applies instead of AC/DC (BDT)',
  thresholdLabelBn: 'যে মূল্যের উপরে এসি/ডিসি এর পরিবর্তে এডিসি/জেসি রাউটিং প্রযোজ্য (৳)',
  thresholdValue: 35000000,
  version: 2,
  lastModified: '18 Jul 2026',
  stages: [{
    id: 's1',
    en: 'UP Request Submitted',
    bn: 'ইউপি অনুরোধ জমা',
    role: 'Bonder',
    slaDays: 1
  }, {
    id: 's2',
    en: 'Auto ARO/RO Assignment',
    bn: 'স্বয়ংক্রিয় এআরও/আরও নিয়োগ',
    role: 'System',
    slaDays: 1
  }, {
    id: 's3',
    en: 'e-UD Cross-check',
    bn: 'ই-ইউডি ক্রস-চেক',
    role: 'RO / ARO',
    slaDays: 3
  }, {
    id: 's4',
    en: 'e-Co-efficient Comparison Report',
    bn: 'ই-কো-এফিসিয়েন্ট তুলনা প্রতিবেদন',
    role: 'System',
    slaDays: 1
  }, {
    id: 's5',
    en: 'ADC/JC or AC/DC Approval (value routed)',
    bn: 'এডিসি/জেসি বা এসি/ডিসি অনুমোদন (মূল্য অনুসারে)',
    role: 'AC / DC',
    slaDays: 3
  }],
  history: [{
    id: 'h1',
    timestamp: '18 Jul 2026',
    actor: 'System Admin',
    en: 'Value-based routing threshold introduced at BDT 35,000,000.',
    bn: '৩,৫০,০০,০০০ টাকায় মূল্য-ভিত্তিক রাউটিং থ্রেশহোল্ড চালু করা হয়েছে।'
  }]
}, {
  id: 'wf-inter-bond-transfer',
  en: 'Inter-Bond Transfer',
  bn: 'ইন্টার-বন্ড স্থানান্তর',
  descriptionEn: 'Dual-bonder consent, weighted inspection scoring, and post-approval PRC follow-up.',
  descriptionBn: 'দ্বৈত-বন্ডার সম্মতি, ওজনযুক্ত পরিদর্শন স্কোরিং এবং অনুমোদন-পরবর্তী পিআরসি ফলো-আপ।',
  icon: 'sync_alt',
  category: 'inventory',
  version: 1,
  lastModified: '10 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Dual-Bonder Consent',
    bn: 'দ্বৈত-বন্ডার সম্মতি',
    role: 'Bonder',
    slaDays: 3
  }, {
    id: 's2',
    en: 'Inspection & Weighted Scoring',
    bn: 'পরিদর্শন ও ওজনযুক্ত স্কোরিং',
    role: 'RO / ARO',
    slaDays: 5
  }, {
    id: 's3',
    en: 'AC/DC Approval',
    bn: 'এসি/ডিসি অনুমোদন',
    role: 'AC / DC',
    slaDays: 3
  }, {
    id: 's4',
    en: 'Post-Approval PRC Follow-up',
    bn: 'অনুমোদন-পরবর্তী পিআরসি ফলো-আপ',
    role: 'System',
    slaDays: 30,
    isException: true
  }],
  history: [{
    id: 'h1',
    timestamp: '10 Jul 2026',
    actor: 'System Admin',
    en: 'Workflow configured to match Inter-Bond Transfer module.',
    bn: 'ইন্টার-বন্ড স্থানান্তর মডিউলের সাথে মিলিয়ে ওয়ার্কফ্লো কনফিগার করা হয়েছে।'
  }]
}, {
  id: 'wf-sub-contract',
  en: 'Sub-Contract Approval',
  bn: 'সাব-কন্ট্রাক্ট অনুমোদন',
  descriptionEn: 'BEPZA-approval routing generating a Risk Bond and auto Bond Register update.',
  descriptionBn: 'বিইপিজেডএ-অনুমোদন রাউটিং যা ঝুঁকি বন্ড তৈরি করে ও স্বয়ংক্রিয় বন্ড রেজিস্টার হালনাগাদ করে।',
  icon: 'handshake',
  category: 'inventory',
  version: 1,
  lastModified: '10 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Sub-Contract Application',
    bn: 'সাব-কন্ট্রাক্ট আবেদন',
    role: 'Bonder',
    slaDays: 1
  }, {
    id: 's2',
    en: 'BEPZA Approval',
    bn: 'বিইপিজেডএ অনুমোদন',
    role: 'BEPZA',
    slaDays: 10
  }, {
    id: 's3',
    en: 'Risk Bond No. & Approval Letter Generation',
    bn: 'ঝুঁকি বন্ড নং ও অনুমোদন পত্র তৈরি',
    role: 'System',
    slaDays: 1
  }, {
    id: 's4',
    en: 'Auto e-Bond Register Update',
    bn: 'স্বয়ংক্রিয় ই-বন্ড রেজিস্টার হালনাগাদ',
    role: 'System',
    slaDays: 1
  }],
  history: [{
    id: 'h1',
    timestamp: '10 Jul 2026',
    actor: 'System Admin',
    en: 'Workflow configured to match Sub Contract Management module.',
    bn: 'সাব কন্ট্রাক্ট ব্যবস্থাপনা মডিউলের সাথে মিলিয়ে ওয়ার্কফ্লো কনফিগার করা হয়েছে।'
  }]
}, {
  id: 'wf-legal-procedure',
  en: 'Legal Procedure Escalation',
  bn: 'আইনি প্রক্রিয়া এস্কেলেশন',
  descriptionEn: 'Representative main path of the SCN-to-closure escalation ladder, with the appellate branch as an exception.',
  descriptionBn: 'এসসিএন থেকে সমাপ্তি পর্যন্ত এস্কেলেশন সিঁড়ির প্রধান পথ, আপিল শাখাকে ব্যতিক্রম হিসাবে দেখানো হয়েছে।',
  icon: 'gavel',
  category: 'legal',
  version: 2,
  lastModified: '12 Jul 2026',
  stages: [{
    id: 's1',
    en: 'Show Cause Notice (SCN) Issuance',
    bn: 'কারণ দর্শানো নোটিশ (এসসিএন) ইস্যু',
    role: 'AC / DC',
    slaDays: 15
  }, {
    id: 's2',
    en: 'Hearing',
    bn: 'শুনানি',
    role: 'AC / DC',
    slaDays: 30
  }, {
    id: 's3',
    en: 'Adjudication',
    bn: 'বিচারাদেশ',
    role: 'ADC / JC',
    slaDays: 30
  }, {
    id: 's4',
    en: 'Appellate Ladder (if contested)',
    bn: 'আপিল সিঁড়ি (বিতর্কিত হলে)',
    role: 'Commissioner',
    slaDays: 90,
    isException: true
  }, {
    id: 's5',
    en: 'Case Closure',
    bn: 'মামলা সমাপ্তি',
    role: 'System',
    slaDays: 1
  }],
  history: [{
    id: 'h1',
    timestamp: '12 Jul 2026',
    actor: 'System Admin',
    en: 'Hearing SLA extended from 21 to 30 days to match Legal Procedures module.',
    bn: 'শুনানির এসএলএ ২১ থেকে ৩০ দিনে বাড়ানো হয়েছে (আইনি প্রক্রিয়া মডিউলের সাথে মিল রেখে)।'
  }]
}];
