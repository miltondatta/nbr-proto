export type ReportFormat = 'pdf' | 'excel' | 'rtf' | 'csv' | 'html';
export type ReportCategory = 'task-wise' | 'user-wise' | 'time-wise';

export interface ReportDefinition {
  id: string;
  nameEn: string;
  nameBn: string;
  module: { en: string; bn: string };
  category: ReportCategory;
  descEn: string;
  descBn: string;
}

export interface GeneratedReport {
  id: string;
  reportId: string;
  generatedAt: string;
  generatedBy: { en: string; bn: string };
  language: 'en' | 'bn';
  format: ReportFormat;
  dateRangeFrom: string;
  dateRangeTo: string;
  fileSizeKb: number;
}

export const formatLabels: Record<ReportFormat, { en: string; bn: string; icon: string; color: string }> = {
  pdf: { en: 'PDF', bn: 'পিডিএফ', icon: 'picture_as_pdf', color: '#DC2626' },
  excel: { en: 'Excel', bn: 'এক্সেল', icon: 'grid_on', color: '#00A86B' },
  rtf: { en: 'RTF', bn: 'আরটিএফ', icon: 'description', color: '#1E88E5' },
  csv: { en: 'CSV', bn: 'সিএসভি', icon: 'table_chart', color: '#B45309' },
  html: { en: 'HTML (Web)', bn: 'এইচটিএমএল (ওয়েব)', icon: 'html', color: '#0A4D8C' }
};

export const categoryLabels: Record<ReportCategory, { en: string; bn: string }> = {
  'task-wise': { en: 'Task-wise', bn: 'কাজ অনুযায়ী' },
  'user-wise': { en: 'User-wise', bn: 'ব্যবহারকারী অনুযায়ী' },
  'time-wise': { en: 'Time/Date-wise', bn: 'সময়/তারিখ অনুযায়ী' }
};

