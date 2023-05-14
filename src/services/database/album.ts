import { AlbumModel } from "@database/models";
import { ExportedTrackObject } from "@src/types/Track";
import { ExportedAlbumObject, ExpandedAlbumObject, TocAlbumObject } from "@src/types/Album";
import { omit } from "@utils/helper";
import { ExportedArtistObject } from "@src/types/Artist";
import mongoosePromise from "@lib/mongoose";

export async function fetchExpandedAlbumsFromDB() {
  mongoosePromise
  const tracks = await AlbumModel
    .find()
    .populate({
      path: 'track',
      select: '-_id -__v -has_lyrics -lyrics -album -artists',
    })
    .populate({
      path: 'artists',
      select: '-external_social_urls -images -__v -_id'
    })
    .exec() as unknown as ExpandedAlbumObject
  return tracks
} 

export function fetchExpandedAlbumFromFiles(albumSlug: string) {
  const exportedAlbum : ExportedAlbumObject = require(`src/__data/albums/${albumSlug}`)
  const expandedAlbum : ExpandedAlbumObject = {
    ...exportedAlbum,
    tracks: exportedAlbum.tracks.map((_track) => omit(
      require(`src/__data/tracks/${_track.slug}`) as ExportedTrackObject,
      ["has_lyrics", "lyrics", "album", "artists"]
    )),
    artists: exportedAlbum.artists.map((_artist) => omit(
      require(`src/__data/artists/${_artist.slug}`) as ExportedArtistObject,
      ["external_social_urls", "images"]
    ))
  }
  return expandedAlbum
}

export function searchAlbumsFromFiles(query: Partial<TocAlbumObject>, expand?: false) : TocAlbumObject[]
export function searchAlbumsFromFiles(query: Partial<TocAlbumObject>, expand: true) : ExpandedAlbumObject[]
export function searchAlbumsFromFiles(query: Partial<TocAlbumObject>, expand?: boolean) {
  const albums : TocAlbumObject[] = require('src/__data/toc/albums.json')
  const matchedAlbums = albums.filter(_album => 
    Object
    .entries(query)
    .every(([key, val]) => _album[key as keyof TocAlbumObject] === val)
  )
  if (!matchedAlbums || matchedAlbums.length === 0) return []
  return expand
    ? matchedAlbums.map(_album => fetchExpandedAlbumFromFiles(_album.slug))
    : matchedAlbums
}