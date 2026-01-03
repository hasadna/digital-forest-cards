export type TreeStatus = "identified" | "suspected";

export type TreeMediaStatus = "approved" | "flagged" | "deleted" | "test";

export interface TreeMediaMetadata {
  originalFileName?: string;
  uploaderIp?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface TreeMedia {
  id: string;
  treeId: string;
  s3Key: string;
  publicUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  status: TreeMediaStatus;
  uploadedBy?: string | null;
  metadata?: TreeMediaMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface TreeData {
  id: string;
  metaDate?: string;
  species?: string;
  speciesEnglish?: string;
  genus?: string;
  trunkDiameter?: number;
  height?: number;
  canopyArea?: number;
  crownDiameter?: number;
  numTrunks?: number;
  healthScore?: number;
  goodStatus?: string;
  age?: number;
  ageEstimated?: boolean;
  location?: string;
  municipality?: string;
  street?: string;
  fullAddress?: string;
  parcel?: string;
  coordinates?: string;
  treeSpace?: string;
  collectionType?: string;
  sourceType?: string;
  environment?: string;
  internalIds?: string[];
  photoUrl?: string;
  dataSources?: { name: string; date: string }[];
  status: TreeStatus;
  media?: TreeMedia[];
}

