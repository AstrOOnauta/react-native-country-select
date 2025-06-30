import {ICountrySelectLanguages} from '../interface';

type TranslationKey = 'searchPlaceholder';
type TranslationMap = Record<
  TranslationKey,
  Record<ICountrySelectLanguages, string>
>;

export const translations: TranslationMap = {
  searchPlaceholder: {
    ara: 'البحث عن بلد...',
    bel: 'Пошук краіны...',
    bre: 'Klask bro...',
    bul: 'Търсене на държава...',
    ces: 'Hledat zemi...',
    deu: 'Land suchen...',
    ell: 'Αναζήτηση χώρας...',
    eng: 'Search country...',
    est: 'Otsi riiki...',
    fin: 'Etsi maata...',
    fra: 'Rechercher un pays...',
    heb: 'חיפוש מדינה...',
    hrv: 'Pretraži državu...',
    hun: 'Ország keresése...',
    ita: 'Cerca paese...',
    jpn: '国を検索...',
    kor: '국가 검색...',
    nld: 'Zoek land...',
    per: 'جستجوی کشور...',
    pol: 'Szukaj kraju...',
    por: 'Buscar país...',
    ron: 'Căutare țară...',
    rus: 'Поиск страны...',
    slk: 'Hľadať krajinu...',
    spa: 'Buscar país...',
    srp: 'Претрага државе...',
    swe: 'Sök land...',
    tur: 'Ülke ara...',
    ukr: 'Пошук країни...',
    urd: '...ملک تلاش کریں',
    zho: '搜索国家...',
    'zho-Hans': '搜索国家...',
    'zho-Hant': '搜尋國家...',
  },
} as const;
