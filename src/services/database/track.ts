import mongoosePromise from "@lib/mongoose"
import { TrackModel } from "@database/models"
import { omit } from "@utils/helper"

import type { ExportedArtistObject } from "@__types/Artist"
import type { ExportedAlbumObject, SimplifiedAlbumObject } from "@__types/Album"
import type { ExpandedTrackObject, ExportedTrackObject, TocTrackObject } from "@__types/Track"

export async function fetchExpandedTracksFromDB() {
  mongoosePromise
  const tracks = await TrackModel
    .find()
    .populate({
      path: 'album',
      select: '-artists -genres -__v',
      populate: {
        path: 'tracks',
        select: '-has_lyrics -lyrics -album -artists -__v'
      }
    })
    .populate({
      path: 'artists.members',
      select: '-external_social_urls -images -__v'
    })
    .exec() as unknown as ExpandedTrackObject
  return tracks
} 

export function fetchExpandedTrackFromFiles(trackSlug: string) {
  const exportedTrack : ExportedTrackObject = require(`src/__data/tracks/${trackSlug}`)
  const exportedAlbum : ExportedAlbumObject = require(`src/__data/albums/${exportedTrack.album.slug}`)
  const expandedAlbum : SimplifiedAlbumObject = omit({
    ...exportedAlbum,
    tracks: exportedAlbum.tracks.map((_track) => omit(
      require(`src/__data/tracks/${_track.slug}`) as ExportedTrackObject,
      ["has_lyrics",  "lyrics", "album", "artists"]
    ))
  }, ["artists", "genres"])
  const expandedTrack : ExpandedTrackObject = {
    ...exportedTrack,
    album: expandedAlbum,
    artists: exportedTrack.artists.map((_artist) => ({
      ..._artist,
      members: _artist.members.map(_member => omit(
        require(`src/__data/artists/${_member.slug}`) as ExportedArtistObject,
        ["external_social_urls", "images"]
      ))
    }))
  }
  return expandedTrack
}

export function searchTracksFromFiles(query: Partial<TocTrackObject>, expand?: false) : TocTrackObject[]
export function searchTracksFromFiles(query: Partial<TocTrackObject>, expand: true) : ExpandedTrackObject[]
export function searchTracksFromFiles(query: Partial<TocTrackObject>, expand?: boolean) {
  const tracks : TocTrackObject[] = require('src/__data/toc/tracks.json')
  const matchedTracks = tracks.filter(_track => 
    Object
    .entries(query)
    .every(([key, val]) => _track[key as keyof TocTrackObject] === val)
  )
  if (!matchedTracks || matchedTracks.length === 0) return []
  return expand
    ? matchedTracks.map(_track => fetchExpandedTrackFromFiles(_track.slug))
    : matchedTracks
}