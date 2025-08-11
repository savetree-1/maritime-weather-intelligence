import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Download, Trash2, Eye } from 'lucide-react';
import { documentService } from '../services/documentService';

const DocumentProcessing = () => {
  const [documents, setDocuments] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ uploading: false, progress: 0 });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadStatus({ uploading: true, progress: 0 });
      
      const result = await documentService.uploadDocument(file, 'sof');
      
      setUploadStatus({ uploading: false, progress: 100 });
      await loadDocuments(); // Refresh document list
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus({ uploading: false, progress: 0 });
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await documentService.deleteDocument(documentId);
      await loadDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleViewDocument = async (document) => {
    try {
      const details = await documentService.getDocument(document.id);
      setSelectedDocument(details);
    } catch (error) {
      console.error('Error loading document details:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-active';
      case 'processing':
        return 'status-warning';
      case 'failed':
        return 'status-critical';
      default:
        return 'status-warning';
    }
  };

  const DocumentCard = ({ document }) => (
    <div className="glass-card p-6 hover:bg-white/5 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-teal-400 mr-3" />
          <div>
            <h3 className="font-semibold text-white">{document.original_name}</h3>
            <p className="text-white/60 text-sm">
              {document.document_type.toUpperCase()} • {document.file_size_human}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(document.ocr_status)}`}>
          {getStatusIcon(document.ocr_status)}
          <span className="ml-2">{document.ocr_status.toUpperCase()}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-white/80 text-sm mb-2">
          Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
        </p>
        {document.processing_metadata && (
          <div className="text-white/60 text-xs">
            {document.processing_metadata.word_count && (
              <span>Words: {document.processing_metadata.word_count} • </span>
            )}
            {document.processing_metadata.clauses_found && (
              <span>Clauses: {document.processing_metadata.clauses_found} • </span>
            )}
            {document.processing_metadata.confidence_score && (
              <span>Confidence: {(document.processing_metadata.confidence_score * 100).toFixed(0)}%</span>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleViewDocument(document)}
          className="btn-secondary text-sm px-3 py-1 flex items-center"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>
        {document.ocr_status === 'completed' && (
          <button
            onClick={() => documentService.downloadDocument(document.id)}
            className="btn-primary text-sm px-3 py-1 flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </button>
        )}
        <button
          onClick={() => handleDeleteDocument(document.id)}
          className="btn-danger text-sm px-3 py-1 flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );

  const DocumentDetails = ({ document, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Document Analysis</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Document Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Name:</span>
                  <span className="text-white">{document.original_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Type:</span>
                  <span className="text-white">{document.document_type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Size:</span>
                  <span className="text-white">{document.file_size_human}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(document.ocr_status)}`}>
                    {document.ocr_status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Clauses */}
            {document.parsed_clauses && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Extracted Information</h3>
                <div className="space-y-3">
                  {Object.entries(document.parsed_clauses).map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-lg p-3">
                      <h4 className="font-medium text-teal-400 mb-1">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Extracted Text */}
          {document.extracted_text && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Extracted Text</h3>
              <div className="bg-white/5 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-white/80 text-sm whitespace-pre-wrap">
                  {document.extracted_text}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Document Processing</h1>
        <div className="text-white/60">OCR & Maritime Clause Extraction</div>
      </div>

      {/* Upload Section */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-teal-400" />
          Upload Maritime Documents
        </h2>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-teal-500/50 transition-colors duration-200">
          <FileText className="h-12 w-12 text-teal-400 mx-auto mb-4" />
          <p className="text-white/80 mb-4">
            Upload maritime documents (PDF, JPG, PNG) for OCR processing and clause extraction
          </p>
          
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploadStatus.uploading}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className={`btn-primary inline-flex items-center cursor-pointer ${
              uploadStatus.uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadStatus.uploading ? (
              <>
                <div className="spinner h-4 w-4 mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </>
            )}
          </label>
          
          <p className="text-white/60 text-sm mt-4">
            Supported: Statement of Facts, Charter Party, Voyage Orders (Max 10MB)
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-teal-400" />
          Your Documents ({documents.length})
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="spinner h-8 w-8"></div>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-teal-400/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No documents uploaded</h3>
            <p className="text-white/60">
              Upload your first maritime document to get started with OCR processing
            </p>
          </div>
        )}
      </div>

      {/* Processing Capabilities */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Processing Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-teal-500/20 rounded-lg p-4 mb-4">
              <FileText className="h-8 w-8 text-teal-400 mx-auto" />
            </div>
            <h3 className="font-semibold text-white mb-2">OCR Extraction</h3>
            <p className="text-white/60 text-sm">
              Extract text from scanned documents with high accuracy
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <CheckCircle className="h-8 w-8 text-blue-400 mx-auto" />
            </div>
            <h3 className="font-semibold text-white mb-2">Clause Analysis</h3>
            <p className="text-white/60 text-sm">
              Identify and extract maritime-specific clauses and terms
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <Download className="h-8 w-8 text-green-400 mx-auto" />
            </div>
            <h3 className="font-semibold text-white mb-2">Data Export</h3>
            <p className="text-white/60 text-sm">
              Export processed data in structured formats
            </p>
          </div>
        </div>
      </div>

      {/* Document Details Modal */}
      {selectedDocument && (
        <DocumentDetails
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentProcessing;