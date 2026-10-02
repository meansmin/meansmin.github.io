import type { Lang } from './types'

export const SITE = {
  brand: 'C&C F.',
  email: 'meansccf@gmail.com',
  // Formspree 폼 ID 를 넣으면 문의 폼이 실제로 전송된다. 비어 있으면 메일 링크만 보여준다.
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID || '',
  baseUrl: 'https://ccfsoft.com',
}

type Dict = Record<string, { ko: string; en: string }>

const T: Dict = {
  // 내비게이션
  navProducts: { ko: '제품', en: 'Products' },
  navAbout: { ko: '회사 소개', en: 'About' },
  navContact: { ko: '문의', en: 'Contact' },
  // 버튼에는 '지금 보고 있는 언어'를 표시하고, 누르면 다른 언어로 바뀐다 (2026-09-21 상민님 지시)
  langSwitch: { ko: '한국어', en: 'ENG' },
  langSwitchTo: { ko: 'Switch to English', en: '한국어로 보기' },

  // 히어로 — {shipped}/{next} 는 데이터 개수로 치환된다. 숫자를 문구에 직접 적지 않는다.
  heroShipped: { ko: '서비스 중', en: 'live' },
  heroNext: { ko: '준비 중', en: 'in the works' },
  heroTitle: {
    ko: '{shipped}개를 출시했고,\n{next}개를 만들고 있습니다.',
    en: '{shipped} shipped.\n{next} more on the way.',
  },
  heroBody: {
    ko: 'C&C F.는 모바일 게임과 생활 도구를 직접 기획하고 만듭니다. 아래의 타임라인은 C&C F.가 지나온 발자취이며, 앞으로 나아갈 길입니다.',
    en: "C&C F. designs and builds mobile games and everyday tools. The timeline below is where we've been, and where we're going.",
  },
  ctaProducts: { ko: '제품 보기', en: 'See the products' },
  ctaNext: { ko: '다음 작품 보기', en: "See what's next" },
  ctaContact: { ko: '문의하기', en: 'Get in touch' },

  // 출시 타임라인
  railLabel: { ko: '출시 타임라인', en: 'Release timeline' },
  railSoon: { ko: '준비 중', en: 'Up next' },

  // 준비 중
  nextEyebrow: { ko: 'UP NEXT', en: 'UP NEXT' },
  nextTitle: { ko: '지금 만들고 있는 것', en: "What we're building" },
  nextBody: {
    ko: '지금 만들고 있는 작품입니다. 출시하면 제품 목록으로 옮겨집니다.',
    en: "What we're working on now. Each one moves up to the product list when it ships.",
  },
  stage_planning: { ko: '기획 중', en: 'Planning' },
  stage_developing: { ko: '개발 중', en: 'In development' },
  stage_testing: { ko: '테스트 중', en: 'In testing' },

  // 제품
  productsEyebrow: { ko: 'PRODUCTS', en: 'PRODUCTS' },
  productsTitle: { ko: '서비스 중인 제품', en: 'What we ship' },
  productsBody: {
    ko: '게임과 생활 도구를 만듭니다. 전부 무료입니다.',
    en: 'Games and everyday tools. All free.',
  },
  viewDetail: { ko: '자세히 보기', en: 'View details' },
  filterAll: { ko: '전체', en: 'All' },
  filterGames: { ko: '게임', en: 'Games' },
  filterApps: { ko: '앱', en: 'Apps' },
  filterEmpty: { ko: '아직 없습니다.', en: 'Nothing here yet.' },

  // 회사 소개
  aboutEyebrow: { ko: 'ABOUT', en: 'ABOUT' },
  aboutTitle: { ko: '일하는 방식', en: 'How we work' },
  about1Title: { ko: '기획부터 운영까지 직접', en: 'Everything in house' },
  about1Body: {
    ko: '기획, 아트, 개발, 스토어 대응까지 직접 합니다. 결정이 빠르고, 고칠 건 바로 고칩니다.',
    en: 'Design, art, code and store work, all done in house. Decisions are quick and fixes go out fast.',
  },
  about2Title: { ko: '무료, 광고는 최소로', en: 'Free, with few ads' },
  about2Body: {
    ko: '앱은 전부 무료입니다. 광고는 흐름을 끊지 않는 자리에만 둡니다.',
    en: 'Every app is free. Ads stay out of the way.',
  },
  about3Title: { ko: '출시가 끝이 아닙니다', en: 'Launch is not the end' },
  about3Body: {
    ko: '출시 뒤에도 제보를 보고 계속 손봅니다.',
    en: 'We keep listening after launch, and keep fixing.',
  },

  // 문의 유도
  ctaBandTitle: { ko: '하고 싶은 이야기가 있나요?', en: 'Something on your mind?' },
  ctaBandBody: {
    ko: '제휴, 퍼블리싱, 앱 문의, 버그 제보 모두 환영합니다.',
    en: 'Partnerships, publishing, questions, bug reports. All welcome.',
  },

  // 제품 상세
  released: { ko: '출시', en: 'Released' },
  game: { ko: '게임', en: 'Game' },
  app: { ko: '앱', en: 'App' },
  openStore: { ko: 'Google Play에서 받기', en: 'Get it on Google Play' },
  privacy: { ko: '개인정보처리방침', en: 'Privacy policy' },
  screenshots: { ko: '화면 미리보기', en: 'Screenshots' },
  about: { ko: '제품 소개', en: 'Overview' },
  backHome: { ko: '제품 목록', en: 'All products' },
  otherProducts: { ko: '다른 제품', en: 'Other products' },

  // 문의 페이지
  contactTitle: { ko: '문의하기', en: 'Get in touch' },
  contactLead: {
    ko: '며칠 안에 답장드립니다. 급하면 메일로 바로 보내주세요.',
    en: "We reply within a few days. If it's urgent, email us directly.",
  },
  fName: { ko: '이름', en: 'Name' },
  fEmail: { ko: '이메일', en: 'Email' },
  fSubject: { ko: '제목', en: 'Subject' },
  fMessage: { ko: '내용', en: 'Message' },
  fSend: { ko: '보내기', en: 'Send message' },
  fDirect: { ko: '메일로 바로 보내기', en: 'Email us directly' },
  fNoForm: { ko: '아래 주소로 메일 주세요.', en: 'Email us at the address below.' },

  // 푸터
  footerNote: { ko: '모바일 게임과 앱을 만듭니다', en: 'We build mobile games and apps' },
  footerProducts: { ko: '제품', en: 'Products' },
  footerCompany: { ko: '회사', en: 'Company' },
  notFound: { ko: '없는 페이지입니다', en: 'Page not found' },
  backToHome: { ko: '홈으로', en: 'Back to home' },
}

export function t(key: keyof typeof T | string, lang: Lang): string {
  const e = T[key]
  if (!e) return key
  return lang === 'en' ? e.en : e.ko
}

export function langHref(lang: Lang, pathAfterLang: string): string {
  const p = pathAfterLang.startsWith('/') ? pathAfterLang : '/' + pathAfterLang
  const clean = p === '/' ? '' : p
  return lang === 'en' ? `/en${clean || '/'}` : clean || '/'
}
