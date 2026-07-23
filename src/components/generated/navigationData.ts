export interface NavItem {
  id: string;
  en: string;
  bn: string;
  icon: string;
  children?: NavItem[];
}

export const navigationTree: NavItem[] = [
{ id: 'dashboard', en: 'Dashboard', bn: 'ড্যাশবোর্ড', icon: 'dashboard' },
{
  id: 'cbc-portal',
  en: 'CBC Portal',
  bn: 'সিবিসি পোর্টাল',
  icon: 'corporate_fare',
  children: [
  { id: 'e-licensee-profile-creation', en: 'e-Licensee Profile Creation', bn: 'ই-লাইসেন্সি প্রোফাইল তৈরি', icon: 'person_add' },
  { id: 'e-service-list', en: 'e-Service List', bn: 'ই-সার্ভিস লিস্ট', icon: 'list_alt' },
  { id: 'portal-contents', en: 'Portal Contents', bn: 'পোর্টাল কন্টেন্ট', icon: 'article' },
  { id: 'rules-policies', en: 'Rules & Policies', bn: 'নিয়ম ও নীতিমালা', icon: 'gavel' },
  { id: 'checklists', en: 'Checklists', bn: 'চেকলিস্ট', icon: 'checklist' },
  { id: 'online-application-form', en: 'Online Application Form', bn: 'অনলাইন আবেদন ফরম', icon: 'assignment_turned_in' },
  { id: 'submission-guidelines', en: 'Submission Guidelines', bn: 'জমাদান নির্দেশিকা', icon: 'ondemand_video' },
  { id: 'knowledge-base', en: 'Knowledge Base', bn: 'নলেজ বেস', icon: 'menu_book' },
  { id: 'notices', en: 'Notices', bn: 'নোটিশ', icon: 'campaign' },
  { id: 'discussion-forum', en: 'Discussion Forum', bn: 'আলোচনা ফোরাম', icon: 'forum' }]

},
{
  id: 'bond-license',
  en: 'Bond License Management',
  bn: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
  icon: 'assignment',
  children: [
  { id: 'new-bond-license', en: 'New Bond License', bn: 'নতুন বন্ড লাইসেন্স', icon: 'note_add' },
  { id: 'license-ownership-change', en: 'License Ownership Change', bn: 'লাইসেন্স মালিকানা পরিবর্তন', icon: 'sync_alt' },
  { id: 'company-name-change', en: 'Company Name Change', bn: 'কোম্পানির নাম পরিবর্তন', icon: 'edit_square' },
  { id: 'license-database', en: 'License Database', bn: 'লাইসেন্স ডেটাবেজ', icon: 'storage' },
  { id: 'license-search', en: 'License Search', bn: 'লাইসেন্স অনুসন্ধান', icon: 'manage_search' }]

},
{ id: 'general-bond', en: 'General Bond Management', bn: 'জেনারেল বন্ড ব্যবস্থাপনা', icon: 'description' },
{ id: 'e-passbook', en: 'e-Passbook', bn: 'ই-পাসবুক', icon: 'import_contacts' },
{
  id: 'e-bond-register',
  en: 'e-Bond Register',
  bn: 'ই-বন্ড রেজিস্টার',
  icon: 'receipt_long',
  children: [
  { id: 'local-purchase-sales', en: 'Local Purchase & Sales', bn: 'স্থানীয় ক্রয় ও বিক্রয়', icon: 'shopping_cart' },
  { id: 'ex-bond-entry', en: 'Ex-Bond Entry', bn: 'এক্স-বন্ড এন্ট্রি', icon: 'call_made' }]

},
{ id: 'hs-code', en: 'HS Code Management', bn: 'এইচএস কোড ব্যবস্থাপনা', icon: 'tag' },
{
  id: 'machinery',
  en: 'Machinery Management',
  bn: 'যন্ত্রপাতি ব্যবস্থাপনা',
  icon: 'precision_manufacturing',
  children: [
  { id: 'machinery-database', en: 'Machinery Database', bn: 'যন্ত্রপাতি ডেটাবেজ', icon: 'inventory' },
  { id: 'machinery-purchase', en: 'Purchase', bn: 'ক্রয়', icon: 'add_shopping_cart' },
  { id: 'machinery-sale', en: 'Sale', bn: 'বিক্রয়', icon: 'sell' },
  { id: 'machinery-decommission', en: 'Decommission', bn: 'অবলুপ্তকরণ', icon: 'power_off' }]

},
{
  id: 'lien-bank',
  en: 'Lien Bank Management',
  bn: 'লিয়েন ব্যাংক ব্যবস্থাপনা',
  icon: 'account_balance',
  children: [
  { id: 'lien-bank-portal', en: 'Lien Bank Portal', bn: 'লিয়েন ব্যাংক পোর্টাল', icon: 'account_balance_wallet' },
  { id: 'lien-bank-change', en: 'Lien Bank Change', bn: 'লিয়েন ব্যাংক পরিবর্তন', icon: 'swap_horizontal_circle' }]

},
{ id: 'annual-audit', en: 'Annual Audit', bn: 'বার্ষিক নিরীক্ষা', icon: 'fact_check' },
{
  id: 'ud-management',
  en: 'UD Management',
  bn: 'ইউডি ব্যবস্থাপনা',
  icon: 'sync',
  children: [
  { id: 'ud-integration', en: 'UD Integration', bn: 'ইউডি ইন্টিগ্রেশন', icon: 'cloud_sync' },
  { id: 'ud-recreation', en: 'UD Re-creation', bn: 'ইউডি পুনঃনির্মাণ', icon: 'restore_page' },
  { id: 'ud-summary', en: 'UD Summary', bn: 'ইউডি সারসংক্ষেপ', icon: 'summarize' }]

},
{ id: 'entitlement', en: 'Entitlement Management', bn: 'এনটাইটেলমেন্ট ব্যবস্থাপনা', icon: 'pie_chart' },
{ id: 'coefficient', en: 'Co-efficient Management', bn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা', icon: 'functions' },
{ id: 'utilization-permission', en: 'Utilization Permission (UP)', bn: 'ইউটিলাইজেশন পারমিশন (ইউপি)', icon: 'verified_user' },
{ id: 'inventory-monitoring', en: 'Inventory Monitoring', bn: 'ইনভেন্টরি মনিটরিং', icon: 'monitoring' },
{
  id: 'legal-management',
  en: 'Legal Management',
  bn: 'আইনি ব্যবস্থাপনা',
  icon: 'balance',
  children: [
  { id: 'legal-procedures', en: 'Legal Procedures', bn: 'আইনি প্রক্রিয়া', icon: 'policy' },
  { id: 'case-information', en: 'Case Information', bn: 'মামলার তথ্য', icon: 'folder_special' }]

},
{ id: 'inter-bond-transfer', en: 'Inter Bond Transfer', bn: 'ইন্টার বন্ড ট্রান্সফার', icon: 'compare_arrows' },
{ id: 'sub-contract', en: 'Sub Contract Management', bn: 'সাব কন্ট্রাক্ট ব্যবস্থাপনা', icon: 'handshake' },
{ id: 'e-nothi', en: 'e-Nothi Management', bn: 'ই-নথি ব্যবস্থাপনা', icon: 'history_edu' },
{ id: 'reports', en: 'Reports', bn: 'প্রতিবেদন', icon: 'bar_chart' },
{ id: 'business-intelligence', en: 'Business Intelligence', bn: 'বিজনেস ইন্টেলিজেন্স', icon: 'insights' },
{ id: 'notification-center', en: 'Notification Center', bn: 'নোটিফিকেশন সেন্টার', icon: 'notifications_active' },
{
  id: 'system-admin',
  en: 'System Administration',
  bn: 'সিস্টেম প্রশাসন',
  icon: 'admin_panel_settings',
  children: [
  { id: 'user-management', en: 'User Management', bn: 'ব্যবহারকারী ব্যবস্থাপনা', icon: 'group' },
  { id: 'role-management', en: 'Role Management', bn: 'রোল ব্যবস্থাপনা', icon: 'shield_person' },
  { id: 'workflow-management', en: 'Workflow Management', bn: 'ওয়ার্কফ্লো ব্যবস্থাপনা', icon: 'account_tree' },
  { id: 'business-rules', en: 'Business Rules', bn: 'বিজনেস রুলস', icon: 'rule' },
  { id: 'integration-monitoring', en: 'Integration Monitoring', bn: 'ইন্টিগ্রেশন মনিটরিং', icon: 'cable' },
  { id: 'message-queue', en: 'Message Queue', bn: 'মেসেজ কিউ', icon: 'queue' },
  { id: 'push-notification', en: 'Push Notification', bn: 'পুশ নোটিফিকেশন', icon: 'send' },
  { id: 'audit-logs', en: 'Audit Logs', bn: 'অডিট লগ', icon: 'history' },
  { id: 'configuration', en: 'Configuration', bn: 'কনফিগারেশন', icon: 'settings' }]

}];


export function findNavPath(tree: NavItem[], id: string, trail: NavItem[] = []): NavItem[] | null {
  for (const item of tree) {
    const nextTrail = [...trail, item];
    if (item.id === id) return nextTrail;
    if (item.children) {
      const found = findNavPath(item.children, id, nextTrail);
      if (found) return found;
    }
  }
  return null;
}