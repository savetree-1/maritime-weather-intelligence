<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Services\DocumentProcessingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    protected $documentService;

    public function __construct(DocumentProcessingService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Upload and process a document
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
            'document_type' => 'required|in:sof,charter_party,voyage_order,other',
            'name' => 'string|max:255',
        ]);

        try {
            $file = $request->file('document');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('documents', $filename, 'local');

            // Create document record
            $document = Document::create([
                'user_id' => auth()->id(),
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'document_type' => $request->document_type,
                'ocr_status' => 'pending',
                'uploaded_at' => now(),
            ]);

            // Queue document for processing
            $jobId = $this->documentService->queueForProcessing($document);

            return response()->json([
                'success' => true,
                'data' => [
                    'document_id' => $document->id,
                    'job_id' => $jobId,
                    'status' => 'uploaded',
                    'processing_status' => 'queued',
                ],
                'message' => 'Document uploaded successfully and queued for processing',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload document',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get processing status of a document
     */
    public function status(Request $request, $jobId): JsonResponse
    {
        try {
            $status = $this->documentService->getProcessingStatus($jobId);
            
            return response()->json([
                'success' => true,
                'data' => $status,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get processing status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's documents
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Document::where('user_id', auth()->id());

            if ($request->has('type')) {
                $query->byType($request->type);
            }

            if ($request->boolean('processed_only')) {
                $query->processed();
            }

            $documents = $query->orderBy('uploaded_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $documents,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch documents',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific document
     */
    public function show($documentId): JsonResponse
    {
        try {
            $document = Document::where('user_id', auth()->id())
                               ->findOrFail($documentId);

            return response()->json([
                'success' => true,
                'data' => $document,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found',
            ], 404);
        }
    }

    /**
     * Delete document
     */
    public function destroy($documentId): JsonResponse
    {
        try {
            $document = Document::where('user_id', auth()->id())
                               ->findOrFail($documentId);

            // Delete file from storage
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }

            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete document',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download document
     */
    public function download($documentId)
    {
        try {
            $document = Document::where('user_id', auth()->id())
                               ->findOrFail($documentId);

            if (!Storage::exists($document->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found',
                ], 404);
            }

            return Storage::download($document->file_path, $document->original_name);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download document',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}