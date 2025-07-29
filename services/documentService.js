import Document from '../models/mongo/document.model.js';
import Embedding from '../models/mongo/embedding.model.js';
import { validateFileType } from '../utils/validators.js';

class DocumentService {
  async createDocument({ userId, title, fileType, cloudReferenceUrl, parserMetadata = {} }) {
    // Validate file type
    if (!validateFileType(`dummy.${fileType}`)) {
      throw new Error('Invalid file type. Supported types: pdf, docx, xlsx, txt');
    }

    // Validate URL
    try {
      new URL(cloudReferenceUrl);
    } catch {
      throw new Error('Invalid cloud reference URL');
    }

    const document = await Document.create({
      userId,
      title: title.trim(),
      fileType,
      cloudReferenceUrl,
      parserMetadata
    });

    return document;
  }

  async getUserDocuments(userId, { page = 1, limit = 10, search = '', sort = '-createdAt' }) {
    const query = { userId };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const total = await Document.countDocuments(query);
    const skip = (page - 1) * limit;
    
    const documents = await Document.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      documents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getDocumentById(documentId, userId) {
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  }

  async updateDocument(documentId, userId, updateData) {
    const allowedUpdates = ['title', 'parserMetadata'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        filteredUpdates[key] = updateData[key];
      }
    }

    const document = await Document.findOneAndUpdate(
      { _id: documentId, userId },
      filteredUpdates,
      { new: true }
    );

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  }

  async deleteDocument(documentId, userId) {
    const document = await Document.findOneAndDelete({ _id: documentId, userId });
    if (!document) {
      throw new Error('Document not found');
    }

    // Delete associated embeddings
    await this.deleteDocumentEmbeddings(documentId);

    return document;
  }

  async deleteDocumentEmbeddings(documentId) {
    await Embedding.deleteMany({ documentId });
  }

  async createEmbedding({ documentId, chunkIndex, vector, chunkText }) {
    const embedding = await Embedding.create({
      documentId,
      chunkIndex,
      vector,
      chunkText
    });

    return embedding;
  }

  async getDocumentEmbeddings(documentId) {
    const embeddings = await Embedding.find({ documentId }).sort({ chunkIndex: 1 });
    return embeddings;
  }

  async searchDocumentsByContent(userId, query, limit = 10) {
    // This is a basic text search - in production, you'd use vector similarity
    const documents = await Document.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { 'parserMetadata.content': { $regex: query, $options: 'i' } }
      ]
    }).limit(limit);

    return documents;
  }

  async getDocumentStats(userId) {
    const stats = await Document.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
          fileTypes: { $push: "$fileType" }
        }
      }
    ]);

    if (!stats[0]) {
      return { totalDocuments: 0, fileTypeStats: {} };
    }

    const fileTypeStats = {};
    stats[0].fileTypes.forEach(type => {
      fileTypeStats[type] = (fileTypeStats[type] || 0) + 1;
    });

    return {
      totalDocuments: stats[0].totalDocuments,
      fileTypeStats
    };
  }

  async processDocumentForEmbedding(documentId) {
    // This would integrate with the Python service for processing
    // For now, return a placeholder response
    return {
      status: 'processing',
      message: 'Document queued for embedding processing'
    };
  }
}

export default new DocumentService();