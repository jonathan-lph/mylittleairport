// [lang]-[region]
// Language code: ISO 639-1
// Region code: ISO 3166-1 Alpha 2
export enum Locales {
  ZH = "zh-hk",
  EN = "en-us"
}

// https://developers.google.com/search/docs/specialty/international/localized-versions
export const locales : {
  locale: Locales,
  label: string
}[] = [{
  locale: Locales.ZH,
  label: '中',
}, {
  locale: Locales.EN,
  label: 'EN',
}]