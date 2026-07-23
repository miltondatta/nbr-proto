import { useState, useRef } from 'react';
import { NavItem, navigationTree } from './navigationData';
type Language = 'en' | 'bn';
interface SidebarProps {
  language: Language;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeId: string;
  onSelect: (id: string) => void;
  navigableParentIds?: string[];
}

const DEFAULT_NAVIGABLE_PARENT_IDS: string[] = ['e-bond-register'];
const T = {
  en: {
    menu: 'Main Menu',
    collapse: 'Collapse menu',
    expand: 'Expand menu'
  },
  bn: {
    menu: 'প্রধান মেনু',
    collapse: 'মেনু সংকুচিত করুন',
    expand: 'মেনু প্রসারিত করুন'
  }
};
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
interface RowProps {
  item: NavItem;
  level: number;
  language: Language;
  activeId: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string) => void;
  navigableParentIds: string[];
}
function isAncestorActive(item: NavItem, activeId: string): boolean {
  if (item.id === activeId) return true;
  if (item.children) return item.children.some(c => isAncestorActive(c, activeId));
  return false;
}
function NavRow({
  item,
  level,
  language,
  activeId,
  expandedIds,
  onToggleExpand,
  onSelect,
  navigableParentIds
}: RowProps) {
  const hasChildren = !!item.children?.length;
  const isOpen = expandedIds.has(item.id);
  const isActive = activeId === item.id;
  const isOpenAncestor = hasChildren && isAncestorActive(item, activeId) && !isActive;
  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand(item.id);
      if (navigableParentIds.includes(item.id)) onSelect(item.id);
    } else {
      onSelect(item.id);
    }
  };
  return <div>
      <button type="button" onClick={handleClick} aria-expanded={hasChildren ? isOpen : undefined} aria-current={isActive ? 'page' : undefined} className={['group relative flex w-full items-start gap-3 rounded-lg py-2.5 text-left text-sm transition-colors duration-150 outline-none', 'focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06325C]', level === 0 ? 'px-3' : 'pr-3', isActive ? 'bg-white/12 text-white font-semibold' : isOpenAncestor ? 'text-white/95 font-medium hover:bg-white/8' : 'text-[#B9CFE6] hover:bg-white/8 hover:text-white'].join(' ')} style={level > 0 ? {
      paddingLeft: `${12 + level * 20}px`
    } : undefined}>

        {isActive && <span className="absolute left-0 top-1/2 h-5 -translate-y-1/2 w-[3px] rounded-r-full bg-[#00A86B]" />}
        {level === 0 && <Icon name={item.icon} className={`mt-0.5 text-[20px] shrink-0 ${isActive ? 'text-[#00D68F]' : 'text-[#8FB2D9] group-hover:text-white'}`} />}
        {level > 0 && <span className={`mt-2 shrink-0 h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#00D68F]' : 'bg-[#5C84AC] group-hover:bg-[#B9CFE6]'}`} />}
        <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">{item[language]}</span>
        {hasChildren && <Icon name="chevron_right" className={`mt-0.5 text-[18px] shrink-0 text-[#8FB2D9] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />}
      </button>

      {hasChildren && <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{
      gridTemplateRows: isOpen ? '1fr' : '0fr'
    }}>
        
          <div className="overflow-hidden">
            <div className="mt-0.5 flex flex-col gap-0.5 pb-1">
              {item.children!.map(child => <NavRow key={child.id} item={child} level={level + 1} language={language} activeId={activeId} expandedIds={expandedIds} onToggleExpand={onToggleExpand} onSelect={onSelect} navigableParentIds={navigableParentIds} />)}
            </div>
          </div>
        </div>}
    </div>;
}
function CollapsedFlyoutRow({
  item,
  language,
  activeId,
  onSelect,
  navigableParentIds
}: {
  item: NavItem;
  language: Language;
  activeId: string;
  onSelect: (id: string) => void;
  navigableParentIds: string[];
}) {
  const hasChildren = !!item.children?.length;
  const isNavigable = !hasChildren || navigableParentIds.includes(item.id);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const isActive = isAncestorActive(item, activeId);
  return <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button type="button" onClick={() => isNavigable && onSelect(item.id)} aria-current={isActive ? 'page' : undefined} className={['relative mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-150 outline-none', 'focus-visible:ring-2 focus-visible:ring-[#1E88E5]', isActive ? 'bg-white/12 text-[#00D68F]' : 'text-[#8FB2D9] hover:bg-white/8 hover:text-white'].join(' ')}>
        
        {isActive && <span className="absolute left-0 top-1/2 h-5 -translate-y-1/2 w-[3px] rounded-r-full bg-[#00A86B]" />}
        <Icon name={item.icon} className="text-[22px]" />
      </button>

      {open && <div className="absolute left-full top-0 z-50 ml-2 min-w-[240px] rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-xl" role="menu">
        
          <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            {item[language]}
          </div>
          {hasChildren ? <div className="flex flex-col gap-0.5">
              {item.children!.map(child => <button key={child.id} type="button" role="menuitem" onClick={() => {
          onSelect(child.id);
          setOpen(false);
        }} className={['flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors', activeId === child.id ? 'bg-[#EAF3FE] text-[#0A4D8C] font-semibold' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>

                  <Icon name={child.icon} className="mt-0.5 text-[18px] shrink-0 text-[#0A4D8C]" />
                  <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">{child[language]}</span>
                </button>)}
            </div> : <button type="button" role="menuitem" onClick={() => {
        onSelect(item.id);
        setOpen(false);
      }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-[#334155] hover:bg-[#F5F7FA]">
          
              {language === 'en' ? 'Open' : 'খুলুন'}
            </button>}
        </div>}
    </div>;
}
export function Sidebar({
  language,
  collapsed,
  onToggleCollapsed,
  activeId,
  onSelect,
  navigableParentIds = DEFAULT_NAVIGABLE_PARENT_IDS
}: SidebarProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const path = navigationTree.find(i => i.children?.some(c => c.id === activeId));
    if (path) initial.add(path.id);
    return initial;
  });
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  return <aside className={['relative flex h-full flex-col bg-[#06325C] transition-[width] duration-200 ease-out', collapsed ? 'w-[72px]' : 'w-[280px]'].join(' ')} aria-label={language === 'en' ? 'Main navigation' : 'প্রধান নেভিগেশন'}>
      
      <nav className={['flex-1 overflow-y-auto overflow-x-hidden py-3', 'scrollbar-thin', collapsed ? 'px-2' : 'px-3'].join(' ')}>
        
        {!collapsed && <div className="mb-1 px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5C84AC]">
            {T[language].menu}
          </div>}
        <div className={collapsed ? 'flex flex-col gap-1' : 'flex flex-col gap-0.5'}>
          {navigationTree.map(item => collapsed ? <CollapsedFlyoutRow key={item.id} item={item} language={language} activeId={activeId} onSelect={onSelect} navigableParentIds={navigableParentIds} /> : <NavRow key={item.id} item={item} level={0} language={language} activeId={activeId} expandedIds={expandedIds} onToggleExpand={toggleExpand} onSelect={onSelect} navigableParentIds={navigableParentIds} />)}
        </div>
      </nav>

      <div className="border-t border-white/10 p-2">
        <button type="button" onClick={onToggleCollapsed} title={collapsed ? T[language].expand : T[language].collapse} className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[#8FB2D9] transition-colors hover:bg-white/8 hover:text-white">
          
          <Icon name={collapsed ? 'left_panel_open' : 'left_panel_close'} className="text-[20px]" />
          {!collapsed && <span className="text-sm font-medium">{T[language].collapse}</span>}
        </button>
      </div>
    </aside>;
}