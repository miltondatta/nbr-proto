import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type ThreadStatus = 'open' | 'answered' | 'locked';

interface DiscussionForumProps {
  language: Language;
  onDone: () => void;
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

const T = {
  en: {
    home: 'Home',
    cbcPortal: 'CBC Portal',
    pageTitle: 'Discussion Forum',
    subtitle: 'Community discussion space for bond licensees to ask questions and get guidance from CBC officials and fellow bonders.',
    backToDashboard: 'Back to Dashboard',
    backToForum: 'Back to Forum',
    moderate: 'Moderate',
    startDiscussion: 'Start New Discussion',
    searchPlaceholder: 'Search discussions…',
    all: 'All Topics',
    noResultsTitle: 'No discussions found',
    noResultsBody: 'Try a different search term or topic filter, or start a new discussion.',
    replies: 'replies',
    views: 'views',
    lastActivity: 'Last activity',
    status: { open: 'Open', answered: 'Answered', locked: 'Locked' },
    cbcOfficial: 'CBC Official',
    reply: 'Post Reply',
    replyPlaceholder: 'Write your reply…',
    lockThread: 'Lock Thread',
    unlockThread: 'Unlock Thread',
    deleteThread: 'Delete Thread',
    pinThread: 'Pin',
    unpinThread: 'Unpin',
    pinned: 'Pinned',
    threadLocked: 'This thread has been locked by a moderator. No further replies can be posted.',
    composeTitle: 'Start New Discussion',
    topic: 'Topic',
    discussionTitle: 'Discussion Title',
    message: 'Your Message',
    cancel: 'Cancel',
    post: 'Post Discussion',
    confirmDeleteTitle: 'Delete this discussion?',
    confirmDeleteBody: 'This will permanently remove the thread and all its replies.',
    confirmDeleteAction: 'Delete Thread',
    postedBy: 'Posted by',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'আলোচনা ফোরাম',
    subtitle: 'বন্ড লাইসেন্সিদের জন্য প্রশ্ন জিজ্ঞাসা এবং সিবিসি কর্মকর্তা ও সহযোগী বন্ডকারীদের কাছ থেকে দিকনির্দেশনা পাওয়ার আলোচনা স্থান।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    backToForum: 'ফোরামে ফিরে যান',
    moderate: 'মডারেশন',
    startDiscussion: 'নতুন আলোচনা শুরু করুন',
    searchPlaceholder: 'আলোচনা অনুসন্ধান করুন…',
    all: 'সকল বিষয়',
    noResultsTitle: 'কোনো আলোচনা পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা বিষয় ফিল্টার ব্যবহার করুন, অথবা নতুন আলোচনা শুরু করুন।',
    replies: 'টি উত্তর',
    views: 'বার দেখা হয়েছে',
    lastActivity: 'সর্বশেষ কার্যক্রম',
    status: { open: 'খোলা', answered: 'উত্তরিত', locked: 'লক করা' },
    cbcOfficial: 'সিবিসি কর্মকর্তা',
    reply: 'উত্তর পোস্ট করুন',
    replyPlaceholder: 'আপনার উত্তর লিখুন…',
    lockThread: 'থ্রেড লক করুন',
    unlockThread: 'থ্রেড আনলক করুন',
    deleteThread: 'থ্রেড মুছুন',
    pinThread: 'পিন করুন',
    unpinThread: 'আনপিন করুন',
    pinned: 'পিন করা',
    threadLocked: 'এই থ্রেডটি একজন মডারেটর কর্তৃক লক করা হয়েছে। আর কোনো উত্তর পোস্ট করা যাবে না।',
    composeTitle: 'নতুন আলোচনা শুরু করুন',
    topic: 'বিষয়',
    discussionTitle: 'আলোচনার শিরোনাম',
    message: 'আপনার বার্তা',
    cancel: 'বাতিল',
    post: 'আলোচনা পোস্ট করুন',
    confirmDeleteTitle: 'এই আলোচনাটি মুছবেন?',
    confirmDeleteBody: 'এটি থ্রেড এবং এর সকল উত্তর স্থায়ীভাবে সরিয়ে দেবে।',
    confirmDeleteAction: 'থ্রেড মুছুন',
    postedBy: 'পোস্ট করেছেন',
  },
};

interface Topic {
  id: string;
  en: string;
  bn: string;
  icon: string;
  color: string;
}

const topics: Topic[] = [
  { id: 'licensing', en: 'Bond Licensing', bn: 'বন্ড লাইসেন্সিং', icon: 'assignment', color: '#0A4D8C' },
  { id: 'passbook-ud', en: 'e-Passbook & UD', bn: 'ই-পাসবুক ও ইউডি', icon: 'import_contacts', color: '#00A86B' },
  { id: 'machinery', en: 'Machinery', bn: 'যন্ত্রপাতি', icon: 'precision_manufacturing', color: '#B45309' },
  { id: 'audit', en: 'Audit & Compliance', bn: 'নিরীক্ষা ও সম্মতি', icon: 'fact_check', color: '#B91C1C' },
  { id: 'lien-bank', en: 'Lien Bank', bn: 'লিয়েন ব্যাংক', icon: 'account_balance', color: '#1E88E5' },
  { id: 'utilization', en: 'Utilization & Entitlement', bn: 'ব্যবহার ও এনটাইটেলমেন্ট', icon: 'verified_user', color: '#6D28D9' },
  { id: 'general', en: 'General', bn: 'সাধারণ', icon: 'forum', color: '#475569' },
];

function topicOf(id: string) {
  return topics.find((t) => t.id === id) ?? topics[topics.length - 1];
}

interface Reply {
  id: string;
  author: string;
  org: string;
  isOfficial: boolean;
  time: { en: string; bn: string };
  message: { en: string; bn: string };
}

interface Thread {
  id: string;
  topicId: string;
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  author: string;
  org: string;
  isOfficial: boolean;
  status: ThreadStatus;
  pinned: boolean;
  views: number;
  lastActivity: { en: string; bn: string };
  replies: Reply[];
}

const initialThreads: Thread[] = [
  {
    id: 't1',
    topicId: 'licensing',
    titleEn: 'Delay in factory inspection scheduling for new bond license',
    titleBn: 'নতুন বন্ড লাইসেন্সের জন্য কারখানা পরিদর্শনের সময়সূচি বিলম্ব',
    messageEn: 'We submitted our new bond license application 3 weeks ago and it is still pending inspection scheduling. Is there a way to check the current queue position?',
    messageBn: 'আমরা ৩ সপ্তাহ আগে আমাদের নতুন বন্ড লাইসেন্স আবেদন জমা দিয়েছি এবং এখনও পরিদর্শনের সময়সূচি অপেক্ষমাণ। বর্তমান সারির অবস্থান জানার কোনো উপায় আছে কি?',
    author: 'Tanvir Ahmed',
    org: 'Radiant Apparels Ltd.',
    isOfficial: false,
    status: 'answered',
    pinned: true,
    views: 412,
    lastActivity: { en: '2 hours ago', bn: '২ ঘণ্টা আগে' },
    replies: [
      {
        id: 't1-r1',
        author: 'Md. Abdul Karim',
        org: 'Deputy Commissioner, CBC Dhaka',
        isOfficial: true,
        time: { en: '1 hour ago', bn: '১ ঘণ্টা আগে' },
        message: {
          en: 'You can check the live inspection queue position from your License Database entry once the application status shows "Inspection Assigned". Current average wait is 8–10 working days.',
          bn: 'আবেদনের অবস্থা "পরিদর্শন নির্ধারিত" দেখালে আপনি আপনার লাইসেন্স ডেটাবেজ এন্ট্রি থেকে লাইভ পরিদর্শন সারির অবস্থান দেখতে পারবেন। বর্তমান গড় অপেক্ষার সময় ৮–১০ কার্যদিবস।',
        },
      },
    ],
  },
  {
    id: 't2',
    topicId: 'passbook-ud',
    titleEn: 'How to correct a wrong HS Code entry synced from ASYCUDA?',
    titleBn: 'ASYCUDA থেকে সিঙ্ক হওয়া ভুল এইচএস কোড এন্ট্রি কীভাবে সংশোধন করব?',
    messageEn: 'One of our import entries shows the wrong HS Code in the e-Passbook. We already fixed it in ASYCUDA World but it still shows old data here.',
    messageBn: 'আমাদের একটি আমদানি এন্ট্রিতে ই-পাসবুকে ভুল এইচএস কোড দেখাচ্ছে। আমরা ইতিমধ্যে ASYCUDA World-এ ঠিক করেছি কিন্তু এখানে এখনও পুরনো তথ্য দেখাচ্ছে।',
    author: 'Nasrin Sultana',
    org: 'Epic Designers Ltd.',
    isOfficial: false,
    status: 'open',
    pinned: false,
    views: 268,
    lastActivity: { en: '5 hours ago', bn: '৫ ঘণ্টা আগে' },
    replies: [
      {
        id: 't2-r1',
        author: 'Rashed Molla',
        org: 'Pacific Jeans Ltd.',
        isOfficial: false,
        time: { en: '3 hours ago', bn: '৩ ঘণ্টা আগে' },
        message: {
          en: 'We had the same issue last month — it took about 24 hours for the corrected entry to sync over from ASYCUDA. Might just need a bit more time.',
          bn: 'গত মাসে আমাদেরও একই সমস্যা হয়েছিল — সংশোধিত এন্ট্রি ASYCUDA থেকে সিঙ্ক হতে প্রায় ২৪ ঘণ্টা সময় লেগেছিল। হয়তো আরেকটু সময় লাগবে।',
        },
      },
    ],
  },
  {
    id: 't3',
    topicId: 'machinery',
    titleEn: 'Machinery decommissioning: what happens to unused duty exemption?',
    titleBn: 'যন্ত্রপাতি অবলুপ্তকরণ: অব্যবহৃত শুল্ক অব্যাহতির কী হবে?',
    messageEn: 'If we decommission a machine before it reaches end of useful life, does the remaining duty-exemption value need to be repaid?',
    messageBn: 'একটি যন্ত্র তার কার্যকর জীবনকাল শেষ হওয়ার আগে অবলুপ্ত করলে, অবশিষ্ট শুল্ক-অব্যাহতির মূল্য কি ফেরত দিতে হবে?',
    author: 'Kamrul Hasan',
    org: 'Fakir Fashion Ltd.',
    isOfficial: false,
    status: 'open',
    pinned: false,
    views: 154,
    lastActivity: { en: '1 day ago', bn: '১ দিন আগে' },
    replies: [],
  },
  {
    id: 't4',
    topicId: 'audit',
    titleEn: 'Annual audit rescheduled without notice — how to request a new date?',
    titleBn: 'পূর্ব বিজ্ঞপ্তি ছাড়াই বার্ষিক নিরীক্ষা পুনঃনির্ধারিত — নতুন তারিখের জন্য কীভাবে অনুরোধ করব?',
    messageEn: 'Our scheduled audit date was moved without notification in the system. What is the process to request an alternate date?',
    messageBn: 'আমাদের নির্ধারিত নিরীক্ষার তারিখ সিস্টেমে কোনো বিজ্ঞপ্তি ছাড়াই পরিবর্তিত হয়েছে। বিকল্প তারিখের জন্য অনুরোধ করার প্রক্রিয়া কী?',
    author: 'Shirin Akter',
    org: 'Pacific Jeans Ltd.',
    isOfficial: false,
    status: 'answered',
    pinned: false,
    views: 301,
    lastActivity: { en: '1 day ago', bn: '১ দিন আগে' },
    replies: [
      {
        id: 't4-r1',
        author: 'Md. Abdul Karim',
        org: 'Deputy Commissioner, CBC Dhaka',
        isOfficial: true,
        time: { en: '20 hours ago', bn: '২০ ঘণ্টা আগে' },
        message: {
          en: 'Please raise a reschedule request from the Annual Audit module with your preferred date range — the audit team will confirm within 3 working days.',
          bn: 'অনুগ্রহ করে বার্ষিক নিরীক্ষা মডিউল থেকে আপনার পছন্দের তারিখ পরিসীমাসহ একটি পুনঃনির্ধারণ অনুরোধ করুন — নিরীক্ষা দল ৩ কার্যদিবসের মধ্যে নিশ্চিত করবে।',
        },
      },
    ],
  },
  {
    id: 't5',
    topicId: 'lien-bank',
    titleEn: "Adding a second lien bank — is the prior bank's NOC required?",
    titleBn: 'দ্বিতীয় লিয়েন ব্যাংক যোগ করা — পূর্ববর্তী ব্যাংকের এনওসি কি প্রয়োজন?',
    messageEn: 'We want to add a second lien bank alongside our current one. Do we need a No Objection Certificate from the existing lien bank first?',
    messageBn: 'আমরা আমাদের বর্তমান ব্যাংকের পাশাপাশি একটি দ্বিতীয় লিয়েন ব্যাংক যোগ করতে চাই। প্রথমে বিদ্যমান লিয়েন ব্যাংক থেকে একটি অনাপত্তি পত্র প্রয়োজন কি?',
    author: 'Rezaul Karim',
    org: 'Envoy Textiles Ltd.',
    isOfficial: false,
    status: 'open',
    pinned: false,
    views: 97,
    lastActivity: { en: '2 days ago', bn: '২ দিন আগে' },
    replies: [],
  },
  {
    id: 't6',
    topicId: 'general',
    titleEn: 'CBMS mobile app not syncing offline entries',
    titleBn: 'সিবিএমএস মোবাইল অ্যাপ অফলাইন এন্ট্রি সিঙ্ক করছে না',
    messageEn: 'Entries made offline in the Android app three days ago still show a "pending sync" status even with a stable connection now.',
    messageBn: 'তিন দিন আগে অ্যান্ড্রয়েড অ্যাপে অফলাইনে করা এন্ট্রিগুলো এখন স্থিতিশীল সংযোগ থাকা সত্ত্বেও এখনও "সিঙ্ক অপেক্ষমাণ" অবস্থা দেখাচ্ছে।',
    author: 'Farhana Yasmin',
    org: 'DBL Group',
    isOfficial: false,
    status: 'answered',
    pinned: false,
    views: 589,
    lastActivity: { en: '2 days ago', bn: '২ দিন আগে' },
    replies: [
      {
        id: 't6-r1',
        author: 'System Support',
        org: 'CBMS Technical Team',
        isOfficial: true,
        time: { en: '1 day ago', bn: '১ দিন আগে' },
        message: {
          en: 'This was a known sync-queue issue affecting app version 2.3.1 and has been resolved in version 2.3.2. Please update the app from your device store and the pending entries will sync automatically.',
          bn: 'এটি অ্যাপ ভার্সন ২.৩.১-কে প্রভাবিত করা একটি পরিচিত সিঙ্ক-কিউ সমস্যা ছিল এবং ২.৩.২ সংস্করণে সমাধান করা হয়েছে। অনুগ্রহ করে ডিভাইস স্টোর থেকে অ্যাপ হালনাগাদ করুন, অপেক্ষমাণ এন্ট্রিগুলো স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।',
        },
      },
    ],
  },
  {
    id: 't7',
    topicId: 'utilization',
    titleEn: 'Utilization Permission rejected — reference to Co-efficient version',
    titleBn: 'ইউটিলাইজেশন পারমিশন প্রত্যাখ্যাত — কো-এফিসিয়েন্ট ভার্সনের রেফারেন্স',
    messageEn: 'Our UP application was rejected citing an outdated co-efficient reference. How do we find out which version is currently approved for our product?',
    messageBn: 'একটি পুরাতন কো-এফিসিয়েন্ট রেফারেন্সের উল্লেখ করে আমাদের ইউপি আবেদন প্রত্যাখ্যাত হয়েছে। আমাদের পণ্যের জন্য বর্তমানে কোন সংস্করণ অনুমোদিত তা কীভাবে জানব?',
    author: 'Mahfuz Rahman',
    org: 'Ha-Meem Group',
    isOfficial: false,
    status: 'locked',
    pinned: false,
    views: 176,
    lastActivity: { en: '3 days ago', bn: '৩ দিন আগে' },
    replies: [
      {
        id: 't7-r1',
        author: 'Md. Abdul Karim',
        org: 'Deputy Commissioner, CBC Dhaka',
        isOfficial: true,
        time: { en: '3 days ago', bn: '৩ দিন আগে' },
        message: {
          en: 'The current approved co-efficient version for each product is visible under Co-efficient Management → Product History. This thread is now locked as the query is resolved; please open a new discussion for follow-up questions.',
          bn: 'প্রতিটি পণ্যের বর্তমান অনুমোদিত কো-এফিসিয়েন্ট সংস্করণ কো-এফিসিয়েন্ট ব্যবস্থাপনা → প্রোডাক্ট হিস্টোরি-তে দেখা যাবে। প্রশ্নটি সমাধান হওয়ায় এই থ্রেডটি এখন লক করা হলো; পরবর্তী প্রশ্নের জন্য অনুগ্রহ করে নতুন আলোচনা শুরু করুন।',
        },
      },
    ],
  },
  {
    id: 't8',
    topicId: 'general',
    titleEn: 'Sub-contract manufacturing between two bonded factories — required documents?',
    titleBn: 'দুটি বন্ডেড কারখানার মধ্যে সাব-কন্ট্রাক্ট উৎপাদন — প্রয়োজনীয় নথি কী?',
    messageEn: 'What documents are needed to register a sub-contract manufacturing arrangement where both factories are bonded organizations?',
    messageBn: 'উভয় কারখানা বন্ডেড প্রতিষ্ঠান হলে সাব-কন্ট্রাক্ট উৎপাদন ব্যবস্থা নিবন্ধনের জন্য কী কী নথি প্রয়োজন?',
    author: 'Jannatul Ferdous',
    org: 'Square Fashions Ltd.',
    isOfficial: false,
    status: 'answered',
    pinned: false,
    views: 223,
    lastActivity: { en: '4 days ago', bn: '৪ দিন আগে' },
    replies: [
      {
        id: 't8-r1',
        author: 'Md. Abdul Karim',
        org: 'Deputy Commissioner, CBC Dhaka',
        isOfficial: true,
        time: { en: '4 days ago', bn: '৪ দিন আগে' },
        message: {
          en: 'You will need both bond licence copies, a signed sub-contract agreement, and an undertaking on material movement traceability. Submit these through the Sub Contract Management service.',
          bn: 'আপনার উভয় বন্ড লাইসেন্সের কপি, স্বাক্ষরিত সাব-কন্ট্রাক্ট চুক্তি এবং মালামাল চলাচলের ট্রেসেবিলিটি সংক্রান্ত অঙ্গীকারনামা প্রয়োজন হবে। এগুলো সাব কন্ট্রাক্ট ব্যবস্থাপনা সেবার মাধ্যমে জমা দিন।',
        },
      },
    ],
  },
];

const statusStyles: Record<ThreadStatus, string> = {
  open: 'bg-blue-50 text-[#0A4D8C]',
  answered: 'bg-emerald-50 text-emerald-700',
  locked: 'bg-[#F1F5F9] text-[#64748B]',
};

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function DiscussionForum({ language, onDone }: DiscussionForumProps) {
  const t = T[language];
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [moderate, setModerate] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeDraft, setComposeDraft] = useState({ topicId: topics[0].id, title: '', message: '' });
  const [replyDraft, setReplyDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeThread = threads.find((th) => th.id === activeThreadId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = threads.filter((th) => {
      const matchesTopic = !activeTopic || th.topicId === activeTopic;
      const matchesSearch = !q || th.titleEn.toLowerCase().includes(q) || th.titleBn.includes(q) || th.messageEn.toLowerCase().includes(q) || th.messageBn.includes(q);
      return matchesTopic && matchesSearch;
    });
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [threads, search, activeTopic]);

  const countFor = (id: string | null) => threads.filter((th) => !id || th.topicId === id).length;

  const openThread = (id: string) => {
    setActiveThreadId(id);
    setThreads((prev) => prev.map((th) => (th.id === id ? { ...th, views: th.views + 1 } : th)));
  };

  const postReply = () => {
    if (!activeThread || !replyDraft.trim()) return;
    const newReply: Reply = {
      id: `${activeThread.id}-r${Date.now()}`,
      author: 'Md. Abdul Karim',
      org: 'Deputy Commissioner, CBC Dhaka',
      isOfficial: true,
      time: { en: 'Just now', bn: 'এইমাত্র' },
      message: { en: replyDraft, bn: replyDraft },
    };
    setThreads((prev) =>
      prev.map((th) => (th.id === activeThread.id ? { ...th, replies: [...th.replies, newReply], status: 'answered', lastActivity: { en: 'Just now', bn: 'এইমাত্র' } } : th)),
    );
    setReplyDraft('');
  };

  const postDiscussion = () => {
    if (!composeDraft.title || !composeDraft.message) return;
    const id = `t-${Date.now()}`;
    const newThread: Thread = {
      id,
      topicId: composeDraft.topicId,
      titleEn: composeDraft.title,
      titleBn: composeDraft.title,
      messageEn: composeDraft.message,
      messageBn: composeDraft.message,
      author: 'Md. Abdul Karim',
      org: 'Deputy Commissioner, CBC Dhaka',
      isOfficial: true,
      status: 'open',
      pinned: false,
      views: 0,
      lastActivity: { en: 'Just now', bn: 'এইমাত্র' },
      replies: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setComposeDraft({ topicId: topics[0].id, title: '', message: '' });
    setComposeOpen(false);
    openThread(id);
  };

  const toggleLock = (id: string) =>
    setThreads((prev) => prev.map((th) => (th.id === id ? { ...th, status: th.status === 'locked' ? 'open' : 'locked' } : th)));
  const togglePin = (id: string) => setThreads((prev) => prev.map((th) => (th.id === id ? { ...th, pinned: !th.pinned } : th)));
  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((th) => th.id !== id));
    setConfirmDelete(null);
    if (activeThreadId === id) setActiveThreadId(null);
  };

  if (activeThread) {
    const topic = topicOf(activeThread.topicId);
    return (
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span>{t.cbcPortal}</span>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setActiveThreadId(null)} className="hover:text-[#0A4D8C]">
            {t.pageTitle}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="max-w-xs truncate font-semibold text-[#0A4D8C]">{activeThread[language === 'en' ? 'titleEn' : 'titleBn']}</span>
        </nav>

        <button type="button" onClick={() => setActiveThreadId(null)} className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[#0A4D8C] hover:underline">
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToForum}
        </button>

        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: `${topic.color}1A`, color: topic.color }}>
                <Icon name={topic.icon} className="text-[13px]" />
                {topic[language]}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[activeThread.status]}`}>{t.status[activeThread.status]}</span>
              {activeThread.pinned && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                  <Icon name="push_pin" className="text-[12px]" />
                  {t.pinned}
                </span>
              )}
            </div>
            {moderate && (
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => togglePin(activeThread.id)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50">
                  <Icon name="push_pin" className="text-[15px]" />
                  {activeThread.pinned ? t.unpinThread : t.pinThread}
                </button>
                <button type="button" onClick={() => toggleLock(activeThread.id)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                  <Icon name={activeThread.status === 'locked' ? 'lock_open' : 'lock'} className="text-[15px]" />
                  {activeThread.status === 'locked' ? t.unlockThread : t.lockThread}
                </button>
                <button type="button" onClick={() => setConfirmDelete(activeThread.id)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50">
                  <Icon name="delete" className="text-[15px]" />
                  {t.deleteThread}
                </button>
              </div>
            )}
          </div>

          <div className="px-5 py-5">
            <h1 className="text-xl font-bold text-[#1E293B]">{activeThread[language === 'en' ? 'titleEn' : 'titleBn']}</h1>
            <div className="mt-4 flex gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${activeThread.isOfficial ? 'bg-[#00A86B]' : 'bg-[#0A4D8C]'}`}>
                {initialsOf(activeThread.author)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold text-[#1E293B]">{activeThread.author}</span>
                  {activeThread.isOfficial && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <Icon name="verified" className="text-[11px]" />
                      {t.cbcOfficial}
                    </span>
                  )}
                  <span className="text-xs text-[#94A3B8]">· {activeThread.org}</span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-[#334155]">{activeThread[language === 'en' ? 'messageEn' : 'messageBn']}</p>
              </div>
            </div>
          </div>

          {activeThread.replies.length > 0 && (
            <div className="divide-y divide-[#F1F5F9] border-t border-[#E2E8F0]">
              {activeThread.replies.map((r) => (
                <div key={r.id} className="flex gap-3 px-5 py-4" style={r.isOfficial ? { backgroundColor: '#F0FBF6' } : undefined}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${r.isOfficial ? 'bg-[#00A86B]' : 'bg-[#64748B]'}`}>
                    {initialsOf(r.author)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-[#1E293B]">{r.author}</span>
                      {r.isOfficial && (
                        <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          <Icon name="verified" className="text-[11px]" />
                          {t.cbcOfficial}
                        </span>
                      )}
                      <span className="text-xs text-[#94A3B8]">· {r.org}</span>
                      <span className="text-xs text-[#94A3B8]">· {r.time[language]}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#334155]">{r.message[language]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#E2E8F0] px-5 py-4">
            {activeThread.status === 'locked' ? (
              <p className="flex items-center gap-2 rounded-lg bg-[#F5F7FA] px-4 py-3 text-xs font-medium text-[#64748B]">
                <Icon name="lock" className="text-[16px]" />
                {t.threadLocked}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  rows={3}
                  placeholder={t.replyPlaceholder}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="button"
                  onClick={postReply}
                  disabled={!replyDraft.trim()}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
                >
                  <Icon name="send" className="text-[16px]" />
                  {t.reply}
                </button>
              </div>
            )}
          </div>
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setConfirmDelete(null)}>
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#DC2626]">
                  <Icon name="warning" className="text-[22px]" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#1E293B]">{t.confirmDeleteTitle}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{t.confirmDeleteBody}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                  {t.cancel}
                </button>
                <button type="button" onClick={() => deleteThread(confirmDelete)} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                  {t.confirmDeleteAction}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.cbcPortal}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#94A3B8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#F5F7FA] py-2.5 pl-10 pr-4 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:bg-white focus:ring-2 focus:ring-[#1E88E5]/20"
            />
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-semibold text-[#334155]">
              {t.moderate}
              <button
                type="button"
                role="switch"
                aria-checked={moderate}
                onClick={() => setModerate((v) => !v)}
                className={[
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-2',
                  moderate ? 'bg-[#0A4D8C]' : 'bg-[#CBD5E1]',
                ].join(' ')}
              >
                <span
                  className={[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
                    moderate ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
            </label>
            <button
              type="button"
              onClick={() => setComposeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c]"
            >
              <Icon name="add_comment" className="text-[16px]" />
              {t.startDiscussion}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTopic(null)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              activeTopic === null ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
            ].join(' ')}
          >
            {t.all} ({countFor(null)})
          </button>
          {topics.map((tp) => {
            const isActive = activeTopic === tp.id;
            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => setActiveTopic(tp.id)}
                className={['flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', isActive ? 'text-white' : 'text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
                style={isActive ? { backgroundColor: tp.color, borderColor: tp.color } : { borderColor: '#CBD5E1' }}
              >
                <Icon name={tp.icon} className="text-[14px]" />
                {tp[language]} ({countFor(tp.id)})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="forum" className="text-[36px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.noResultsTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.noResultsBody}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((th) => {
            const topic = topicOf(th.topicId);
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => openThread(th.id)}
                className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${th.isOfficial ? 'bg-[#00A86B]' : 'bg-[#0A4D8C]'}`}>
                  {initialsOf(th.author)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${topic.color}1A`, color: topic.color }}>
                      <Icon name={topic.icon} className="text-[11px]" />
                      {topic[language]}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyles[th.status]}`}>{t.status[th.status]}</span>
                    {th.pinned && (
                      <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        <Icon name="push_pin" className="text-[11px]" />
                        {t.pinned}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 truncate text-sm font-bold text-[#1E293B]">{th[language === 'en' ? 'titleEn' : 'titleBn']}</h3>
                  <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                    {t.postedBy} {th.author} · {th.org} · {t.lastActivity}: {th.lastActivity[language]}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-[11px] text-[#64748B] sm:flex">
                  <span className="flex items-center gap-1">
                    <Icon name="forum" className="text-[13px] text-[#94A3B8]" />
                    {th.replies.length} {t.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="visibility" className="text-[13px] text-[#94A3B8]" />
                    {th.views.toLocaleString()} {t.views}
                  </span>
                </div>
                {moderate && (
                  <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => togglePin(th.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${th.pinned ? 'text-amber-600 hover:bg-amber-50' : 'text-[#94A3B8] hover:bg-[#F5F7FA]'}`}
                    >
                      <Icon name="push_pin" className="text-[16px]" />
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(th.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#DC2626] hover:bg-red-50">
                      <Icon name="delete" className="text-[16px]" />
                    </button>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setComposeOpen(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.composeTitle}</h2>
              <button type="button" onClick={() => setComposeOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-4 px-5 py-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-[#334155]">{t.topic}</span>
                <select value={composeDraft.topicId} onChange={(e) => setComposeDraft({ ...composeDraft, topicId: e.target.value })} className={inputClass}>
                  {topics.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp[language]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-[#334155]">{t.discussionTitle}</span>
                <input value={composeDraft.title} onChange={(e) => setComposeDraft({ ...composeDraft, title: e.target.value })} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-[#334155]">{t.message}</span>
                <textarea rows={4} value={composeDraft.message} onChange={(e) => setComposeDraft({ ...composeDraft, message: e.target.value })} className={`${inputClass} resize-none`} />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setComposeOpen(false)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={postDiscussion}
                disabled={!composeDraft.title || !composeDraft.message}
                className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
              >
                {t.post}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#DC2626]">
                <Icon name="warning" className="text-[22px]" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1E293B]">{t.confirmDeleteTitle}</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{t.confirmDeleteBody}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={() => deleteThread(confirmDelete)} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
