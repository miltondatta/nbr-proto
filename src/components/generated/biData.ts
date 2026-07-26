import { bondLicenses } from './bondLicenseData';
import { legalCases } from './legalData';
import { upApplications, stageLabels as upStageLabels, type UpStage } from './upData';
import { validationRequests } from './coefficientData';
import { interBondTransfers } from './interBondData';
import { subContractApplications } from './subContractData';
import { entitlementRecords, inclusionRequests, triggerLabels, type EntitlementTrigger } from './entitlementData';

export type DashboardType = 'operational' | 'tactical' | 'strategic';
export type WidgetCategory = 'performance' | 'fraud' | 'budget' | 'financial' | 'forecast' | 'scorecard' | 'strategic-planning' | 'data-analysis';
export type Role = 'commissioner' | 'ro-aro' | 'system-admin' | 'system-viewer';
export type ChartType = 'sparkline' | 'radial' | 'bar';

export interface ChartDistributionSlice {
  labelEn: string;
  labelBn: string;
  value: number;
}

export interface BiWidget {
  id: string;
  titleEn: string;
  titleBn: string;
  category: WidgetCategory;
  dashboards: DashboardType[];
  value: string;
  trend: 'up' | 'down' | 'flat';
  trendLabelEn: string;
  trendLabelBn: string;
  descEn: string;
  descBn: string;
  chartType?: ChartType;
  series?: number[];
  percent?: number;
  distribution?: ChartDistributionSlice[];
}

export const dashboardTypeLabels: Record<DashboardType, { en: string; bn: string; descEn: string; descBn: string; icon: string }> = {
  operational: {
    en: 'Operational Dashboard',
    bn: 'অপারেশনাল ড্যাশবোর্ড',
    descEn: 'Real-time monitoring of day-to-day CBC activity.',
    descBn: 'সিবিসি-র দৈনন্দিন কার্যক্রমের রিয়েল-টাইম পর্যবেক্ষণ।',
    icon: 'monitoring'
  },
  tactical: {
    en: 'Tactical Dashboard',
    bn: 'ট্যাকটিক্যাল ড্যাশবোর্ড',
    descEn: 'Analysis and benchmarking across officers, zones and modules.',
    descBn: 'কর্মকর্তা, জোন ও মডিউল জুড়ে বিশ্লেষণ ও বেঞ্চমার্কিং।',
    icon: 'insights'
  },
  strategic: {
    en: 'Strategic Dashboard',
    bn: 'স্ট্র্যাটেজিক ড্যাশবোর্ড',
    descEn: 'Tracking progress toward strategic policy objectives.',
    descBn: 'কৌশলগত নীতি লক্ষ্যের দিকে অগ্রগতি ট্র্যাকিং।',
    icon: 'flag'
  }
};

export const categoryLabels: Record<WidgetCategory, { en: string; bn: string }> = {
  performance: { en: 'Performance & Accountability', bn: 'কর্মক্ষমতা ও জবাবদিহিতা' },
  fraud: { en: 'Fraud & Duplicate Detection', bn: 'জালিয়াতি ও ডুপ্লিকেট শনাক্তকরণ' },
  budget: { en: 'Budgeting & Deadlines', bn: 'বাজেট ও সময়সীমা' },
  financial: { en: 'Financial Summary', bn: 'আর্থিক সারসংক্ষেপ' },
  forecast: { en: 'Forecasting', bn: 'পূর্বাভাস' },
  scorecard: { en: 'Score Carding', bn: 'স্কোরকার্ডিং' },
  'strategic-planning': { en: 'Strategic Planning', bn: 'কৌশলগত পরিকল্পনা' },
  'data-analysis': { en: 'Data Analysis', bn: 'তথ্য বিশ্লেষণ' }
};

export const roleOptions: { id: Role; en: string; bn: string; defaultDashboard: DashboardType }[] = [{
  id: 'commissioner',
  en: 'Commissioner (Monitoring Authority)',
  bn: 'কমিশনার (মনিটরিং কর্তৃপক্ষ)',
  defaultDashboard: 'strategic'
}, {
  id: 'ro-aro',
  en: 'RO/ARO (System User)',
  bn: 'আরও/এআরও (সিস্টেম ইউজার)',
  defaultDashboard: 'operational'
}, {
  id: 'system-admin',
  en: 'System Admin',
  bn: 'সিস্টেম অ্যাডমিন',
  defaultDashboard: 'tactical'
}, {
  id: 'system-viewer',
  en: 'System Viewer',
  bn: 'সিস্টেম ভিউয়ার',
  defaultDashboard: 'tactical'
}];

