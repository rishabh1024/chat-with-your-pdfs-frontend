// import { apiClient } from "@/lib/apiClient";
// import { supabase } from "@/lib/supabase";
// import type { FileUploadResponse, UploadStatus, UploadedDocument } from "@/types/document"; 

// type RequestOptions = {
//   signal?: AbortSignal
// }

// export async function listDocuments(options: RequestOptions = {}) {
//   const response = await apiClient.get<UploadedDocument[]>('/upload/documents', {
//     signal: options.signal,
//   })
//   return response.data
// }

// export async function uploadDocument(file: File) {
//   const body = new FormData()
//   body.append('input_file', file)

//   const response = await apiClient.post<FileUploadResponse>('/upload/', body, {
//     timeout: 120_000,
//   })

//   return response
// }