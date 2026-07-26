export type RoleTierId = 'system-admin' | 'monitoring-authority' | 'system-user' | 'system-viewer' | 'general-user';
export type AccessLevel = 'full' | 'read-only' | 'none';

export interface ModuleDef {
  id: string;
  labelEn: string;
  labelBn: string;
}

export interface Designation {
  en: string;
  bn: string;
}

export interface RoleTier {
  id: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  designations: Designation[];
  designationNoteEn?: string;
  designationNoteBn?: string;
  userCount: number;
  color: string;
  icon: string;
  access: Record<string, AccessLevel>;
  custom?: boolean;
}

export const accessLevelMeta: Record<AccessLevel, { en: string; bn: string; icon: string; color: string }> = {
  full: { en: 'Full Access', bn: 'সম্পূর্ণ অ্যাক্সেস', icon: 'check_circle', color: '#00A86B' },
  'read-only': { en: 'Read Only', bn: 'শুধু পঠনযোগ্য', icon: 'visibility', color: '#B45309' },
  none: { en: 'No Access', bn: 'অ্যাক্সেস নেই', icon: 'remove_circle_outline', color: '#94A3B8' }
};

export const moduleCatalog: ModuleDef[] = [{
  id: 'cbc-portal',
  labelEn: 'CBC Portal Management',
  labelBn: 'সিবিসি পোর্টাল ব্যবস্থাপনা'
}, {
  id: 'new-bond-license',
  labelEn: 'Bond License Application',
  labelBn: 'বন্ড লাইসেন্স আবেদন'
}, {
  id: 'license-database',
  labelEn: 'Bonder Profile & License DB',
  labelBn: 'বন্ডকারী প্রোফাইল ও লাইসেন্স ডিবি'
}, {
  id: 'general-bond',
  labelEn: 'General Bond Management',
  labelBn: 'জেনারেল বন্ড ব্যবস্থাপনা'
}, {
  id: 'e-passbook',
  labelEn: 'e-Passbook Management',
  labelBn: 'ই-পাসবুক ব্যবস্থাপনা'
}, {
  id: 'e-bond-register',
  labelEn: 'e-Bond Register Management',
  labelBn: 'ই-বন্ড রেজিস্টার ব্যবস্থাপনা'
}, {
  id: 'hs-code',
  labelEn: 'HS Code Management',
  labelBn: 'এইচএস কোড ব্যবস্থাপনা'
}, {
  id: 'machinery',
  labelEn: 'Machinery Database Management',
  labelBn: 'যন্ত্রপাতি ডেটাবেজ ব্যবস্থাপনা'
}, {
  id: 'lien-bank-portal',
  labelEn: 'Lien Bank Portal & Profile',
  labelBn: 'লিয়েন ব্যাংক পোর্টাল ও প্রোফাইল'
}, {
  id: 'lien-bank-change',
  labelEn: 'Lien Bank Change Management',
  labelBn: 'লিয়েন ব্যাংক পরিবর্তন ব্যবস্থাপনা'
}, {
  id: 'annual-audit',
  labelEn: 'Annual Audit Management',
  labelBn: 'বার্ষিক নিরীক্ষা ব্যবস্থাপনা'
}, {
  id: 'entitlement',
  labelEn: 'Entitlement Management',
  labelBn: 'এনটাইটেলমেন্ট ব্যবস্থাপনা'
}, {
  id: 'coefficient',
  labelEn: 'Co-efficient Management',
  labelBn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা'
}, {
  id: 'utilization-permission',
  labelEn: 'UP (Utilization Permission) Management',
  labelBn: 'ইউপি (ইউটিলাইজেশন পারমিশন) ব্যবস্থাপনা'
}, {
  id: 'inventory-monitoring',
  labelEn: 'Bonder Inventory Monitoring',
  labelBn: 'বন্ডকারী ইনভেন্টরি মনিটরিং'
}, {
  id: 'legal-procedures',
  labelEn: 'Legal Procedure Management',
  labelBn: 'আইনি প্রক্রিয়া ব্যবস্থাপনা'
}, {
  id: 'case-information',
  labelEn: 'Case Information Input Management',
  labelBn: 'মামলার তথ্য ইনপুট ব্যবস্থাপনা'
}, {
  id: 'inter-bond-transfer',
  labelEn: 'Inter-Bond Transfer Management',
  labelBn: 'ইন্টার-বন্ড ট্রান্সফার ব্যবস্থাপনা'
}, {
  id: 'license-ownership-change',
  labelEn: 'Bond License Ownership Change',
  labelBn: 'বন্ড লাইসেন্স মালিকানা পরিবর্তন'
}, {
  id: 'sub-contract',
  labelEn: 'Sub Contract Management',
  labelBn: 'সাব কন্ট্রাক্ট ব্যবস্থাপনা'
}, {
  id: 'document-archive',
  labelEn: 'Document Archive Management',
  labelBn: 'ডকুমেন্ট আর্কাইভ ব্যবস্থাপনা'
}, {
  id: 'e-nothi',
  labelEn: 'Note & Nothi Management',
  labelBn: 'নোট ও নথি ব্যবস্থাপনা'
}, {
  id: 'reports',
  labelEn: 'Report Management',
  labelBn: 'প্রতিবেদন ব্যবস্থাপনা'
}, {
  id: 'business-intelligence',
  labelEn: 'Business Intelligence & Dashboard',
  labelBn: 'বিজনেস ইন্টেলিজেন্স ও ড্যাশবোর্ড'
}, {
  id: 'business-rules',
  labelEn: 'Operational/Business Rule Configuration',
  labelBn: 'অপারেশনাল/বিজনেস রুল কনফিগারেশন'
}, {
  id: 'integration-monitoring',
  labelEn: '3rd Party Integration Monitoring',
  labelBn: 'তৃতীয় পক্ষ ইন্টিগ্রেশন মনিটরিং'
}, {
  id: 'user-management',
  labelEn: 'User & User Role Management',
  labelBn: 'ব্যবহারকারী ও রোল ব্যবস্থাপনা'
}];