export const reportCatalog: ReportDefinition[] = [{
  id: 'RPT-BL-01',
  nameEn: 'Bond License Issuance Summary',
  nameBn: 'বন্ড লাইসেন্স ইস্যু সারসংক্ষেপ',
  module: { en: 'Bond License Management', bn: 'বন্ড লাইসেন্স ব্যবস্থাপনা' },
  category: 'time-wise',
  descEn: 'New, renewed and cancelled licenses over a selected period, by category and district.',
  descBn: 'নির্বাচিত সময়ে নতুন, নবায়নকৃত ও বাতিলকৃত লাইসেন্সের তালিকা, শ্রেণি ও জেলা অনুযায়ী।'
}, {
  id: 'RPT-AA-01',
  nameEn: 'Annual Audit Compliance Status',
  nameBn: 'বার্ষিক নিরীক্ষা সম্মতি অবস্থা',
  module: { en: 'Annual Audit', bn: 'বার্ষিক নিরীক্ষা' },
  category: 'task-wise',
  descEn: 'Compliant vs. non-compliant bonders from completed audits, with officer assignment.',
  descBn: 'সম্পন্ন নিরীক্ষা থেকে সম্মত বনাম অসম্মত বন্ডকারীদের তালিকা, কর্মকর্তা বরাদ্দসহ।'
}, {
  id: 'RPT-ENT-01',
  nameEn: 'Entitlement Issuance by Officer',
  nameBn: 'কর্মকর্তা অনুযায়ী এনটাইটেলমেন্ট ইস্যু',
  module: { en: 'Entitlement Management', bn: 'এনটাইটেলমেন্ট ব্যবস্থাপনা' },
  category: 'user-wise',
  descEn: 'Auto and manual entitlement issuances grouped by verifying/approving officer.',
  descBn: 'যাচাইকারী/অনুমোদনকারী কর্মকর্তা অনুযায়ী স্বয়ংক্রিয় ও ম্যানুয়াল এনটাইটেলমেন্ট ইস্যুর তালিকা।'
}, {
  id: 'RPT-COEF-01',
  nameEn: 'Co-efficient Validation Turnaround',
  nameBn: 'কো-এফিসিয়েন্ট যাচাই সম্পন্নকরণ সময়',
  module: { en: 'Co-efficient Management', bn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা' },
  category: 'time-wise',
  descEn: 'Average days to validate co-efficients by path (DB-match / DEDO-direct / outsourced).',
  descBn: 'পথ অনুযায়ী (ডিবি-মিল / ডিইডিও-সরাসরি / আউটসোর্সড) কো-এফিসিয়েন্ট যাচাইয়ে গড় সময়।'
}, {
  id: 'RPT-UP-01',
  nameEn: 'Utilization Permission Approval Summary',
  nameBn: 'ইউটিলাইজেশন পারমিশন অনুমোদন সারসংক্ষেপ',
  module: { en: 'UP Management', bn: 'ইউপি ব্যবস্থাপনা' },
  category: 'task-wise',
  descEn: 'UP applications by stage, route (ADC/JC vs AC/DC) and reverted-to-bonder count.',
  descBn: 'পর্যায়, রুট (এডিসি/জেসি বনাম এসি/ডিসি) ও বন্ডকারীর কাছে ফেরতের সংখ্যা অনুযায়ী ইউপি আবেদন।'
}, {
  id: 'RPT-INV-01',
  nameEn: 'Inventory Balance Variance Report',
  nameBn: 'ইনভেন্টরি ব্যালেন্স তারতম্য প্রতিবেদন',
  module: { en: 'Inventory Monitoring', bn: 'ইনভেন্টরি মনিটরিং' },
  category: 'time-wise',
  descEn: 'Ledger balance vs. ideal usage variance across bonders exceeding threshold.',
  descBn: 'সীমা অতিক্রমকারী বন্ডকারীদের লেজার ব্যালেন্স বনাম আদর্শ ব্যবহার তারতম্য।'
}, {
  id: 'RPT-LEG-01',
  nameEn: 'Legal Case Escalation Ladder',
  nameBn: 'আইনি মামলা এসকেলেশন সিঁড়ি',
  module: { en: 'Legal Management', bn: 'আইনি ব্যবস্থাপনা' },
  category: 'task-wise',
  descEn: 'Active cases grouped by current stage, up to Appellate Division level.',
  descBn: 'বর্তমান পর্যায় অনুযায়ী সক্রিয় মামলা, আপিলেট বিভাগ পর্যন্ত।'
}, {
  id: 'RPT-IBT-01',
  nameEn: 'Inter-Bond Transfer & Sub-Contract Volume',
  nameBn: 'ইন্টার-বন্ড ট্রান্সফার ও সাব-কন্ট্রাক্ট পরিমাণ',
  module: { en: 'Inter-Bond Transfer', bn: 'ইন্টার-বন্ড ট্রান্সফার' },
  category: 'time-wise',
  descEn: 'Transfer/sub-contract volumes between bonders with approval/disapproval rate.',
  descBn: 'বন্ডকারীদের মধ্যে ট্রান্সফার/সাব-কন্ট্রাক্ট পরিমাণ এবং অনুমোদন/অননুমোদনের হার।'
}, {
  id: 'RPT-USR-01',
  nameEn: 'Officer Workload Distribution',
  nameBn: 'কর্মকর্তা কর্মভার বণ্টন',
  module: { en: 'System Administration', bn: 'সিস্টেম প্রশাসন' },
  category: 'user-wise',
  descEn: 'Pending, in-progress and completed tasks assigned per RO/ARO across all modules.',
  descBn: 'সকল মডিউলে প্রতিটি আরও/এআরও-কে বরাদ্দকৃত মুলতুবি, চলমান ও সম্পন্ন কাজ।'
}, {
  id: 'RPT-FIN-01',
  nameEn: 'Duty & VAT Exposure Summary',
  nameBn: 'শুল্ক ও ভ্যাট এক্সপোজার সারসংক্ষেপ',
  module: { en: 'General Bond Management', bn: 'জেনারেল বন্ড ব্যবস্থাপনা' },
  category: 'time-wise',
  descEn: 'Estimated duty/VAT exposure on outstanding bonds by license category.',
  descBn: 'লাইসেন্স শ্রেণি অনুযায়ী অনিষ্পন্ন বন্ডের আনুমানিক শুল্ক/ভ্যাট এক্সপোজার।'
}];

export const generatedReports: GeneratedReport[] = [{
  id: 'GEN-2026-0091',
  reportId: 'RPT-BL-01',
  generatedAt: '25 Jul 2026, 10:42',
  generatedBy: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  language: 'en',
  format: 'pdf',
  dateRangeFrom: '01 Jul 2026',
  dateRangeTo: '25 Jul 2026',
  fileSizeKb: 842
}, {
  id: 'GEN-2026-0088',
  reportId: 'RPT-LEG-01',
  generatedAt: '23 Jul 2026, 15:07',
  generatedBy: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  language: 'bn',
  format: 'excel',
  dateRangeFrom: '01 Jan 2026',
  dateRangeTo: '23 Jul 2026',
  fileSizeKb: 214
}, {
  id: 'GEN-2026-0080',
  reportId: 'RPT-UP-01',
  generatedAt: '20 Jul 2026, 09:15',
  generatedBy: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  language: 'en',
  format: 'csv',
  dateRangeFrom: '01 Jun 2026',
  dateRangeTo: '20 Jul 2026',
  fileSizeKb: 58
}, {
  id: 'GEN-2026-0071',
  reportId: 'RPT-COEF-01',
  generatedAt: '15 Jul 2026, 12:30',
  generatedBy: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  language: 'en',
  format: 'pdf',
  dateRangeFrom: '01 Jan 2026',
  dateRangeTo: '15 Jul 2026',
  fileSizeKb: 391
}, {
  id: 'GEN-2026-0064',
  reportId: 'RPT-INV-01',
  generatedAt: '10 Jul 2026, 17:52',
  generatedBy: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  language: 'bn',
  format: 'html',
  dateRangeFrom: '01 Apr 2026',
  dateRangeTo: '10 Jul 2026',
  fileSizeKb: 129
}, {
  id: 'GEN-2026-0052',
  reportId: 'RPT-AA-01',
  generatedAt: '02 Jul 2026, 11:20',
  generatedBy: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  language: 'en',
  format: 'excel',
  dateRangeFrom: '01 Jan 2026',
  dateRangeTo: '30 Jun 2026',
  fileSizeKb: 276
}, {
  id: 'GEN-2026-0041',
  reportId: 'RPT-IBT-01',
  generatedAt: '22 Jun 2026, 14:03',
  generatedBy: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  language: 'en',
  format: 'rtf',
  dateRangeFrom: '01 Jan 2026',
  dateRangeTo: '22 Jun 2026',
  fileSizeKb: 97
}, {
  id: 'GEN-2026-0033',
  reportId: 'RPT-USR-01',
  generatedAt: '15 Jun 2026, 09:48',
  generatedBy: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  language: 'bn',
  format: 'pdf',
  dateRangeFrom: '01 Jun 2026',
  dateRangeTo: '15 Jun 2026',
  fileSizeKb: 163
}];
