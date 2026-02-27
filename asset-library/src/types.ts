/** Cloudflare Worker environment bindings */
export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  API_TOKEN: string;
}

/** Asset row from D1 */
export interface AssetRow {
  id: string;
  name: string;
  slug: string;
  type: string;
  storage: string;
  current_version: string;
  source: string;
  license: string;
  license_url: string | null;
  base_name: string | null;
  created_at: string;
  updated_at: string;
  archived: number;
}

/** Version row from D1 */
export interface VersionRow {
  id: string;
  asset_id: string;
  version_number: number;
  hash: string;
  content: string | null;
  r2_key: string | null;
  file_size: number;
  mime_type: string;
  metadata: string | null;
  created_at: string;
  created_by: string;
}

/** Tag row from D1 */
export interface TagRow {
  id: string;
  name: string;
  type: string;
}

/** License row from D1 */
export interface LicenseRow {
  key: string;
  name: string;
  url: string | null;
  permits: string;
  requires: string;
  notes: string | null;
}

/** Usage log row from D1 */
export interface UsageRow {
  id: string;
  asset_id: string;
  version_id: string;
  consumer: string;
  context: string | null;
  brand: string | null;
  action: string;
  created_at: string;
}

/** Brand asset row from D1 */
export interface BrandAssetRow {
  brand: string;
  asset_id: string;
  role: string;
}

/** Lottie mapping row from D1 */
export interface LottieMappingRow {
  lottie_asset_id: string;
  static_asset_id: string;
}

/** MIME type lookup */
export const MIME_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  lottie: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  ico: 'image/x-icon',
};

/** Text-storable types (go in D1, not R2) */
export const TEXT_TYPES = new Set(['svg', 'lottie']);
