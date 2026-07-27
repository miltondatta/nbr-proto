import { useMemo, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DashboardHome } from './DashboardHome';
import { ELicenseeProfileCreation } from './ELicenseeProfileCreation';
import { EServiceList } from './EServiceList';
import { PortalContents } from './PortalContents';
import { RulesPolicies } from './RulesPolicies';
import { Checklists } from './Checklists';
import { KnowledgeBase } from './KnowledgeBase';
import { Notices } from './Notices';
import { DiscussionForum } from './DiscussionForum';
import { NewBondLicense } from './NewBondLicense';
import { LicenseOwnershipChange } from './LicenseOwnershipChange';
import { CompanyNameChange } from './CompanyNameChange';
import { LicenseDatabase } from './LicenseDatabase';
import { LicenseSearch } from './LicenseSearch';
import { GeneralBondManagement } from './GeneralBondManagement';
import { EPassbook } from './EPassbook';
import { EBondRegister } from './EBondRegister';
import { LocalPurchaseSales } from './LocalPurchaseSales';
import { ExBondEntry } from './ExBondEntry';
import { OnlineApplicationForm } from './OnlineApplicationForm';
import { SubmissionGuidelines } from './SubmissionGuidelines';
import { ENothiManagement } from './ENothiManagement';
import { HsCodeManagement } from './HsCodeManagement';
import { MachineryDatabase } from './MachineryDatabase';
import { MachineryTransactions } from './MachineryTransactions';
import { LienBankPortal } from './LienBankPortal';
import { LienBankChange } from './LienBankChange';
import { AnnualAudit } from './AnnualAudit';
import { UDIntegration } from './UDIntegration';
import { UDRecreation } from './UDRecreation';
import { UDSummary } from './UDSummary';
import { Entitlement } from './Entitlement';
import { CoefficientManagement } from './CoefficientManagement';
import { UtilizationPermission } from './UtilizationPermission';
import { InventoryMonitoring } from './InventoryMonitoring';
import { LegalProcedures } from './LegalProcedures';
import { CaseInformation } from './CaseInformation';
import { InterBondTransfer } from './InterBondTransfer';
import { SubContractManagement } from './SubContractManagement';
import { Reports } from './Reports';
import { BusinessIntelligence } from './BusinessIntelligence';
import { NotificationCenter } from './NotificationCenter';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { WorkflowManagement } from './WorkflowManagement';
import { BusinessRules } from './BusinessRules';
import { IntegrationMonitoring } from './IntegrationMonitoring';
import { MessageQueue } from './MessageQueue';
import { PushNotification } from './PushNotification';
import { AuditLogs } from './AuditLogs';
import { Configuration } from './Configuration';
import { findNavPath, navigationTree } from './navigationData';
type Language = 'en' | 'bn';
function Icon({
  name,
  className = ''
}: {
  name: string;
  className?: string;
}) {
  return <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>;
}
const placeholderText = {
  en: {
    home: 'Home',
    backToDashboard: 'Back to Dashboard',
    title: 'Module in development',
    body: 'This module’s screens have not been designed yet. This prototype currently covers only the application shell — the top header, the navigation sidebar, and this welcome dashboard.'
  },
  bn: {
    home: 'হোম',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    title: 'মডিউলটি নির্মাণাধীন',
    body: 'এই মডিউলের স্ক্রিনগুলো এখনও ডিজাইন করা হয়নি। এই প্রোটোটাইপে বর্তমানে শুধুমাত্র অ্যাপ্লিকেশন শেল — টপ হেডার, নেভিগেশন সাইডবার এবং এই স্বাগতম ড্যাশবোর্ড — অন্তর্ভুক্ত রয়েছে।'
  }
};
function ModulePlaceholder({
  language,
  pathLabels,
  onBack
}: {
  language: Language;
  pathLabels: string[];
  onBack: () => void;
}) {
  const t = placeholderText[language];
  return <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        {pathLabels.map((label, i) => <span key={i} className="flex items-center gap-1.5">
            <Icon name="chevron_right" className="text-[16px]" />
            <span className={i === pathLabels.length - 1 ? 'font-semibold text-[#0A4D8C]' : ''}>{label}</span>
          </span>)}
      </nav>

      <h1 className="text-2xl font-bold text-[#1E293B]">{pathLabels[pathLabels.length - 1]}</h1>

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-20 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
          <Icon name="construction" className="text-[32px]" />
        </span>
        <h2 className="text-base font-bold text-[#1E293B]">{t.title}</h2>
        <p className="max-w-md text-sm leading-relaxed text-[#64748B]">{t.body}</p>
        <button type="button" onClick={onBack} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71]">
          
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>
    </div>;
}
export const CBMSApplicationShell = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeId, setActiveId] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const path = useMemo(() => findNavPath(navigationTree, activeId), [activeId]);
  return <div className="flex h-screen w-full min-w-[1024px] flex-col overflow-hidden bg-[#F5F7FA] text-[#1E293B]">
      <Header language={language} onLanguageChange={setLanguage} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
      
      <div className="flex min-h-0 flex-1">
        <Sidebar language={language} collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed(c => !c)} activeId={activeId} onSelect={setActiveId} />
        
        <main className="min-w-0 flex-1 overflow-y-auto">
          {activeId === 'dashboard' ? <DashboardHome language={language} onSelect={setActiveId} /> : activeId === 'e-licensee-profile-creation' ? <ELicenseeProfileCreation language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'e-service-list' ? <EServiceList language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'portal-contents' ? <PortalContents language={language} onDone={() => setActiveId('dashboard')} onSelect={setActiveId} /> : activeId === 'rules-policies' ? <RulesPolicies language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'checklists' ? <Checklists language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'knowledge-base' ? <KnowledgeBase language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'notices' ? <Notices language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'discussion-forum' ? <DiscussionForum language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'new-bond-license' ? <NewBondLicense language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'license-ownership-change' ? <LicenseOwnershipChange language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'company-name-change' ? <CompanyNameChange language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'license-database' ? <LicenseDatabase language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'license-search' ? <LicenseSearch language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'general-bond' ? <GeneralBondManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'e-passbook' ? <EPassbook language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'e-bond-register' ? <EBondRegister language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'local-purchase-sales' ? <LocalPurchaseSales language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'ex-bond-entry' ? <ExBondEntry language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'online-application-form' ? <OnlineApplicationForm language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'submission-guidelines' ? <SubmissionGuidelines language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'e-nothi' ? <ENothiManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'hs-code' ? <HsCodeManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'machinery-database' ? <MachineryDatabase language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'machinery-purchase' ? <MachineryTransactions language={language} onDone={() => setActiveId('dashboard')} transactionType="purchase" /> : activeId === 'machinery-sale' ? <MachineryTransactions language={language} onDone={() => setActiveId('dashboard')} transactionType="sale" /> : activeId === 'machinery-decommission' ? <MachineryTransactions language={language} onDone={() => setActiveId('dashboard')} transactionType="decommission" /> : activeId === 'lien-bank-portal' ? <LienBankPortal language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'lien-bank-change' ? <LienBankChange language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'annual-audit' ? <AnnualAudit language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'ud-integration' ? <UDIntegration language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'ud-recreation' ? <UDRecreation language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'ud-summary' ? <UDSummary language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'entitlement' ? <Entitlement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'coefficient' ? <CoefficientManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'utilization-permission' ? <UtilizationPermission language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'inventory-monitoring' ? <InventoryMonitoring language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'legal-procedures' ? <LegalProcedures language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'case-information' ? <CaseInformation language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'inter-bond-transfer' ? <InterBondTransfer language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'sub-contract' ? <SubContractManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'reports' ? <Reports language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'business-intelligence' ? <BusinessIntelligence language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'notification-center' ? <NotificationCenter language={language} onDone={() => setActiveId('dashboard')} onNavigate={setActiveId} /> : activeId === 'user-management' ? <UserManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'role-management' ? <RoleManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'workflow-management' ? <WorkflowManagement language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'business-rules' ? <BusinessRules language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'integration-monitoring' ? <IntegrationMonitoring language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'message-queue' ? <MessageQueue language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'push-notification' ? <PushNotification language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'audit-logs' ? <AuditLogs language={language} onDone={() => setActiveId('dashboard')} /> : activeId === 'configuration' ? <Configuration language={language} onDone={() => setActiveId('dashboard')} /> : <ModulePlaceholder language={language} pathLabels={(path ?? []).map(item => item[language])} onBack={() => setActiveId('dashboard')} />}
        </main>
      </div>
    </div>;
};