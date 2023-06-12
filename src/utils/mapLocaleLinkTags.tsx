import { Locales } from "@src/consts/definitions";
import { LocaleLinkTag } from "@src/types/common";

export function mapLocaleLinkTags(links : LocaleLinkTag[]) {
  return links.map(link => 
    <link
      key={link.hreflang}
      rel={link.hreflang === Locales.ZH ? 'canonical': 'alternate'}
      hrefLang={link.hreflang}
      href={link.href}
    />
  )
}