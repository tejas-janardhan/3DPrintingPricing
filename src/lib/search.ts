// Ranked substring search: startsWith matches first, then includes matches.
export function search<T>(
  items: T[],
  query: string,
  getText: (item: T) => string
): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return items

  const startsWith: T[] = []
  const includes: T[] = []

  for (const item of items) {
    const text = getText(item).toLowerCase()
    if (text.startsWith(q)) startsWith.push(item)
    else if (text.includes(q)) includes.push(item)
  }

  return [...startsWith, ...includes]
}
