export enum Locales {
  ZH = "zh",
  EN = "en"
}

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