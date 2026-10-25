export type UploadedDocument = {
  document_id: string
  document_metadata: string
  created_at: string
}

export type UploadStatus = 'Success' | 'Failed' | 'Already Exists'

export type FileUploadResponse = {
  document_id: string
  file_hash: string
  upload_status: UploadStatus
  upload_error: string | null
  document_index_status: Record<string, string>
}
