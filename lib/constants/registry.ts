import {
  ICountrySelectLanguages,
  ICountrySelectLanguagesISO2,
} from '../interface/countrySelectLanguages';
import { ICountryNameTranslation } from '../interface/country';
import { normalizeLanguage } from '../utils/normalizeLanguage';
import baseCountriesData from './countries.base.json';
import engTranslations from './translations/eng.json';

type TranslationMap = Record<string, ICountryNameTranslation>;

const loaded = new Map<ICountrySelectLanguagesISO2, TranslationMap>();
const inflight = new Map<ICountrySelectLanguagesISO2, Promise<void>>();

loaded.set('eng', engTranslations as TranslationMap);

const loaders: Record<
  ICountrySelectLanguagesISO2,
  () => Promise<TranslationMap>
> = {
  ara: () => import('./translations/ara.json').then((m) => m.default as TranslationMap),
  bel: () => import('./translations/bel.json').then((m) => m.default as TranslationMap),
  bre: () => import('./translations/bre.json').then((m) => m.default as TranslationMap),
  bul: () => import('./translations/bul.json').then((m) => m.default as TranslationMap),
  ces: () => import('./translations/ces.json').then((m) => m.default as TranslationMap),
  deu: () => import('./translations/deu.json').then((m) => m.default as TranslationMap),
  ell: () => import('./translations/ell.json').then((m) => m.default as TranslationMap),
  eng: () => Promise.resolve(engTranslations as TranslationMap),
  est: () => import('./translations/est.json').then((m) => m.default as TranslationMap),
  fin: () => import('./translations/fin.json').then((m) => m.default as TranslationMap),
  fra: () => import('./translations/fra.json').then((m) => m.default as TranslationMap),
  heb: () => import('./translations/heb.json').then((m) => m.default as TranslationMap),
  hrv: () => import('./translations/hrv.json').then((m) => m.default as TranslationMap),
  hun: () => import('./translations/hun.json').then((m) => m.default as TranslationMap),
  ita: () => import('./translations/ita.json').then((m) => m.default as TranslationMap),
  jpn: () => import('./translations/jpn.json').then((m) => m.default as TranslationMap),
  kor: () => import('./translations/kor.json').then((m) => m.default as TranslationMap),
  nld: () => import('./translations/nld.json').then((m) => m.default as TranslationMap),
  per: () => import('./translations/per.json').then((m) => m.default as TranslationMap),
  pol: () => import('./translations/pol.json').then((m) => m.default as TranslationMap),
  por: () => import('./translations/por.json').then((m) => m.default as TranslationMap),
  ron: () => import('./translations/ron.json').then((m) => m.default as TranslationMap),
  rus: () => import('./translations/rus.json').then((m) => m.default as TranslationMap),
  slk: () => import('./translations/slk.json').then((m) => m.default as TranslationMap),
  spa: () => import('./translations/spa.json').then((m) => m.default as TranslationMap),
  srp: () => import('./translations/srp.json').then((m) => m.default as TranslationMap),
  swe: () => import('./translations/swe.json').then((m) => m.default as TranslationMap),
  tur: () => import('./translations/tur.json').then((m) => m.default as TranslationMap),
  ukr: () => import('./translations/ukr.json').then((m) => m.default as TranslationMap),
  urd: () => import('./translations/urd.json').then((m) => m.default as TranslationMap),
  zho: () => import('./translations/zho.json').then((m) => m.default as TranslationMap),
  'zho-Hans': () =>
    import('./translations/zho-Hans.json').then((m) => m.default as TranslationMap),
  'zho-Hant': () =>
    import('./translations/zho-Hant.json').then((m) => m.default as TranslationMap),
};

export const isLanguageLoaded = (
  input: ICountrySelectLanguages
): boolean => loaded.has(normalizeLanguage(input));

export async function loadLanguage(
  input: ICountrySelectLanguages
): Promise<void> {
  const lang = normalizeLanguage(input);
  if (loaded.has(lang)) return;
  let pending = inflight.get(lang);
  if (!pending) {
    pending = loaders[lang]()
      .then((data) => {
        loaded.set(lang, data);
      })
      .finally(() => {
        inflight.delete(lang);
      });
    inflight.set(lang, pending);
  }
  return pending;
}

export function getTranslation(
  cca2: string,
  input: ICountrySelectLanguages
): ICountryNameTranslation | undefined {
  const lang = normalizeLanguage(input);
  return loaded.get(lang)?.[cca2] ?? loaded.get('eng')?.[cca2];
}

export function getLoadedTranslations(
  input: ICountrySelectLanguages
): TranslationMap | undefined {
  return loaded.get(normalizeLanguage(input));
}

export const baseCountries: ReadonlyArray<unknown> =
  baseCountriesData as unknown as ReadonlyArray<unknown>;
