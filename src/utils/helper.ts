export function omit<T>(source: T, keys: (keyof T)[]) {
  if (!source || typeof source !== 'object') return source
  return Object.keys(source).reduce(
    (output, key) =>
      keys.includes(key as keyof T)
        ? output
        : { ...output, [key]: source[key as keyof T] },
    {}
  ) as Omit<T, keyof typeof keys>
}

export function injectObjectToString(str: string, obj: Record<string, any>) {
  return str
    .split('::')
    .reduce((acc, curr, idx) =>
      idx % 2 === 0
        ? acc + curr
        : acc + curr.split('.').reduce((child, key) => child[key] ?? null, obj)
    )
}