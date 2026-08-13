import type { TocTrackObject } from "@__types/Track"

let cache: Promise<TocTrackObject[]> | null = null

// Client-side accessor for the build-time-generated public/search-index.json
// (see src/scripts/buildSearchIndex.mjs). Shared/memoized so Header's shuffle
// button and SearchBar's lyrics search only ever fetch it once per page load.
export function getSearchIndex(): Promise<TocTrackObject[]> {
  if (!cache) {
    cache = fetch("/search-index.json").then((res) => res.json())
  }
  return cache
}