const activeLicenses = bondLicenses.filter(l => l.status === 'active').length;
const nonCompliant = bondLicenses.filter(l => l.auditStatus === 'non-compliant').length;
const casePending = bondLicenses.filter(l => l.legalStatus === 'case-pending').length;
const activeLegalCases = legalCases.filter(c => !['closed-favor-bonder', 'closed-favor-cbc', 'bin-locked'].includes(c.stage)).length;
const pendingUp = upApplications.filter(a => !['approved', 'disapproved'].includes(a.stage)).length;
const approvedUp = upApplications.filter(a => a.stage === 'approved').length;
const revertedUp = upApplications.filter(a => a.stage === 'reverted').length;
const coefficientApproved = validationRequests.filter(r => r.stage === 'approved').length;
const coefficientTotal = validationRequests.length;
const transferVolume = interBondTransfers.length + subContractApplications.length;
const transferApproved = interBondTransfers.filter(x => x.stage === 'approved').length + subContractApplications.filter(x => x.stage === 'approved').length;
const pendingInclusion = inclusionRequests.filter(r => !['issued', 'disapproved'].includes(r.stage)).length;

const upNonTerminalStages: UpStage[] = ['submitted', 'assignment', 'verification', 'usage-validation', 'reverted', 'pending-approval'];
const upDistribution: ChartDistributionSlice[] = upNonTerminalStages.map(s => ({
  labelEn: upStageLabels[s].en,
  labelBn: upStageLabels[s].bn,
  value: upApplications.filter(a => a.stage === s).length
}));

const entitlementTriggerOrder: EntitlementTrigger[] = ['license-approval', 'audit-approval', 'inclusion-addition'];
const entitlementDistribution: ChartDistributionSlice[] = entitlementTriggerOrder.map(tr => ({
  labelEn: triggerLabels[tr].en,
  labelBn: triggerLabels[tr].bn,
  value: entitlementRecords.filter(r => r.trigger === tr).length
}));

const activeLicensesSeries = [activeLicenses - 6, activeLicenses - 5, activeLicenses - 5, activeLicenses - 3, activeLicenses - 2, activeLicenses - 1, activeLicenses].map(v => Math.max(0, v));
const nonCompliantSeries = [nonCompliant + 3, nonCompliant + 3, nonCompliant + 2, nonCompliant + 2, nonCompliant + 1, nonCompliant + 1, nonCompliant].map(v => Math.max(0, v));
const dutyExposureSeries = [389, 396, 402, 408, 415, 421, 428.6];
const forecastUpSeries = [Math.max(1, approvedUp - 6), Math.max(1, approvedUp - 4), Math.max(1, approvedUp - 3), Math.max(1, approvedUp - 1), approvedUp, Math.round(approvedUp * 1.18), Math.round(approvedUp * 1.35)];
const coefficientRatePercent = coefficientTotal > 0 ? Math.round(coefficientApproved / coefficientTotal * 100) : 0;
const transferApprovalPercent = transferVolume > 0 ? Math.round(transferApproved / transferVolume * 100) : 0;

