export type LicenseStatus = 'active' | 'suspended' | 'cancelled' | 'pending-renewal';
export type AuditStatus = 'compliant' | 'non-compliant' | 'pending' | 'na';
export type LicenseCategory = 'direct-exporter' | 'deemed-exporter' | 'epz-enterprise';
export type LegalStatus = 'clear' | 'notice-issued' | 'case-pending';

export interface BondLicense {
  licenseNo: string;
  nameEn: string;
  nameBn: string;
  bin: string;
  category: LicenseCategory;
  status: LicenseStatus;
  issueDate: string;
  district: string;
  lienBank: string;
  auditStatus: AuditStatus;
  legalStatus: LegalStatus;
  upUdNo: string;
  contactPhone: string;
  contactEmail: string;
}

export const legalStatusLabels: Record<LegalStatus, { en: string; bn: string; color: string }> = {
  clear: { en: 'Clear', bn: 'নিষ্পত্তিকৃত', color: '#00A86B' },
  'notice-issued': { en: 'Notice Issued', bn: 'নোটিশ জারিকৃত', color: '#B45309' },
  'case-pending': { en: 'Case Pending', bn: 'মামলা বিচারাধীন', color: '#DC2626' },
};

export const licenseCategoryLabels: Record<LicenseCategory, { en: string; bn: string }> = {
  'direct-exporter': { en: 'Direct Exporter', bn: 'প্রত্যক্ষ রপ্তানিকারক' },
  'deemed-exporter': { en: 'Deemed Exporter', bn: 'পরোক্ষ রপ্তানিকারক' },
  'epz-enterprise': { en: 'EPZ Enterprise', bn: 'ইপিজেড প্রতিষ্ঠান' },
};

export const licenseStatusLabels: Record<LicenseStatus, { en: string; bn: string; color: string }> = {
  active: { en: 'Active', bn: 'সক্রিয়', color: '#00A86B' },
  suspended: { en: 'Suspended', bn: 'স্থগিত', color: '#B45309' },
  cancelled: { en: 'Cancelled', bn: 'বাতিল', color: '#DC2626' },
  'pending-renewal': { en: 'Pending Renewal', bn: 'নবায়ন অপেক্ষমাণ', color: '#1E88E5' },
};

export const auditStatusLabels: Record<AuditStatus, { en: string; bn: string; color: string }> = {
  compliant: { en: 'Compliant', bn: 'সম্মত', color: '#00A86B' },
  'non-compliant': { en: 'Non-Compliant', bn: 'অসম্মত', color: '#DC2626' },
  pending: { en: 'Pending', bn: 'অপেক্ষমাণ', color: '#B45309' },
  na: { en: 'N/A', bn: 'প্রযোজ্য নয়', color: '#94A3B8' },
};

