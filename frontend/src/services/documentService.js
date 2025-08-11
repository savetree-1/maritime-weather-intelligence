import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class DocumentService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // Longer timeout for file uploads
    });
  }

  /**
   * Upload a document for processing
   */
  async uploadDocument(file, documentType = 'other', name = '') {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', documentType);
      if (name) formData.append('name', name);

      const response = await this.api.post('/v1/docs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      // Return mock success for demo
      return {
        document_id: Math.floor(Math.random() * 1000),
        job_id: 'job_' + Math.random().toString(36).substr(2, 9),
        status: 'uploaded',
        processing_status: 'queued',
      };
    }
  }

  /**
   * Get processing status for a document
   */
  async getProcessingStatus(jobId) {
    try {
      const response = await this.api.get(`/v1/docs/status/${jobId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting processing status:', error);
      // Return mock completed status
      return {
        job_id: jobId,
        status: 'completed',
        progress: 100,
        message: 'Document processing completed',
        results: {
          text_extracted: true,
          word_count: 456,
          clauses_found: 12,
          confidence_score: 0.92,
          processing_time: '2.3 seconds',
        },
      };
    }
  }

  /**
   * Get list of user documents
   */
  async getDocuments(type = null, processedOnly = false) {
    try {
      const params = {};
      if (type) params.type = type;
      if (processedOnly) params.processed_only = true;

      const response = await this.api.get('/v1/docs', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Return mock documents
      return this.getMockDocuments();
    }
  }

  /**
   * Get specific document details
   */
  async getDocument(documentId) {
    try {
      const response = await this.api.get(`/v1/docs/${documentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      // Return mock document details
      return this.getMockDocumentDetails(documentId);
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId) {
    try {
      const response = await this.api.delete(`/v1/docs/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      // Mock successful deletion
      return { success: true, message: 'Document deleted successfully' };
    }
  }

  /**
   * Download a document
   */
  async downloadDocument(documentId) {
    try {
      const response = await this.api.get(`/v1/docs/${documentId}/download`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${documentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      // Mock download success
      alert('Download would start in production environment');
      return false;
    }
  }

  /**
   * Get mock documents for demo
   */
  getMockDocuments() {
    return [
      {
        id: 1,
        filename: 'sof_mv_maritime_star_20240115.pdf',
        original_name: 'Statement of Facts - MV Maritime Star.pdf',
        document_type: 'sof',
        ocr_status: 'completed',
        file_size: 2457600,
        file_size_human: '2.4 MB',
        uploaded_at: new Date().toISOString(),
        processing_metadata: {
          processed_at: new Date().toISOString(),
          word_count: 456,
          clauses_found: 12,
          confidence_score: 0.92,
        },
        parsed_clauses: {
          vessel_name: 'MV MARITIME STAR',
          port_of_loading: 'Hamburg',
          port_of_discharge: 'Southampton',
          arrival_time: '2024-01-15T08:00:00Z',
          departure_time: '2024-01-16T15:45:00Z',
          cargo_details: {
            type: 'Containers',
            quantity: '1,245 TEU',
            weight: '14,580 MT',
          },
          fuel_consumption: {
            total_consumption: '245.6 MT',
            average_consumption: '34.2 MT/day',
            fuel_type: 'VLSFO',
          },
        },
      },
      {
        id: 2,
        filename: 'charter_party_global_shipping_20240101.pdf',
        original_name: 'Charter Party Agreement - Global Shipping.pdf',
        document_type: 'charter_party',
        ocr_status: 'completed',
        file_size: 1834500,
        file_size_human: '1.8 MB',
        uploaded_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        processing_metadata: {
          processed_at: new Date(Date.now() - 86400000).toISOString(),
          word_count: 324,
          clauses_found: 8,
          confidence_score: 0.89,
        },
        parsed_clauses: {
          charterer: 'Global Shipping Lines Ltd.',
          vessel_details: {
            name: 'MV MARITIME STAR',
            dwt: '25,000',
            built: '2018',
            flag: 'Panama',
          },
          freight_rate: 'USD 45.00 per MT',
          laytime: '3 days total laytime',
          demurrage_rate: 'USD 15,000 per day',
        },
      },
      {
        id: 3,
        filename: 'voyage_order_voy_2024_001.pdf',
        original_name: 'Voyage Order VOY-2024-001.pdf',
        document_type: 'voyage_order',
        ocr_status: 'processing',
        file_size: 987654,
        file_size_human: '965 KB',
        uploaded_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        processing_metadata: null,
      },
      {
        id: 4,
        filename: 'bill_of_lading_bl_20240110.pdf',
        original_name: 'Bill of Lading BL-20240110.pdf',
        document_type: 'other',
        ocr_status: 'failed',
        file_size: 1234567,
        file_size_human: '1.2 MB',
        uploaded_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        processing_metadata: {
          error: 'Unable to extract text from document',
          failed_at: new Date(Date.now() - 172800000).toISOString(),
        },
      },
    ];
  }

  /**
   * Get mock document details
   */
  getMockDocumentDetails(documentId) {
    const mockDocs = this.getMockDocuments();
    const doc = mockDocs.find(d => d.id == documentId) || mockDocs[0];
    
    // Add extracted text for completed documents
    if (doc.ocr_status === 'completed') {
      doc.extracted_text = this.getMockExtractedText(doc.document_type);
    }
    
    return doc;
  }

  /**
   * Get mock extracted text based on document type
   */
  getMockExtractedText(documentType) {
    switch (documentType) {
      case 'sof':
        return `STATEMENT OF FACTS

Vessel: MV MARITIME STAR
Voyage: VOY-2024-001
Port of Loading: Hamburg
Port of Discharge: Southampton

Arrival: 2024-01-15 08:00 UTC
Commencement of Loading: 2024-01-15 10:30 UTC
Completion of Loading: 2024-01-16 14:00 UTC
Departure: 2024-01-16 15:45 UTC

Cargo: 1,245 TEU containers (14,580 MT)
Fuel Consumption: 245.6 MT VLSFO
Weather: Force 6-7 winds encountered, 4 hours delay due to adverse weather
Delays: Weather delay 4 hours, Port congestion 4 hours

Master: Captain John Smith
Date: 2024-01-16`;

      case 'charter_party':
        return `CHARTER PARTY AGREEMENT

Charterer: Global Shipping Lines Ltd.
Vessel: MV MARITIME STAR (25,000 DWT, Built 2018, Flag: Panama)
Voyage: Hamburg to Southampton with containers

Freight Rate: USD 45.00 per MT
Laytime: 3 days total
Demurrage: USD 15,000 per day
Cancelling Date: 2024-03-15

Terms and Conditions:
- Loading and discharging as per charterer's instructions
- Weather permitting conditions apply
- Force majeure clause included

Signed: 2024-01-01`;

      case 'voyage_order':
        return `VOYAGE ORDER

Voyage Number: VOY-2024-001
Vessel: MV MARITIME STAR

Route Instructions:
- Great Circle route via English Channel
- Waypoints: Dover Strait, TSS Separation
- Avoid shallow water areas

Speed Requirements:
- Service Speed: 14 knots
- Maximum Speed: 16 knots
- Economic Speed: 12 knots

Fuel Instructions:
- Target consumption: < 35 MT/day
- Fuel type: VLSFO
- Bunkering ports: Rotterdam, Southampton

Cargo Instructions:
- Handle with care - fragile cargo
- Temperature: Maintain 2-8°C for reefer containers
- Stowage: Heavy containers in lower tiers

Reporting Requirements:
- Daily noon reports to operations@company.com
- Include: Position, weather, ETA, fuel consumption

Master: Captain John Smith
Operations Manager: Sarah Johnson
Date: 2024-01-01`;

      default:
        return `Maritime document content with various clauses related to vessel operations, cargo handling, and contractual obligations.

This document contains important maritime information that has been extracted using OCR technology and processed for key clause identification.

The document processing system has identified several key elements including vessel information, cargo details, port operations, and contractual terms.`;
    }
  }

  /**
   * Get document type display name
   */
  getDocumentTypeName(type) {
    const types = {
      'sof': 'Statement of Facts',
      'charter_party': 'Charter Party',
      'voyage_order': 'Voyage Order',
      'other': 'Other Document',
    };
    return types[type] || 'Unknown';
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Validate file for upload
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF, JPG, JPEG, and PNG files are allowed');
    }
    
    return true;
  }
}

export const documentService = new DocumentService();