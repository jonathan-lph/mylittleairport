import path from "path"
import Database from "better-sqlite3"

let db: Database.Database | null = null

// Build-time-only accessor for the generated content database. Must never be
// imported from client-facing code — it isn't bundled for the browser and the
// static export has no server at runtime to query it from.
export function getDb(): Database.Database {
  if (!db) {
    db = new Database(
      path.join(process.cwd(), "src/__data/.generated/content.sqlite"),
      { readonly: true, fileMustExist: true }
    )
  }
  return db
}