const OPERATIONAL_MODULES = ['cbc-portal', 'new-bond-license', 'license-database', 'general-bond', 'e-passbook', 'e-bond-register', 'hs-code', 'machinery', 'lien-bank-portal', 'lien-bank-change', 'annual-audit', 'entitlement', 'coefficient', 'utilization-permission', 'inventory-monitoring', 'legal-procedures', 'case-information', 'inter-bond-transfer', 'license-ownership-change', 'sub-contract', 'document-archive', 'e-nothi', 'reports'];

const GENERAL_USER_MODULES = ['new-bond-license', 'general-bond', 'e-passbook', 'e-bond-register', 'hs-code', 'machinery', 'lien-bank-portal', 'lien-bank-change', 'annual-audit', 'entitlement', 'coefficient', 'utilization-permission', 'inventory-monitoring', 'case-information', 'inter-bond-transfer', 'license-ownership-change', 'sub-contract'];

function buildAccess(fullIds: string[], readOnlyIds: string[] = []): Record<string, AccessLevel> {
  const map: Record<string, AccessLevel> = {};
  moduleCatalog.forEach(m => {
    map[m.id] = 'none';
  });
  fullIds.forEach(id => {
    map[id] = 'full';
  });
  readOnlyIds.forEach(id => {
    map[id] = 'read-only';
  });
  return map;
}

