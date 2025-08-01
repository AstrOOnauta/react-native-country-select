import {ICountrySelectLanguages} from '../interface';

type TranslationKey =
  | 'searchPlaceholder'
  | 'popularCountriesTitle'
  | 'allCountriesTitle'
  | 'searchNotFoundMessage';
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
  popularCountriesTitle: {
    ara: 'البلدان الشائعة',
    bel: 'Папулярныя краіны',
    bre: 'Broioù Poblus',
    bul: 'Популярни държави',
    ces: 'Populární země',
    deu: 'Beliebte Länder',
    ell: 'Δημοφιλείς χώρες',
    eng: 'Popular Countries',
    est: 'Populaarsed riigid',
    fin: 'Suositut maat',
    fra: 'Pays Populaires',
    heb: 'מדינות פופולריות',
    hrv: 'Popularne države',
    hun: 'Népszerű országok',
    ita: 'Paesi Popolari',
    jpn: '人気の国',
    kor: '인기 국가',
    nld: 'Populaire landen',
    per: 'کشورهای محبوب',
    pol: 'Popularne kraje',
    por: 'Países Populares',
    ron: 'Țări populare',
    rus: 'Популярные страны',
    slk: 'Populárne krajiny',
    spa: 'Países Populares',
    srp: 'Популарне државе',
    swe: 'Populära länder',
    tur: 'Popüler Ülkeler',
    ukr: 'Популярні країни',
    urd: 'مقبول ممالک',
    zho: '热门国家',
    'zho-Hans': '热门国家',
    'zho-Hant': '熱門國家',
  },
  allCountriesTitle: {
    ara: 'كل البلدان',
    bel: 'Усе краіны',
    bre: 'An Holl Vroioù',
    bul: 'Всички държави',
    ces: 'Všechny země',
    deu: 'Alle Länder',
    ell: 'Όλες οι χώρες',
    eng: 'All Countries',
    est: 'Kõik riigid',
    fin: 'Kaikki maat',
    fra: 'Tous les Pays',
    heb: 'כל המדינות',
    hrv: 'Sve države',
    hun: 'Minden ország',
    ita: 'Tutti i Paesi',
    jpn: 'すべての国',
    kor: '모든 국가',
    nld: 'Alle landen',
    per: 'همه کشورها',
    pol: 'Wszystkie kraje',
    por: 'Todos os Países',
    ron: 'Toate țările',
    rus: 'Все страны',
    slk: 'Všetky krajiny',
    spa: 'Todos los Países',
    srp: 'Све државе',
    swe: 'Alla länder',
    tur: 'Tüm Ülkeler',
    ukr: 'Всі країни',
    urd: 'تمام ممالک',
    zho: '所有国家',
    'zho-Hans': '所有国家',
    'zho-Hant': '所有國家',
  },
  searchNotFoundMessage: {
    ara: 'لا توجد دول مطابقة',
    bel: 'Краіны не знойдзены',
    bre: "N'en eo bet",
    bul: 'Няма намерени държави',
    ces: 'Nebyly nalezeny žádné země',
    deu: 'Keine Länder gefunden',
    ell: 'Δεν βρέθηκαν χώρες',
    eng: 'No countries found',
    est: 'Riikuid ei leitud',
    fin: 'Maita ei löytynyt',
    fra: 'Aucun pays trouvé',
    heb: 'לא נמצאו מדינות',
    hrv: 'Nema pronađenih zemalja',
    hun: 'Nem található ország',
    ita: 'Nessun paese trovato',
    jpn: '国が見つかりません',
    kor: '국가를 찾을 수 없습니다',
    nld: 'Geen landen gevonden',
    per: 'هیچ کشوری یافت نشد',
    pol: 'Nie znaleziono krajów',
    por: 'Nenhum país encontrado',
    ron: 'Nu s-au găsit țări',
    rus: 'Страны не найдены',
    slk: 'Nenašli sa žiadne krajiny',
    spa: 'No se encontró ningún país',
    srp: 'Нису пронађене државе',
    swe: 'Inga länder hittades',
    tur: 'Hiçbir ülke bulunamadı',
    ukr: 'Країни не знайдено',
    urd: 'کوئی ملک نہیں ملا',
    zho: '没有找到国家',
    'zho-Hans': '没有找到国家',
    'zho-Hant': '找不到國家',
  },
} as const;
