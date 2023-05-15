export default function mapMetaTags(
  obj: Record<string, string | string[] | Record<string, string>[]>
) {
  return Object.entries(obj).map(([prop, content]) =>
    !Array.isArray(content) ? (
      <meta key={prop} property={prop} content={content} />
    ) : typeof content[0] === 'object' ? (
      content.map((_item, i) =>
        Object.entries(_item).map(([subprop, subcontent], j) => (
          <meta
            key={`${prop}:${subprop}:${i}${j}`}
            property={`${prop}:${subprop}`}
            content={subcontent}
          />
        ))
      )
    ) : (
      (content as string[]).map((_content) => (
        <meta key={prop} property={prop} content={_content} />
      ))
    )
  )
}