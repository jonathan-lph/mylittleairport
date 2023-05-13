export enum Locales {
  ZH = "zh_hk",
  EN = "en_us"
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

export const credits = {
  name: "jon.l",
  link: "https://jonathanl.dev"
}