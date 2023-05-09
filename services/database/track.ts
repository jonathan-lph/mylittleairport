import { TrackModel } from "models";
import { ExpandedTrackObject, ExportedTrackObject, TocTrackObject, TrackObject } from "@src/common/asset/types/Track";
import { HydratedDocument } from "mongoose";
import { ExportedAlbumObject, SimplifiedAlbumObject } from "@src/common/asset/types/Album";
import { omit } from "util/helper";
import { ExportedArtistObject } from "@src/common/asset/types/Artist";
import fs from "fs"

export async function fetchExpandedTracksFromDB() {
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

export async function fetchExpandedTrackFromFiles(trackSlug: string, albumSlug: string) {
  const exportedTrack : ExportedTrackObject = require(`_data/tracks/${albumSlug}/${trackSlug}`)
  const exportedAlbum : ExportedAlbumObject = require(`_data/albums/${albumSlug}`)
  const expandedAlbum : SimplifiedAlbumObject = omit({
    ...exportedAlbum,
    tracks: exportedAlbum.tracks.map((_track) => omit(
      require(`_data/tracks/${exportedAlbum.slug}/${_track.slug}`) as ExportedTrackObject,
      ["has_lyrics",  "lyrics", "album", "artists"]
    ))
  }, ["artists", "genres"])
  const expandedTrack : ExpandedTrackObject = {
    ...exportedTrack,
    album: expandedAlbum,
    artists: exportedTrack.artists.map((_artist) => ({
      ..._artist,
      members: _artist.members.map(_member => omit(
        require(`_data/artists/${_member.slug}`) as ExportedArtistObject,
        ["external_social_urls", "images"]
      ))
    }))
  }
  return expandedTrack
}

export async function searchTrackFromFiles(query: Partial<TocTrackObject>, expand?: boolean) {
  const tracks : TocTrackObject[] = require('_data/toc/tracks.json')
  const track = tracks.find(_track => 
     Object
      .entries(query)
      // @ts-ignore
      .every(([key, val]) => _track[key] === val)
  )
}