import { ArtistObject } from "@src/common/asset/types/Artist";
import { ResourceType } from "@src/common/asset/types/common";
import { Schema, model, models } from "mongoose";

const ArtistSchema : Schema = new Schema({
  type: {
    type: String,
    required: true,
    default: ResourceType.ARTIST
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
  alias: {
    type: [String],
    required: true
  },
  href: {
    type: String,
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
  external_urls: {
    type: Map,
    of: String,
    required: true
  },
  external_social_urls: {
    type: Map,
    of: String,
    required: true
  }
})

export default models['Artist'] || model<ArtistObject>('Artist', ArtistSchema)