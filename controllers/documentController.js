import Document from '../models/mongo/document.model.js';
import { validateFileType, validateObjectId } from '../utils/validators.js';
import { asyncHandler, createResponse, parseQueryParams, paginate, calculatePagination } from '../utils/helpers.js';

// @desc    Get all documents for user
// @route   GET /api/documents
// @access  Private
export const getDocuments = asyncHandler(async (req, res) => {
  const { page, limit, sort, search } = parseQueryParams(req);
  
  // Build query
  const query = { userId: req.user.id };
  
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const total = await Document.countDocuments(query);
  
  const documents = await paginate(
    Document.find(query).sort(sort),
    page,
    limit
  );

  const pagination = calculatePagination(total, page, limit);

  res.json(createResponse(true, {
    documents,
    pagination
  }));
});

// @desc    Get specific document
// @route   GET /api/documents/:documentId
// @access  Private
export const getDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  if (!validateObjectId(documentId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid document ID'));
  }

  const document = await Document.findOne({
    _id: documentId,
    userId: req.user.id
  });

  if (!document) {
    return res.status(404).json(createResponse(false, null, 'Document not found'));
  }

  res.json(createResponse(true, { document }));
});

// @desc    Upload/Create new document
// @route   POST /api/documents
// @access  Private
export const createDocument = asyncHandler(async (req, res) => {
  const { title, fileType, cloudReferenceUrl, parserMetadata } = req.body;

  // Validate required fields
  if (!title || !fileType || !cloudReferenceUrl) {
    return res.status(400).json(createResponse(false, null, 'Title, file type, and cloud reference URL are required'));
  }

  // Validate file type
  if (!validateFileType(`dummy.${fileType}`)) {
    return res.status(400).json(createResponse(false, null, 'Invalid file type. Supported types: pdf, docx, xlsx, txt'));
  }

  // Validate URL format (basic check)
  try {
    new URL(cloudReferenceUrl);
  } catch {
    return res.status(400).json(createResponse(false, null, 'Invalid cloud reference URL'));
  }

  const document = await Document.create({
    userId: req.user.id,
    title: title.trim(),
    fileType,
    cloudReferenceUrl,
    parserMetadata: parserMetadata || {}
  });

  res.status(201).json(createResponse(true, { document }));
});

// @desc    Update document
// @route   PUT /api/documents/:documentId
// @access  Private
export const updateDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { title, parserMetadata } = req.body;

  if (!validateObjectId(documentId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid document ID'));
  }

  // Build update object
  const updateData = {};
  
  if (title) {
    updateData.title = title.trim();
  }
  
  if (parserMetadata) {
    updateData.parserMetadata = parserMetadata;
  }

  const document = await Document.findOneAndUpdate(
    { _id: documentId, userId: req.user.id },
    updateData,
    { new: true }
  );

  if (!document) {
    return res.status(404).json(createResponse(false, null, 'Document not found'));
  }

  res.json(createResponse(true, { document }));
});

// @desc    Delete document
// @route   DELETE /api/documents/:documentId
// @access  Private
export const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  if (!validateObjectId(documentId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid document ID'));
  }

  const document = await Document.findOneAndDelete({
    _id: documentId,
    userId: req.user.id
  });

  if (!document) {
    return res.status(404).json(createResponse(false, null, 'Document not found'));
  }

  // TODO: In production, also delete from cloud storage and vector database
  // TODO: Delete associated embeddings

  res.json(createResponse(true, { message: 'Document deleted successfully' }));
});

// @desc    Get document statistics
// @route   GET /api/documents/stats
// @access  Private
export const getDocumentStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Document.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        totalDocuments: { $sum: 1 },
        fileTypes: {
          $push: "$fileType"
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalDocuments: 1,
        fileTypeStats: {
          $reduce: {
            input: "$fileTypes",
            initialValue: {},
            in: {
              $mergeObjects: [
                "$$value",
                {
                  $arrayToObject: [
                    [
                      {
                        k: "$$this",
                        v: {
                          $add: [
                            { $ifNull: [{ $getField: { field: "$$this", input: "$$value" } }, 0] },
                            1
                          ]
                        }
                      }
                    ]
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]);

  const result = stats[0] || { totalDocuments: 0, fileTypeStats: {} };

  res.json(createResponse(true, { stats: result }));
});

export default {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats
};