export const roleTiers: RoleTier[] = [{
  id: 'system-admin',
  nameEn: 'System Admin',
  nameBn: 'সিস্টেম অ্যাডমিন',
  descEn: 'Full technical ownership of the platform — user/role management, business rule configuration, integration monitoring, and every operational and analytics module.',
  descBn: 'প্ল্যাটফর্মের সম্পূর্ণ কারিগরি দায়িত্ব — ব্যবহারকারী/রোল ব্যবস্থাপনা, বিজনেস রুল কনফিগারেশন, ইন্টিগ্রেশন মনিটরিং এবং প্রতিটি অপারেশনাল ও অ্যানালিটিক্স মডিউল।',
  designations: [{
    en: 'Chairman',
    bn: 'চেয়ারম্যান'
  }, {
    en: 'System Manager',
    bn: 'সিস্টেম ম্যানেজার'
  }, {
    en: 'Senior System Analyst',
    bn: 'সিনিয়র সিস্টেম অ্যানালিস্ট'
  }, {
    en: 'System Analyst',
    bn: 'সিস্টেম অ্যানালিস্ট'
  }, {
    en: 'Programmer',
    bn: 'প্রোগ্রামার'
  }, {
    en: 'Maintenance Engineer',
    bn: 'মেইনটেন্যান্স ইঞ্জিনিয়ার'
  }],
  userCount: 10,
  color: '#0A4D8C',
  icon: 'admin_panel_settings',
  access: buildAccess(moduleCatalog.map(m => m.id))
}, {
  id: 'monitoring-authority',
  nameEn: 'Monitoring Authority',
  nameBn: 'মনিটরিং কর্তৃপক্ষ',
  descEn: 'NBR leadership overseeing CBC operations end-to-end, with read-only visibility into Business Intelligence dashboards for policy decision-making.',
  descBn: 'সিবিসি কার্যক্রম শুরু থেকে শেষ পর্যন্ত তদারককারী এনবিআর নেতৃত্ব, নীতিগত সিদ্ধান্তের জন্য বিজনেস ইন্টেলিজেন্স ড্যাশবোর্ডে শুধু-পঠন দৃশ্যমানতাসহ।',
  designations: [{
    en: 'Chairman',
    bn: 'চেয়ারম্যান'
  }, {
    en: 'Member (Customs Export, Bond & IT)',
    bn: 'সদস্য (কাস্টমস এক্সপোর্ট, বন্ড ও আইটি)'
  }, {
    en: 'First Secretary (Customs Export, Bond & IT)',
    bn: 'প্রথম সচিব (কাস্টমস এক্সপোর্ট, বন্ড ও আইটি)'
  }, {
    en: 'Second Secretary (Customs Export, Bond & IT)',
    bn: 'দ্বিতীয় সচিব (কাস্টমস এক্সপোর্ট, বন্ড ও আইটি)'
  }, {
    en: 'Commissioner',
    bn: 'কমিশনার'
  }],
  userCount: 10,
  color: '#7C3AED',
  icon: 'workspace_premium',
  access: buildAccess(OPERATIONAL_MODULES, ['business-intelligence'])
}, {
  id: 'system-user',
  nameEn: 'System User',
  nameBn: 'সিস্টেম ইউজার',
  descEn: 'CBC officials who process day-to-day case work — from Assistant Revenue Officer up to Additional Commissioner — across every operational module.',
  descBn: 'সহকারী রাজস্ব কর্মকর্তা থেকে অতিরিক্ত কমিশনার পর্যন্ত প্রতিটি অপারেশনাল মডিউল জুড়ে দৈনন্দিন মামলার কাজ পরিচালনাকারী সিবিসি কর্মকর্তারা।',
  designations: [{
    en: 'Additional Commissioner',
    bn: 'অতিরিক্ত কমিশনার'
  }, {
    en: 'Joint Commissioner',
    bn: 'যুগ্ম কমিশনার'
  }, {
    en: 'Deputy Commissioner',
    bn: 'উপ কমিশনার'
  }, {
    en: 'Assistant Commissioner',
    bn: 'সহকারী কমিশনার'
  }, {
    en: 'Revenue Officer',
    bn: 'রাজস্ব কর্মকর্তা'
  }, {
    en: 'Assistant Revenue Officer',
    bn: 'সহকারী রাজস্ব কর্মকর্তা'
  }, {
    en: 'System Analyst',
    bn: 'সিস্টেম অ্যানালিস্ট'
  }, {
    en: 'Programmer',
    bn: 'প্রোগ্রামার'
  }, {
    en: 'Assistant Programmer',
    bn: 'সহকারী প্রোগ্রামার'
  }, {
    en: 'Head Assistant',
    bn: 'হেড সহকারী'
  }, {
    en: 'Computer Operator',
    bn: 'কম্পিউটার অপারেটর'
  }, {
    en: 'Upper Division Assistant',
    bn: 'উচ্চমান সহকারী'
  }],
  userCount: 5000,
  color: '#1E88E5',
  icon: 'badge',
  access: buildAccess(OPERATIONAL_MODULES)
}, {
  id: 'system-viewer',
  nameEn: 'System Viewer',
  nameBn: 'সিস্টেম ভিউয়ার',
  descEn: 'Senior Customs & VAT policy officials across other wings of NBR who need read-only oversight of CBC operations and analytics, without case-processing rights.',
  descBn: 'এনবিআর-এর অন্যান্য শাখার সিনিয়র কাস্টমস ও ভ্যাট নীতি কর্মকর্তা যাদের মামলা-প্রক্রিয়াকরণ অধিকার ছাড়াই সিবিসি কার্যক্রম ও অ্যানালিটিক্সের শুধু-পঠন তদারকি প্রয়োজন।',
  designations: [{
    en: 'Member (Customs & VAT Admin)',
    bn: 'সদস্য (কাস্টমস ও ভ্যাট প্রশাসন)'
  }, {
    en: 'Member (Customs Policy)',
    bn: 'সদস্য (কাস্টমস নীতি)'
  }, {
    en: 'Member (Customs Audit & Intelligence)',
    bn: 'সদস্য (কাস্টমস নিরীক্ষা ও গোয়েন্দা)'
  }, {
    en: 'Member (VAT Policy)',
    bn: 'সদস্য (ভ্যাট নীতি)'
  }, {
    en: 'Member (VAT Enforcement & IT)',
    bn: 'সদস্য (ভ্যাট এনফোর্সমেন্ট ও আইটি)'
  }, {
    en: 'Member (VAT Audit & Intelligence)',
    bn: 'সদস্য (ভ্যাট নিরীক্ষা ও গোয়েন্দা)'
  }, {
    en: 'Director, CIC (Customs & Excise)',
    bn: 'পরিচালক, সিআইসি (কাস্টমস ও এক্সাইজ)'
  }],
  designationNoteEn: '+ 27 more First/Second Secretary designations across Customs & VAT policy, budget, valuation, intelligence and enforcement wings.',
  designationNoteBn: '+ কাস্টমস ও ভ্যাট নীতি, বাজেট, ভ্যালুয়েশন, গোয়েন্দা ও এনফোর্সমেন্ট শাখা জুড়ে আরও ২৭টি প্রথম/দ্বিতীয় সচিব পদবি।',
  userCount: 50,
  color: '#B45309',
  icon: 'policy',
  access: buildAccess([], [...OPERATIONAL_MODULES, 'business-intelligence'])
}, {
  id: 'general-user',
  nameEn: 'General User',
  nameBn: 'সাধারণ ব্যবহারকারী',
  descEn: 'External stakeholders — bond license applicants, bonders, lien banks, co-efficient service providers, C&F agents and stakeholder associations — using the self-service modules of CBMS.',
  descBn: 'বহিরাগত স্টেকহোল্ডার — বন্ড লাইসেন্স আবেদনকারী, বন্ডকারী, লিয়েন ব্যাংক, কো-এফিসিয়েন্ট সেবা প্রদানকারী, সিএন্ডএফ এজেন্ট ও স্টেকহোল্ডার সমিতি — সিবিএমএস-এর সেলফ-সার্ভিস মডিউল ব্যবহারকারী।',
  designations: [{
    en: 'Applicant of Bond License',
    bn: 'বন্ড লাইসেন্স আবেদনকারী'
  }, {
    en: 'Bond Licensee',
    bn: 'বন্ড লাইসেন্সধারী'
  }, {
    en: 'Lien Bank (All AD Branches)',
    bn: 'লিয়েন ব্যাংক (সকল এডি শাখা)'
  }, {
    en: 'Co-efficient Service Provider',
    bn: 'কো-এফিসিয়েন্ট সেবা প্রদানকারী'
  }, {
    en: 'Commercials / C&F Agents',
    bn: 'কমার্শিয়াল / সিএন্ডএফ এজেন্ট'
  }, {
    en: 'Stakeholder Associations',
    bn: 'স্টেকহোল্ডার সমিতি'
  }],
  userCount: 45000,
  color: '#00A86B',
  icon: 'groups',
  access: buildAccess(GENERAL_USER_MODULES)
}];