export const bondLicenses: BondLicense[] = [
  { licenseNo: 'BL-2026-04521', nameEn: 'Square Fashions Ltd.', nameBn: 'স্কয়ার ফ্যাশনস লিমিটেড', bin: '004562178-0206', category: 'direct-exporter', status: 'active', issueDate: '15 Jan 2026', district: 'Dhaka', lienBank: 'Sonali Bank, Motijheel Corporate Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-88342', contactPhone: '+880 1711-223344', contactEmail: 'compliance@squarefashions.com.bd' },
  { licenseNo: 'BL-2021-00934', nameEn: 'DBL Group', nameBn: 'ডিবিএল গ্রুপ', bin: '003321456-0105', category: 'direct-exporter', status: 'active', issueDate: '03 Feb 2021', district: 'Gazipur', lienBank: 'Standard Chartered Bank, Gulshan Branch', auditStatus: 'non-compliant', legalStatus: 'case-pending', upUdNo: 'UD-79215', contactPhone: '+880 1712-556677', contactEmail: 'customs@dblgroup.com.bd' },
  { licenseNo: 'BL-2023-02871', nameEn: 'Beximco Textiles Limited', nameBn: 'বেক্সিমকো টেক্সটাইলস লিমিটেড', bin: '002214789-0304', category: 'deemed-exporter', status: 'active', issueDate: '21 Jun 2023', district: 'Dhaka', lienBank: 'Eastern Bank Limited, Motijheel Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UP-91004', contactPhone: '+880 1713-889900', contactEmail: 'bond@beximcotextiles.com.bd' },
  { licenseNo: 'BL-2022-01655', nameEn: 'Envoy Textiles Ltd.', nameBn: 'এনভয় টেক্সটাইলস লিমিটেড', bin: '005871234-0208', category: 'direct-exporter', status: 'active', issueDate: '09 Sep 2022', district: 'Chattogram', lienBank: 'Dutch-Bangla Bank Limited, Agrabad Branch', auditStatus: 'pending', legalStatus: 'clear', upUdNo: 'UD-84471', contactPhone: '+880 1714-112233', contactEmail: 'info@envoytextiles.com.bd' },
  { licenseNo: 'BL-2020-00512', nameEn: 'Ha-Meem Group', nameBn: 'হা-মীম গ্রুপ', bin: '001987654-0102', category: 'direct-exporter', status: 'active', issueDate: '12 Mar 2020', district: 'Savar', lienBank: 'Sonali Bank, Savar Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-76230', contactPhone: '+880 1715-445566', contactEmail: 'bond.desk@hameemgroup.com' },
  { licenseNo: 'BL-2024-03398', nameEn: 'Radiant Apparels Ltd.', nameBn: 'রেডিয়েন্ট অ্যাপারেলস লিমিটেড', bin: '006654321-0407', category: 'direct-exporter', status: 'active', issueDate: '18 Nov 2024', district: 'Narayanganj', lienBank: 'Eastern Bank Limited, Narayanganj Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-90188', contactPhone: '+880 1716-778899', contactEmail: 'compliance@radiantapparels.com.bd' },
  { licenseNo: 'BL-2019-00287', nameEn: 'Epic Designers Ltd.', nameBn: 'এপিক ডিজাইনার্স লিমিটেড', bin: '007765432-0509', category: 'direct-exporter', status: 'suspended', issueDate: '25 Apr 2019', district: 'Dhaka', lienBank: 'Standard Chartered Bank, Gulshan Branch', auditStatus: 'non-compliant', legalStatus: 'notice-issued', upUdNo: 'UD-65590', contactPhone: '+880 1717-990011', contactEmail: 'legal@epicdesigners.com.bd' },
  { licenseNo: 'BL-2023-02998', nameEn: 'Fakir Fashion Ltd.', nameBn: 'ফকির ফ্যাশন লিমিটেড', bin: '008112233-0601', category: 'direct-exporter', status: 'active', issueDate: '30 Jul 2023', district: 'Gazipur', lienBank: 'Dutch-Bangla Bank Limited, Gazipur Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-87762', contactPhone: '+880 1718-223344', contactEmail: 'bond@fakirfashion.com.bd' },
  { licenseNo: 'BL-2021-01204', nameEn: 'Pacific Jeans Ltd.', nameBn: 'প্যাসিফিক জিন্স লিমিটেড', bin: '009887766-0702', category: 'deemed-exporter', status: 'active', issueDate: '14 Dec 2021', district: 'Chattogram', lienBank: 'Sonali Bank, Agrabad Corporate Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UP-82217', contactPhone: '+880 1719-556677', contactEmail: 'customs.desk@pacificjeans.com.bd' },
  { licenseNo: 'BL-2025-04012', nameEn: 'DEDO Compliant Textiles Ltd.', nameBn: 'ডেডো কমপ্লায়েন্ট টেক্সটাইলস লিমিটেড', bin: '001234567-0803', category: 'direct-exporter', status: 'active', issueDate: '22 Feb 2025', district: 'Dhaka', lienBank: 'Eastern Bank Limited, Motijheel Branch', auditStatus: 'pending', legalStatus: 'clear', upUdNo: 'UD-93341', contactPhone: '+880 1720-889900', contactEmail: 'info@dedocompliant.com.bd' },
  { licenseNo: 'BL-2018-00098', nameEn: 'Delta Composite Knitting Ltd.', nameBn: 'ডেল্টা কম্পোজিট নিটিং লিমিটেড', bin: '002345678-0904', category: 'epz-enterprise', status: 'cancelled', issueDate: '10 Jan 2018', district: 'Chattogram (EPZ)', lienBank: 'N/A', auditStatus: 'na', legalStatus: 'case-pending', upUdNo: 'UD-51108', contactPhone: '+880 1721-112233', contactEmail: 'legal@deltacomposite.com.bd' },
  { licenseNo: 'BL-2022-01876', nameEn: 'Jamuna Denims Ltd.', nameBn: 'যমুনা ডেনিমস লিমিটেড', bin: '003456789-1005', category: 'direct-exporter', status: 'active', issueDate: '05 May 2022', district: 'Narayanganj', lienBank: 'Dutch-Bangla Bank Limited, Narayanganj Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-80456', contactPhone: '+880 1722-445566', contactEmail: 'bond@jamunadenims.com.bd' },
  { licenseNo: 'BL-2020-00743', nameEn: 'Meghna Knit Composite Ltd.', nameBn: 'মেঘনা নিট কম্পোজিট লিমিটেড', bin: '004567890-1106', category: 'deemed-exporter', status: 'active', issueDate: '19 Aug 2020', district: 'Gazipur', lienBank: 'Sonali Bank, Gazipur Branch', auditStatus: 'non-compliant', legalStatus: 'notice-issued', upUdNo: 'UP-73390', contactPhone: '+880 1723-778899', contactEmail: 'compliance@meghnaknit.com.bd' },
  { licenseNo: 'BL-2024-03650', nameEn: 'Palmal Group', nameBn: 'পালমল গ্রুপ', bin: '005678901-1207', category: 'direct-exporter', status: 'pending-renewal', issueDate: '02 Oct 2024', district: 'Dhaka', lienBank: 'Standard Chartered Bank, Gulshan Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-89903', contactPhone: '+880 1724-990011', contactEmail: 'bond.desk@palmalgroup.com' },
  { licenseNo: 'BL-2019-00456', nameEn: 'Ananta Denim Technology Ltd.', nameBn: 'অনন্ত ডেনিম টেকনোলজি লিমিটেড', bin: '006789012-1308', category: 'direct-exporter', status: 'active', issueDate: '27 Mar 2019', district: 'Savar', lienBank: 'Eastern Bank Limited, Savar Branch', auditStatus: 'compliant', legalStatus: 'clear', upUdNo: 'UD-68124', contactPhone: '+880 1725-223344', contactEmail: 'info@anantadenim.com.bd' },
];
