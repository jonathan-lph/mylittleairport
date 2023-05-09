import { AlbumType } from "@src/common/asset/test";
import { AlbumEditionType, AlbumObject, CompilationEditionType, SingleEditionType } from "@src/common/asset/types/Album";
import { DatePrecision, ResourceType } from "@src/common/asset/types/common";
import { Schema, model, models } from "mongoose";

const AlbumSchema : Schema = new Schema({
  type: {
    type: String,
    required: true,
    default: ResourceType.ALBUM
  },
  slug: { 
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: false
  },
  href: {
    type: String,
    required: true
  },
  total_tracks: {
    type: Number,
    required: true
  },
  album_type: {
    type: String,
    required: true,
    enum: AlbumType
  },
  album_edition: {
    type: String,
    required: true,
    enum: {
      ...AlbumEditionType,
      ...SingleEditionType,
      ...CompilationEditionType
    }
  },
  label: {
    type: String,
    required: true
  },
  label_en: {
    type: String,
    required: false
  },
  release_date: {
    type: String,
    required: true
  },
  release_date_precision: {
    type: String,
    required: true,
    enum: DatePrecision
  },
  is_live: {
    type: Boolean,
    required: true,
    default: false
  },
  artists: {
    type: [Schema.Types.ObjectId],
    ref: 'Artist',
    required: true
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    ref: 'Track',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: false
    },
    width: {
      type: Number,
      required: false
    }
  }],
  genres: {
    type: [String],
    required: true
  },
  external_urls: {
    type: Map,
    of: String,
    required: true
  }
})

export default models['Album'] || model<AlbumObject>('Album', AlbumSchema)