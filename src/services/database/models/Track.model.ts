import { ResourceType } from '@__types/common'
import { TrackArtistRole, TrackObject } from '@__types/Track'
import { Schema, model, models } from 'mongoose'

const TrackSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    default: ResourceType.TRACK,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: false,
  },
  href: {
    type: String,
    required: true,
  },
  disc_number: {
    type: Number,
    required: true,
    default: 1,
  },
  track_number: {
    type: Number,
    required: true,
  },
  duration_s: {
    type: Number,
    required: false,
  },
  has_lyrics: {
    type: Boolean,
    required: true,
  },
  lyrics: {
    type: String,
    required: function () {
      // @ts-ignore
      return this.has_lyrics
    },
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  artists: {
    type: [
      {
        role: {
          type: String,
          enum: TrackArtistRole,
        },
        members: {
          type: [Schema.Types.ObjectId],
          ref: 'Artist',
        },
      },
    ],
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  is_live: {
    type: Boolean,
    required: true,
    default: false,
  },
  is_playable: {
    type: Boolean,
    required: true,
    default: false,
  },
  preview_url: {
    type: String,
    required: false,
  },
  external_urls: {
    type: Map,
    of: String,
    required: true,
  },
})

export default models['Track'] || model<TrackObject>('Track', TrackSchema)