PRAGMA foreign_keys = ON;

CREATE TABLE artists (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  slug     TEXT NOT NULL UNIQUE,
  name     TEXT NOT NULL,
  name_en  TEXT
);

CREATE TABLE artist_aliases (
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  alias     TEXT NOT NULL,
  PRIMARY KEY (artist_id, position)
);

CREATE TABLE artist_images (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  url       TEXT NOT NULL,
  type      TEXT NOT NULL,
  height    INTEGER,
  width     INTEGER,
  UNIQUE (artist_id, position)
);

CREATE TABLE albums (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                   TEXT NOT NULL UNIQUE,
  name                   TEXT NOT NULL,
  name_en                TEXT,
  album_type             TEXT NOT NULL CHECK (album_type IN ('album','single','compilation')),
  album_edition          TEXT NOT NULL,
  label                  TEXT NOT NULL,
  label_en               TEXT,
  release_date           TEXT NOT NULL,
  release_date_precision TEXT NOT NULL CHECK (release_date_precision IN ('year','month','day')),
  is_live                INTEGER NOT NULL DEFAULT 0 CHECK (is_live IN (0,1))
);

CREATE TABLE album_images (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  url      TEXT NOT NULL,
  type     TEXT NOT NULL,
  height   INTEGER,
  width    INTEGER,
  UNIQUE (album_id, position)
);

CREATE TABLE tracks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  name_en      TEXT,
  album_id     INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  disc_number  INTEGER NOT NULL,
  track_number INTEGER NOT NULL,
  duration_s   INTEGER,
  has_lyrics   INTEGER NOT NULL DEFAULT 0 CHECK (has_lyrics IN (0,1)),
  lyrics       TEXT,
  is_live      INTEGER NOT NULL DEFAULT 0 CHECK (is_live IN (0,1)),
  is_playable  INTEGER NOT NULL DEFAULT 0 CHECK (is_playable IN (0,1)),
  preview_url  TEXT
);
CREATE INDEX idx_tracks_album ON tracks(album_id, disc_number, track_number);

CREATE TABLE album_artists (
  album_id  INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  PRIMARY KEY (album_id, artist_id)
);

CREATE TABLE track_artists (
  track_id  INTEGER NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  role      TEXT NOT NULL CHECK (role IN (
              'composer','lyricist','arranger','lead_vocal',
              'poet','reciter','backup_vocal','bass','other')),
  position  INTEGER NOT NULL,
  PRIMARY KEY (track_id, artist_id, role)
);

CREATE TABLE genres (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE album_genres (
  album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, genre_id)
);

CREATE TABLE track_genres (
  track_id INTEGER NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (track_id, genre_id)
);

CREATE TABLE external_urls (
  entity_type TEXT NOT NULL CHECK (entity_type IN ('album','track','artist')),
  entity_id   INTEGER NOT NULL,
  origin      TEXT NOT NULL CHECK (origin IN (
                'official','apple_music','joox','kkbox','moov',
                'spotify','youtube','youtube_music')),
  url         TEXT NOT NULL,
  PRIMARY KEY (entity_type, entity_id, origin)
);

CREATE TABLE external_social_urls (
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  origin    TEXT NOT NULL CHECK (origin IN ('facebook','instagram','weibo')),
  url       TEXT NOT NULL,
  PRIMARY KEY (artist_id, origin)
);
