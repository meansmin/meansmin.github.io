import type { Lang } from './types'

export const SITE = {
  brand: 'C&C F.',
  email: 'meansccf@gmail.com',
  // Formspree 폼 ID 를 넣으면 문의 폼이 실제로 전송된다. 비어 있으면 메일 링크만 보여준다.
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID || '',
  baseUrl: 'https://meansmin.github.io',
}

type Dict = Record<string, { ko: string; en: string }>

const T: Dict = {
  // 내비게이션
  navProducts: { ko: '제품', en: 'Products' },
  navAbout: { ko: '회사 소개', en: 'About' },
  navContact: { ko: '문의', en: 'Contact' },
  langSwitch: { ko: 'EN', en: '한국어' },

  // 히어로
  heroEyebrow: { ko: 'Mobile Games & Apps', en: 'Mobile Games & Apps' },
  heroTitle: { ko: '모바일 게임과 앱을 만듭니다', en: 'We build mobile games and apps' },
  heroBody: {
    ko: 'C&C F.는 기획부터 아트, 개발, 출시와 운영까지 직접 맡는 팀입니다. 지금 네 개의 앱을 Google Play에서 서비스하고 있습니다.',
    en: 'C&C F. is a team that handles everything in house — design, art, development, release, and the years after. Four of our apps are live on Google Play today.',
  },
  ctaProducts: { ko: '제품 보러 가기', en: 'See our products' },
  ctaContact: { ko: '문의하기', en: 'Get in touch' },

  // 지표
  statApps: { ko: '서비스 중인 앱', en: 'Live apps' },
  statGames: { ko: '게임', en: 'Games' },
  statTools: { ko: '도구 앱', en: 'Tools' },
  statPlatform: { ko: '플랫폼', en: 'Platform' },
  statLang: { ko: '지원 언어', en: 'Languages' },
  statLangValue: { ko: '한국어 · English', en: 'Korean · English' },

  // 제품
  productsEyebrow: { ko: 'PRODUCTS', en: 'PRODUCTS' },
  productsTitle: { ko: '서비스 중인 제품', en: 'What we ship' },
  productsBody: {
    ko: '게임과 생활 도구, 두 갈래로 만듭니다. 모두 무료로 받을 수 있습니다.',
    en: 'We work along two tracks — games and everyday tools. All of them are free to download.',
  },
  viewDetail: { ko: '자세히 보기', en: 'View details' },
  filterAll: { ko: '전체', en: 'All' },
  filterGames: { ko: '게임', en: 'Games' },
  filterApps: { ko: '앱', en: 'Apps' },
  filterEmpty: { ko: '이 분류에는 아직 제품이 없습니다.', en: 'Nothing in this category yet.' },

  // 회사 소개
  aboutEyebrow: { ko: 'ABOUT', en: 'ABOUT' },
  aboutTitle: { ko: '이렇게 일합니다', en: 'How we work' },
  about1Title: { ko: '기획부터 운영까지 한 팀에서', en: 'One team, end to end' },
  about1Body: {
    ko: '기획, 아트, 개발, 스토어 대응을 나누지 않고 한 팀이 맡습니다. 결정이 빠르고, 고칠 곳은 바로 고칩니다.',
    en: 'Design, art, engineering, and store operations all sit in one team. Decisions land quickly and fixes go out the same week.',
  },
  about2Title: { ko: '무료로 쓰고, 광고는 최소로', en: 'Free to use, light on ads' },
  about2Body: {
    ko: '모든 앱은 무료입니다. 광고는 쓰는 흐름을 끊지 않는 자리에만 둡니다.',
    en: 'Every app is free. Ads only sit where they will not interrupt what you came to do.',
  },
  about3Title: { ko: '출시 후에도 계속 다듬습니다', en: 'We keep shipping after launch' },
  about3Body: {
    ko: '내려받은 뒤가 진짜 시작입니다. 제보와 사용 기록을 보고 계속 손봅니다.',
    en: 'Launch day is the start. We read reports and usage, and keep refining from there.',
  },

  // 문의 유도
  ctaBandTitle: { ko: '함께 이야기할 것이 있으신가요?', en: 'Something to talk about?' },
  ctaBandBody: {
    ko: '제휴와 퍼블리싱 제안, 앱 문의, 버그 제보 모두 환영합니다.',
    en: 'Partnerships, publishing, product questions, bug reports — all welcome.',
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
    ko: '보통 며칠 안에 답장드립니다. 급한 내용이면 메일로 바로 보내주셔도 됩니다.',
    en: 'We usually reply within a few days. For anything urgent, email works too.',
  },
  fName: { ko: '이름', en: 'Name' },
  fEmail: { ko: '답장 받을 메일 주소', en: 'Email for the reply' },
  fSubject: { ko: '제목', en: 'Subject' },
  fMessage: { ko: '내용', en: 'Message' },
  fSend: { ko: '보내기', en: 'Send message' },
  fDirect: { ko: '메일로 바로 보내기', en: 'Email us directly' },
  fNoForm: { ko: '아래 주소로 메일을 보내주세요.', en: 'Please email us at the address below.' },

  // 푸터
  footerNote: { ko: '모바일 게임과 앱을 만듭니다', en: 'We build mobile games and apps' },
  footerProducts: { ko: '제품', en: 'Products' },
  footerCompany: { ko: '회사', en: 'Company' },
  notFound: { ko: '찾는 페이지가 없습니다', en: 'That page does not exist' },
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