export const biWidgets: BiWidget[] = [{
  id: 'kpi-active-licenses',
  titleEn: 'Active Bond Licenses',
  titleBn: 'সক্রিয় বন্ড লাইসেন্স',
  category: 'performance',
  dashboards: ['operational', 'tactical'],
  value: String(activeLicenses),
  trend: 'up',
  trendLabelEn: '+3 this month',
  trendLabelBn: 'এই মাসে +৩',
  descEn: 'Currently active licenses across all categories, live from the License Database.',
  descBn: 'সকল শ্রেণিতে বর্তমানে সক্রিয় লাইসেন্স, লাইসেন্স ডেটাবেজ থেকে লাইভ।',
  chartType: 'sparkline',
  series: activeLicensesSeries
}, {
  id: 'kpi-non-compliant',
  titleEn: 'Non-Compliant Bonders',
  titleBn: 'অসম্মত বন্ডকারী',
  category: 'fraud',
  dashboards: ['operational', 'tactical'],
  value: String(nonCompliant),
  trend: nonCompliant > 0 ? 'down' : 'flat',
  trendLabelEn: 'Flagged from Annual Audit',
  trendLabelBn: 'বার্ষিক নিরীক্ষা থেকে চিহ্নিত',
  descEn: 'Bonders currently flagged non-compliant by audit — prioritized for review and duplicate/fraud checks.',
  descBn: 'নিরীক্ষা দ্বারা বর্তমানে অসম্মত হিসেবে চিহ্নিত বন্ডকারী — পর্যালোচনা ও জালিয়াতি যাচাইয়ের জন্য অগ্রাধিকারপ্রাপ্ত।',
  chartType: 'sparkline',
  series: nonCompliantSeries
}, {
  id: 'kpi-case-pending',
  titleEn: 'Bonders Under Active Legal Case',
  titleBn: 'সক্রিয় মামলাধীন বন্ডকারী',
  category: 'fraud',
  dashboards: ['operational', 'strategic'],
  value: String(casePending),
  trend: 'flat',
  trendLabelEn: `${activeLegalCases} active cases in pipeline`,
  trendLabelBn: `পাইপলাইনে ${activeLegalCases}টি সক্রিয় মামলা`,
  descEn: 'Bonders with legal status "case pending", cross-referenced from Legal Management.',
  descBn: 'আইনি ব্যবস্থাপনা থেকে ক্রস-রেফারেন্সকৃত "মামলা মুলতুবি" অবস্থার বন্ডকারী।'
}, {
  id: 'kpi-up-pending',
  titleEn: 'UP Applications Pending',
  titleBn: 'মুলতুবি ইউপি আবেদন',
  category: 'budget',
  dashboards: ['operational'],
  value: String(pendingUp),
  trend: 'flat',
  trendLabelEn: `${revertedUp} reverted to bonder`,
  trendLabelBn: `${revertedUp}টি বন্ডকারীর কাছে ফেরত`,
  descEn: 'Utilization Permission applications awaiting verification, usage-validation or approval, with expected completion deadlines.',
  descBn: 'যাচাইকরণ, ব্যবহার-যাচাই বা অনুমোদনের অপেক্ষায় থাকা ইউটিলাইজেশন পারমিশন আবেদন, প্রত্যাশিত সমাপ্তির সময়সীমাসহ।',
  chartType: 'bar',
  distribution: upDistribution
}, {
  id: 'kpi-inclusion-pending',
  titleEn: 'Entitlement Inclusion/Addition Requests Pending',
  titleBn: 'মুলতুবি এনটাইটেলমেন্ট অন্তর্ভুক্তি/সংযোজন অনুরোধ',
  category: 'budget',
  dashboards: ['operational'],
  value: String(pendingInclusion),
  trend: 'flat',
  trendLabelEn: 'Within Commissioner override window',
  trendLabelBn: 'কমিশনার ওভাররাইড উইন্ডোর মধ্যে',
  descEn: 'Pending inclusion/addition requests against the current entitlement cycle deadline.',
  descBn: 'বর্তমান এনটাইটেলমেন্ট চক্রের সময়সীমার বিপরীতে মুলতুবি অন্তর্ভুক্তি/সংযোজন অনুরোধ।'
}, {
  id: 'kpi-duty-exposure',
  titleEn: 'Estimated Duty & VAT Exposure',
  titleBn: 'আনুমানিক শুল্ক ও ভ্যাট এক্সপোজার',
  category: 'financial',
  dashboards: ['tactical', 'strategic'],
  value: '৳ 428.6 Cr',
  trend: 'up',
  trendLabelEn: '+2.1% vs last quarter',
  trendLabelBn: 'গত প্রান্তিকের তুলনায় +২.১%',
  descEn: 'Outstanding duty/VAT exposure on active bonds; drill down by license category and district.',
  descBn: 'সক্রিয় বন্ডের অনিষ্পন্ন শুল্ক/ভ্যাট এক্সপোজার; লাইসেন্স শ্রেণি ও জেলা অনুযায়ী বিস্তারিত।',
  chartType: 'sparkline',
  series: dutyExposureSeries
}, {
  id: 'kpi-coefficient-rate',
  titleEn: 'Co-efficient Validation Approval Rate',
  titleBn: 'কো-এফিসিয়েন্ট যাচাই অনুমোদনের হার',
  category: 'scorecard',
  dashboards: ['tactical'],
  value: coefficientTotal > 0 ? `${Math.round(coefficientApproved / coefficientTotal * 100)}%` : 'N/A',
  trend: 'up',
  trendLabelEn: `${coefficientApproved} of ${coefficientTotal} requests approved`,
  trendLabelBn: `${coefficientTotal}টির মধ্যে ${coefficientApproved}টি অনুরোধ অনুমোদিত`,
  descEn: 'Approval rate across DB-match, DEDO-direct and outsourced validation paths.',
  descBn: 'ডিবি-মিল, ডিইডিও-সরাসরি ও আউটসোর্সড যাচাই পথ জুড়ে অনুমোদনের হার।',
  chartType: 'radial',
  percent: coefficientRatePercent
}, {
  id: 'kpi-transfer-approval',
  titleEn: 'Inter-Bond / Sub-Contract Approval Rate',
  titleBn: 'ইন্টার-বন্ড/সাব-কন্ট্রাক্ট অনুমোদনের হার',
  category: 'scorecard',
  dashboards: ['tactical'],
  value: transferVolume > 0 ? `${Math.round(transferApproved / transferVolume * 100)}%` : 'N/A',
  trend: 'flat',
  trendLabelEn: `${transferApproved} of ${transferVolume} approved`,
  trendLabelBn: `${transferVolume}টির মধ্যে ${transferApproved}টি অনুমোদিত`,
  descEn: 'Combined approval performance for Inter-Bond Transfer and Sub-Contract Management pipelines.',
  descBn: 'ইন্টার-বন্ড ট্রান্সফার ও সাব-কন্ট্রাক্ট ব্যবস্থাপনা পাইপলাইনের সম্মিলিত অনুমোদন কর্মক্ষমতা।',
  chartType: 'radial',
  percent: transferApprovalPercent
}, {
  id: 'kpi-forecast-up',
  titleEn: 'Forecasted UP Approvals (Next Quarter)',
  titleBn: 'পরবর্তী প্রান্তিকে পূর্বাভাসকৃত ইউপি অনুমোদন',
  category: 'forecast',
  dashboards: ['strategic'],
  value: String(Math.round(approvedUp * 1.35)),
  trend: 'up',
  trendLabelEn: 'Based on trailing 2-quarter trend',
  trendLabelBn: 'গত ২ প্রান্তিকের প্রবণতার ভিত্তিতে',
  descEn: 'Projected UP approval volume based on historical throughput and current pipeline depth.',
  descBn: 'ঐতিহাসিক থ্রুপুট ও বর্তমান পাইপলাইন গভীরতার ভিত্তিতে প্রক্ষেপিত ইউপি অনুমোদনের পরিমাণ।',
  chartType: 'sparkline',
  series: forecastUpSeries
}, {
  id: 'kpi-strategic-digitization',
  titleEn: 'CBC Process Digitization Coverage',
  titleBn: 'সিবিসি প্রক্রিয়া ডিজিটালাইজেশন কভারেজ',
  category: 'strategic-planning',
  dashboards: ['strategic'],
  value: '87%',
  trend: 'up',
  trendLabelEn: '21 of 24 e-Feature modules live',
  trendLabelBn: '২৪টি ই-ফিচার মডিউলের মধ্যে ২১টি চালু',
  descEn: 'Share of Annex-II e-Feature modules fully digitized and operational in CBMS, tracked against the ToR roadmap.',
  descBn: 'সিবিএমএস-এ সম্পূর্ণ ডিজিটালাইজড ও চালু অ্যানেক্স-২ ই-ফিচার মডিউলের অংশ, টিওআর রোডম্যাপের বিপরীতে ট্র্যাককৃত।',
  chartType: 'radial',
  percent: 87
}, {
  id: 'kpi-entitlement-total',
  titleEn: 'Total Entitlement Value Issued',
  titleBn: 'ইস্যুকৃত মোট এনটাইটেলমেন্ট মূল্য',
  category: 'data-analysis',
  dashboards: ['tactical', 'strategic'],
  value: String(entitlementRecords.length) + ' active',
  trend: 'flat',
  trendLabelEn: 'Across License-Approval, Audit-Approval & Inclusion triggers',
  trendLabelBn: 'লাইসেন্স-অনুমোদন, নিরীক্ষা-অনুমোদন ও অন্তর্ভুক্তি ট্রিগার জুড়ে',
  descEn: 'Active entitlement records segmented by issuance trigger, for cross-module data analysis.',
  descBn: 'ইস্যু ট্রিগার অনুযায়ী বিভক্ত সক্রিয় এনটাইটেলমেন্ট রেকর্ড, ক্রস-মডিউল তথ্য বিশ্লেষণের জন্য।',
  chartType: 'bar',
  distribution: entitlementDistribution
}];
