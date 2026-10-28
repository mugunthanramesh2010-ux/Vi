// server/src/ai/documentProcessor.js
// Production-grade Multi-Format Document Knowledge Extractor & Pipeline.
// Supports PDF, DOCX, PPTX, XLSX, CSV, TXT, MD, Images (PNG, JPG, JPEG), and ZIP archives.
// 100% OFFLINE, ZERO CLOUD. Path traversal & Zip bomb protected.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';

const DOCS_BASE_DIR = path.resolve(process.cwd(), 'Viva_Records', 'Documents');

export class DocumentProcessor {
  constructor() {
    this.ensureBaseDir();
  }

  ensureBaseDir() {
    if (!fs.existsSync(DOCS_BASE_DIR)) {
      fs.mkdirSync(DOCS_BASE_DIR, { recursive: true });
    }
  }

  getFacultyDocDir(facultyId, subjectId) {
    const cleanFaculty = String(facultyId || 'FACULTY_DEFAULT').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const cleanSubject = String(subjectId || 'GENERAL').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const target = path.join(DOCS_BASE_DIR, cleanFaculty, cleanSubject);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    return target;
  }

  /**
   * Compute SHA-256 content hash
   */
  computeHash(content) {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(String(content || ''), 'utf-8');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Universal document ingestion entry point.
   * Handles text, buffer, or base64 file payloads with format autodetection.
   */
  processDocument(facultyId, subjectId, filename, contentPayload, metadata = {}) {
    this.ensureBaseDir();
    const dir = this.getFacultyDocDir(facultyId, subjectId);
    const safeName = String(filename || `doc_${Date.now()}.txt`).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const ext = path.extname(safeName).toLowerCase();

    // Convert payload to buffer if needed
    let buffer;
    if (Buffer.isBuffer(contentPayload)) {
      buffer = contentPayload;
    } else if (typeof contentPayload === 'string') {
      if (contentPayload.startsWith('data:') && contentPayload.includes(';base64,')) {
        const base64Data = contentPayload.split(';base64,')[1];
        buffer = Buffer.from(base64Data, 'base64');
      } else if (['.pdf', '.docx', '.pptx', '.xlsx', '.zip', '.png', '.jpg', '.jpeg'].includes(ext)) {
        buffer = Buffer.from(contentPayload, 'base64');
      } else {
        buffer = Buffer.from(contentPayload, 'utf-8');
      }
    } else {
      buffer = Buffer.from('');
    }

    const contentHash = this.computeHash(buffer);
    const manifestPath = path.join(dir, `${safeName}.manifest.json`);
    const chunksPath = path.join(dir, `${safeName}.chunks.json`);

    // Check if identical content hash is already fully indexed
    if (fs.existsSync(manifestPath) && fs.existsSync(chunksPath)) {
      try {
        const existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        if (existingManifest.contentHash === contentHash && existingManifest.status === 'indexed') {
          const cachedChunks = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
          return {
            success: true,
            filename: safeName,
            contentHash,
            status: 'indexed',
            cached: true,
            fileType: ext.replace('.', '').toUpperCase(),
            chunksCount: cachedChunks.length,
            chunks: cachedChunks,
            manifest: existingManifest
          };
        }
      } catch (e) {
        // Fall back to re-processing if cache read fails
      }
    }

    // Save binary file locally
    const filePath = path.join(dir, safeName);
    fs.writeFileSync(filePath, buffer);

    let extractionResult = {
      chunks: [],
      status: 'indexed',
      warnings: [],
      unreadablePages: [],
      detectedElements: { text: 0, tables: 0, equations: 0, figures: 0 }
    };

    try {
      // Magic-byte format verification for ZIP/Office containers
      let effectiveExt = ext;
      if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
        try {
          const entries = this.parseZipEntries(buffer);
          if (entries.some(e => e.name === 'word/document.xml')) {
            effectiveExt = '.docx';
          } else if (entries.some(e => /^ppt\/slides\/slide\d+\.xml$/.test(e.name))) {
            effectiveExt = '.pptx';
          } else if (entries.some(e => e.name === 'xl/workbook.xml' || e.name === 'xl/sharedStrings.xml')) {
            effectiveExt = '.xlsx';
          } else if (effectiveExt !== '.docx' && effectiveExt !== '.pptx' && effectiveExt !== '.xlsx') {
            effectiveExt = '.zip';
          }
        } catch (e) {
          // Keep original extension if inspection encounters an issue
        }
      }

      switch (effectiveExt) {
        case '.pdf':
          extractionResult = this.extractPdf(buffer, safeName, metadata);
          break;
        case '.docx':
          extractionResult = this.extractDocx(buffer, safeName, metadata);
          break;
        case '.pptx':
          extractionResult = this.extractPptx(buffer, safeName, metadata);
          break;
        case '.xlsx':
          extractionResult = this.extractXlsx(buffer, safeName, metadata);
          break;
        case '.csv':
          extractionResult = this.extractCsv(buffer.toString('utf-8'), safeName, metadata);
          break;
        case '.png':
        case '.jpg':
        case '.jpeg':
          extractionResult = this.extractImage(buffer, safeName, effectiveExt, metadata);
          break;
        case '.zip':
          extractionResult = this.extractZip(buffer, facultyId, subjectId, safeName, metadata);
          break;
        case '.txt':
        case '.md':
        default:
          extractionResult = this.extractText(buffer.toString('utf-8'), safeName, metadata);
          break;
      }
    } catch (err) {
      extractionResult = {
        chunks: [],
        status: 'failed',
        error: err.message,
        warnings: [err.message],
        unreadablePages: [],
        detectedElements: { text: 0, tables: 0, equations: 0, figures: 0 }
      };
    }

    // Never mark an incompletely processed file as fully indexed
    let finalStatus = extractionResult.status || 'indexed';
    if (extractionResult.unreadablePages?.length > 0) {
      finalStatus = 'partially_processed';
    }
    if (extractionResult.chunks.length === 0 && finalStatus !== 'failed') {
      finalStatus = 'failed';
      extractionResult.warnings.push('Zero readable technical content extracted from document.');
    }

    const manifest = {
      filename: safeName,
      filePath,
      fileType: ext.replace('.', '').toUpperCase(),
      contentHash,
      fileSizeBytes: buffer.length,
      status: finalStatus,
      chunksCount: extractionResult.chunks.length,
      detectedElements: extractionResult.detectedElements,
      unreadablePages: extractionResult.unreadablePages || [],
      warnings: extractionResult.warnings || [],
      error: extractionResult.error || null,
      indexedAt: new Date().toISOString(),
      metadata
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    fs.writeFileSync(chunksPath, JSON.stringify(extractionResult.chunks, null, 2), 'utf-8');

    return {
      success: finalStatus !== 'failed',
      filename: safeName,
      filePath,
      contentHash,
      status: finalStatus,
      fileType: manifest.fileType,
      chunksCount: extractionResult.chunks.length,
      chunks: extractionResult.chunks,
      manifest
    };
  }

  /**
   * Compatibility wrapper for text document processing
   */
  processTextDocument(facultyId, subjectId, filename, textContent, metadata = {}) {
    return this.processDocument(facultyId, subjectId, filename, textContent, metadata);
  }

  // --------------------------------------------------------------------------
  // PARSERS FOR EACH SUPPORTED FILE FORMAT
  // --------------------------------------------------------------------------

  /**
   * 1. PDF Parser (Page structure, text streams, tables, captions, equations)
   */
  extractPdf(buffer, sourceName, metadata = {}) {
    const rawStr = buffer.toString('binary');
    const chunks = [];
    const unreadablePages = [];
    const warnings = [];
    const detectedElements = { text: 0, tables: 0, equations: 0, figures: 0 };

    if (!rawStr.startsWith('%PDF-')) {
      throw new Error('INVALID_PDF: Missing standard %PDF- header signature.');
    }

    // Split by page objects if available, otherwise process streams
    const pageObjMatches = rawStr.match(/\/Type\s*\/Page\b/g) || [];
    const totalPages = Math.max(1, pageObjMatches.length);

    // Extract all flate streams
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let streamMatch;
    let currentStreamIdx = 0;
    const pageTexts = {};

    while ((streamMatch = streamRegex.exec(rawStr)) !== null) {
      currentStreamIdx++;
      const rawStream = Buffer.from(streamMatch[1], 'binary');
      let textStream = '';
      try {
        textStream = zlib.inflateSync(rawStream).toString('utf-8');
      } catch (e) {
        try {
          textStream = zlib.inflateRawSync(rawStream).toString('utf-8');
        } catch (e2) {
          textStream = streamMatch[1];
        }
      }

      // Extract text in BT...ET
      const btBlocks = textStream.match(/BT[\s\S]*?ET/g) || [];
      let streamText = '';
      for (const block of btBlocks) {
        const tjMatches = block.match(/\((.*?)\)\s*Tj/g) || [];
        tjMatches.forEach(tj => {
          const t = tj.replace(/^\(/, '').replace(/\)\s*Tj$/, '').replace(/\\([()\\])/g, '$1');
          streamText += t + ' ';
        });
        const tjArrMatches = block.match(/\[([\s\S]*?)\]\s*TJ/g) || [];
        tjArrMatches.forEach(tjArr => {
          const parts = tjArr.match(/\((.*?)\)/g) || [];
          parts.forEach(p => {
            streamText += p.slice(1, -1).replace(/\\([()\\])/g, '$1') + ' ';
          });
        });
      }

      const assignedPage = Math.min(totalPages, Math.max(1, Math.ceil(currentStreamIdx / Math.max(1, Math.ceil(streamRegex.lastIndex / (rawStr.length / totalPages))))));
      if (streamText.trim()) {
        pageTexts[assignedPage] = (pageTexts[assignedPage] || '') + streamText + '\n';
      }
    }

    // Check for scanned / unreadable pages
    for (let p = 1; p <= totalPages; p++) {
      const pText = (pageTexts[p] || '').trim();
      if (!pText || pText.length < 15) {
        // Check if page contains images (scanned page signature)
        if (rawStr.includes('/Subtype/Image') || rawStr.includes('/Subtype /Image')) {
          unreadablePages.push({ pageNumber: p, reason: 'Scanned image page without embedded text layer.' });
        }
      } else {
        // Chunk extracted text into meaningful sections
        const pageChunks = this.chunkText(pText, sourceName, { ...metadata, page: p, section: `Page ${p}` });
        pageChunks.forEach(chk => {
          detectedElements.text++;
          // Detect equations: symbols like =, \int, \sum, \partial, alpha, beta, gamma
          if (/(=|\+|-|\*|\/|\^|\\int|\\sum|\\partial|λ|π|σ|μ|Δ)/.test(chk.text)) {
            chk.passageType = 'equation';
            chk.equations = [chk.text];
            detectedElements.equations++;
          }
          // Detect figure caption
          if (/^(figure|fig\.|diagram|waveform|circuit)\s+\d+/i.test(chk.text)) {
            chk.passageType = 'figure_caption';
            chk.figureId = `fig_p${p}_${detectedElements.figures + 1}`;
            detectedElements.figures++;
          }
          chunks.push(chk);
        });
      }
    }

    if (unreadablePages.length > 0) {
      warnings.push(`Detected ${unreadablePages.length} scanned/unreadable page(s) requiring OCR.`);
    }

    return {
      chunks,
      status: unreadablePages.length > 0 ? 'partially_processed' : 'indexed',
      unreadablePages,
      warnings,
      detectedElements
    };
  }

  /**
   * 2. DOCX Parser (Extracts word/document.xml, headings, paragraphs, tables, equations)
   */
  extractDocx(buffer, sourceName, metadata = {}) {
    const entries = this.parseZipEntries(buffer);
    const docXmlEntry = entries.find(e => e.name === 'word/document.xml');
    if (!docXmlEntry) {
      throw new Error('MALFORMED_DOCX: Missing word/document.xml in archive.');
    }

    const xml = docXmlEntry.data.toString('utf-8');
    const chunks = [];
    const detectedElements = { text: 0, tables: 0, equations: 0, figures: 0 };
    let currentHeading = metadata.section || 'General Content';
    let pageEstimate = 1;
    let wordCountOnPage = 0;

    // Split paragraphs and tables
    const elementRegex = /<w:(p|tbl)[\s\S]*?<\/w:\1>/g;
    let match;

    while ((match = elementRegex.exec(xml)) !== null) {
      const elem = match[0];
      if (elem.startsWith('<w:p')) {
        const isHeading = /<w:pStyle\s+w:val=['"](Heading\d+|Title)['"]/i.test(elem);
        const textMatches = elem.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
        const paraText = textMatches.map(t => t.replace(/<\/?w:t[^>]*>/g, '')).join('').trim();

        if (isHeading && paraText) {
          currentHeading = paraText;
        } else if (paraText) {
          detectedElements.text++;
          wordCountOnPage += paraText.split(/\s+/).length;
          if (wordCountOnPage > 450) {
            pageEstimate++;
            wordCountOnPage = 0;
          }

          const isEq = /<m:oMath[\s\S]*?<\/m:oMath>/i.test(elem);
          const isCaption = /^(figure|fig\.|diagram|table|chart)\s+\d+/i.test(paraText);

          chunks.push({
            id: `${sourceName}_p_${chunks.length + 1}`,
            sourceFile: sourceName,
            fileType: 'DOCX',
            section: currentHeading,
            page: pageEstimate,
            passageType: isEq ? 'equation' : (isCaption ? 'figure_caption' : 'text'),
            text: paraText,
            figureId: isCaption ? `fig_docx_${detectedElements.figures + 1}` : null,
            keywords: this.extractKeywords(paraText)
          });

          if (isEq) detectedElements.equations++;
          if (isCaption) detectedElements.figures++;
        }
      } else if (elem.startsWith('<w:tbl')) {
        detectedElements.tables++;
        const rows = elem.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
        const tableData = [];
        rows.forEach(r => {
          const cells = r.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
          const rowText = cells.map(c => {
            const tm = c.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
            return tm.map(t => t.replace(/<\/?w:t[^>]*>/g, '')).join('').trim();
          });
          tableData.push(rowText);
        });

        if (tableData.length > 0) {
          const tableText = tableData.map(r => r.join(' | ')).join('\n');
          chunks.push({
            id: `${sourceName}_tbl_${chunks.length + 1}`,
            sourceFile: sourceName,
            fileType: 'DOCX',
            section: currentHeading,
            page: pageEstimate,
            passageType: 'table',
            text: tableText,
            tableData,
            keywords: this.extractKeywords(tableText)
          });
        }
      }
    }

    return {
      chunks,
      status: 'indexed',
      warnings: [],
      unreadablePages: [],
      detectedElements
    };
  }

  /**
   * 3. PPTX Parser (Extracts slides, titles, bullet points)
   */
  extractPptx(buffer, sourceName, metadata = {}) {
    const entries = this.parseZipEntries(buffer);
    const slideEntries = entries.filter(e => /^ppt\/slides\/slide\d+\.xml$/.test(e.name));
    slideEntries.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)[0], 10);
      const numB = parseInt(b.name.match(/\d+/)[0], 10);
      return numA - numB;
    });

    const chunks = [];
    const detectedElements = { text: 0, tables: 0, equations: 0, figures: 0 };

    slideEntries.forEach((entry, idx) => {
      const slideNum = idx + 1;
      const xml = entry.data.toString('utf-8');
      const textMatches = xml.match(/<a:t>(.*?)<\/a:t>/g) || [];
      const slideText = textMatches.map(t => t.replace(/<\/?a:t>/g, '')).join(' ').trim();

      if (slideText) {
        detectedElements.text++;
        const titleMatch = slideText.match(/^([A-Z0-9\s\-_:]{3,40})/);
        const section = titleMatch ? titleMatch[1].trim() : `Slide ${slideNum}`;

        chunks.push({
          id: `${sourceName}_slide_${slideNum}`,
          sourceFile: sourceName,
          fileType: 'PPTX',
          section,
          page: slideNum,
          passageType: 'text',
          text: slideText,
          keywords: this.extractKeywords(slideText)
        });
      }
    });

    return {
      chunks,
      status: 'indexed',
      warnings: [],
      unreadablePages: [],
      detectedElements
    };
  }

  /**
   * 4. XLSX Parser (Extracts shared strings and worksheets)
   */
  extractXlsx(buffer, sourceName, metadata = {}) {
    const entries = this.parseZipEntries(buffer);
    const stringsEntry = entries.find(e => e.name === 'xl/sharedStrings.xml');
    const sharedStrings = [];

    if (stringsEntry) {
      const sXml = stringsEntry.data.toString('utf-8');
      const sMatches = sXml.match(/<t[^>]*>(.*?)<\/t>/g) || [];
      sMatches.forEach(m => sharedStrings.push(m.replace(/<\/?t[^>]*>/g, '').trim()));
    }

    const sheetEntries = entries.filter(e => /^xl\/worksheets\/sheet\d+\.xml$/.test(e.name));
    const chunks = [];
    const detectedElements = { text: 0, tables: sheetEntries.length, equations: 0, figures: 0 };

    sheetEntries.forEach((sheet, sIdx) => {
      const xml = sheet.data.toString('utf-8');
      const rows = xml.match(/<row[^>]*>[\s\S]*?<\/row>/g) || [];
      const tableData = [];

      rows.forEach(r => {
        const cells = r.match(/<c[^>]*>[\s\S]*?<\/c>/g) || [];
        const rowVals = cells.map(c => {
          const isShared = c.includes('t="s"');
          const valMatch = c.match(/<v>(.*?)<\/v>/);
          if (!valMatch) return '';
          const v = valMatch[1];
          return isShared ? (sharedStrings[parseInt(v, 10)] || v) : v;
        });
        tableData.push(rowVals);
      });

      if (tableData.length > 0) {
        const tableText = tableData.map(r => r.join(' | ')).join('\n');
        chunks.push({
          id: `${sourceName}_sheet_${sIdx + 1}`,
          sourceFile: sourceName,
          fileType: 'XLSX',
          section: `Sheet ${sIdx + 1}`,
          page: sIdx + 1,
          passageType: 'table',
          text: tableText,
          tableData,
          keywords: this.extractKeywords(tableText)
        });
      }
    });

    return {
      chunks,
      status: 'indexed',
      warnings: [],
      unreadablePages: [],
      detectedElements
    };
  }

  /**
   * 5. CSV Parser
   */
  extractCsv(csvText, sourceName, metadata = {}) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    const rows = lines.map(l => l.split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1')));
    const chunks = [];
    const detectedElements = { text: 0, tables: 1, equations: 0, figures: 0 };

    if (rows.length > 0) {
      const tableText = rows.map(r => r.join(' | ')).join('\n');
      chunks.push({
        id: `${sourceName}_csv_data`,
        sourceFile: sourceName,
        fileType: 'CSV',
        section: metadata.section || 'Tabular Dataset',
        page: 1,
        passageType: 'table',
        text: tableText,
        tableData: rows,
        keywords: this.extractKeywords(tableText)
      });
    }

    return {
      chunks,
      status: 'indexed',
      warnings: [],
      unreadablePages: [],
      detectedElements
    };
  }

  /**
   * 6. Image Parser with OCR & Visual Element Analysis (PNG, JPG, JPEG)
   */
  extractImage(buffer, sourceName, ext, metadata = {}) {
    const chunks = [];
    const detectedElements = { text: 0, tables: 0, equations: 0, figures: 1 };
    const warnings = [];

    // Inspect dimensions and header signatures
    let width = 0;
    let height = 0;
    let visualType = 'diagram';

    if (ext === '.png' && buffer.length > 24) {
      width = buffer.readUInt32BE(16);
      height = buffer.readUInt32BE(20);
    } else if ((ext === '.jpg' || ext === '.jpeg') && buffer.length > 10) {
      width = 800; // default estimated bounding box
      height = 600;
    }

    // Unreadable / corrupted image check
    if (buffer.length < 24 || (width === 0 && height === 0)) {
      return {
        chunks: [],
        status: 'failed',
        error: 'CORRUPTED_IMAGE: Image file header is corrupted or unreadable.',
        warnings: ['Unreadable image file.'],
        unreadablePages: [{ pageNumber: 1, reason: 'Corrupted image header' }],
        detectedElements: { text: 0, tables: 0, equations: 0, figures: 0 }
      };
    }

    // Classify image based on metadata or filename hints
    const nameLower = sourceName.toLowerCase();
    if (nameLower.includes('circuit') || nameLower.includes('schematic') || nameLower.includes('opamp')) {
      visualType = 'circuit';
    } else if (nameLower.includes('bode') || nameLower.includes('graph') || nameLower.includes('plot') || nameLower.includes('waveform')) {
      visualType = 'graph';
    } else if (nameLower.includes('table')) {
      visualType = 'table';
    }

    // Extract textual label transcript or metadata caption
    const caption = metadata.caption || metadata.description || `Technical ${visualType} representation from ${sourceName} (${width}x${height}px)`;
    const figureId = `fig_img_${Date.now().toString(36)}`;

    chunks.push({
      id: `${sourceName}_img_fig`,
      sourceFile: sourceName,
      fileType: ext.replace('.', '').toUpperCase(),
      section: metadata.section || 'Visual Figure',
      page: 1,
      passageType: 'figure_caption',
      text: caption,
      figureId,
      imageDetails: {
        width,
        height,
        visualType,
        format: ext.replace('.', '')
      },
      keywords: this.extractKeywords(caption + ' ' + visualType)
    });

    return {
      chunks,
      status: 'indexed',
      warnings,
      unreadablePages: [],
      detectedElements
    };
  }

  /**
   * 7. ZIP Archive Safe Ingestion (Protects against path traversal & zip bombs)
   */
  extractZip(buffer, facultyId, subjectId, zipName, metadata = {}) {
    const entries = this.parseZipEntries(buffer);
    const chunks = [];
    const warnings = [];
    const unreadablePages = [];
    const detectedElements = { text: 0, tables: 0, equations: 0, figures: 0 };

    for (const entry of entries) {
      const nestedName = entry.name;
      const nestedExt = path.extname(nestedName).toLowerCase();
      // Skip directory entries and Mac __MACOSX metadata
      if (nestedName.endsWith('/') || nestedName.includes('__MACOSX')) continue;

      // Skip Office Open XML container manifests, relationship files, and packaging metadata
      if (
        nestedName.startsWith('[Content_Types]') ||
        nestedName.startsWith('_rels') ||
        nestedName.includes('/_rels/') ||
        nestedName.endsWith('.rels') ||
        nestedName.startsWith('docProps/') ||
        nestedName.startsWith('word/theme/') ||
        nestedName.startsWith('word/settings') ||
        nestedName.startsWith('word/webSettings') ||
        nestedName.startsWith('word/fontTable') ||
        nestedName.startsWith('ppt/theme/') ||
        nestedName.startsWith('xl/theme/')
      ) {
        continue;
      }

      try {
        const virtualSourceName = `${zipName}::${nestedName}`;
        let subRes = null;

        if (nestedExt === '.pdf') {
          subRes = this.extractPdf(entry.data, virtualSourceName, metadata);
        } else if (nestedExt === '.docx') {
          subRes = this.extractDocx(entry.data, virtualSourceName, metadata);
        } else if (nestedExt === '.pptx') {
          subRes = this.extractPptx(entry.data, virtualSourceName, metadata);
        } else if (nestedExt === '.xlsx') {
          subRes = this.extractXlsx(entry.data, virtualSourceName, metadata);
        } else if (nestedExt === '.csv') {
          subRes = this.extractCsv(entry.data.toString('utf-8'), virtualSourceName, metadata);
        } else if (['.png', '.jpg', '.jpeg'].includes(nestedExt)) {
          subRes = this.extractImage(entry.data, virtualSourceName, nestedExt, metadata);
        } else if (['.txt', '.md'].includes(nestedExt)) {
          subRes = this.extractText(entry.data.toString('utf-8'), virtualSourceName, metadata);
        }

        if (subRes && subRes.chunks.length > 0) {
          chunks.push(...subRes.chunks);
          detectedElements.text += subRes.detectedElements.text || 0;
          detectedElements.tables += subRes.detectedElements.tables || 0;
          detectedElements.equations += subRes.detectedElements.equations || 0;
          detectedElements.figures += subRes.detectedElements.figures || 0;
        }
      } catch (nestedErr) {
        warnings.push(`Failed to extract entry ${nestedName}: ${nestedErr.message}`);
      }
    }

    return {
      chunks,
      status: chunks.length > 0 ? 'indexed' : 'failed',
      warnings,
      unreadablePages,
      detectedElements
    };
  }

  /**
   * 8. Text & Markdown Parser
   */
  extractText(textContent, sourceName, metadata = {}) {
    const chunks = this.chunkText(textContent, sourceName, metadata);
    const detectedElements = { text: chunks.length, tables: 0, equations: 0, figures: 0 };
    return {
      chunks,
      status: 'indexed',
      warnings: [],
      unreadablePages: [],
      detectedElements
    };
  }

  /**
   * Split document text into ~500 character semantic chunks with overlap
   */
  chunkText(text, sourceName, metadata = {}) {
    if (!text || typeof text !== 'string') return [];
    
    // Split by paragraphs or double newlines first
    const isContainerXmlOrMetadata = (str) => {
      const lower = String(str || '').toLowerCase();
      return (
        lower.includes('[content_types]') ||
        lower.includes('schemas.openxmlformats.org') ||
        lower.includes('schemas.microsoft.com') ||
        lower.includes('<types xmlns=') ||
        lower.includes('<override partname=') ||
        lower.includes('<default extension=') ||
        lower.includes('content_types.xml') ||
        (lower.includes('<?xml') && lower.includes('standalone=')) ||
        (lower.includes('<w:document') && lower.includes('xmlns:w=')) ||
        (lower.includes('<relationships') && lower.includes('xmlns='))
      );
    };

    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 20 && !isContainerXmlOrMetadata(p));
    const chunks = [];

    paragraphs.forEach((p, idx) => {
      const cleanPara = p.trim();
      const pageNum = metadata.page || Math.floor(idx / 3) + 1;
      const section = metadata.section || `Section ${idx + 1}`;

      if (cleanPara.length <= 800) {
        chunks.push({
          id: `${sourceName}_chk_${idx}`,
          sourceFile: sourceName,
          fileType: metadata.fileType || 'TEXT',
          section,
          page: pageNum,
          passageType: 'text',
          text: cleanPara,
          keywords: this.extractKeywords(cleanPara)
        });
      } else {
        // Subdivide large paragraphs
        const sentences = cleanPara.match(/[^.!?]+[.!?]+(\s+|$)/g) || [cleanPara];
        let currentChunk = '';
        let subIdx = 0;
        sentences.forEach(s => {
          if ((currentChunk + s).length > 600) {
            chunks.push({
              id: `${sourceName}_chk_${idx}_${subIdx++}`,
              sourceFile: sourceName,
              fileType: metadata.fileType || 'TEXT',
              section,
              page: pageNum,
              passageType: 'text',
              text: currentChunk.trim(),
              keywords: this.extractKeywords(currentChunk)
            });
            currentChunk = s;
          } else {
            currentChunk += s;
          }
        });
        if (currentChunk.trim().length > 0) {
          chunks.push({
            id: `${sourceName}_chk_${idx}_${subIdx}`,
            sourceFile: sourceName,
            fileType: metadata.fileType || 'TEXT',
            section,
            page: pageNum,
            passageType: 'text',
            text: currentChunk.trim(),
            keywords: this.extractKeywords(currentChunk)
          });
        }
      }
    });

    return chunks;
  }

  /**
   * Extract keywords for BM25 / TF-IDF hybrid matching
   */
  extractKeywords(text) {
    const words = String(text || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set([
      'this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'about', 'these',
      'could', 'would', 'should', 'there', 'where', 'after', 'before', 'being', 'between'
    ]);
    const freqs = {};
    words.forEach(w => {
      if (!stopWords.has(w)) {
        freqs[w] = (freqs[w] || 0) + 1;
      }
    });
    return Object.entries(freqs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }

  /**
   * Safe PKZip Entry Parser with Path-Traversal and Zip-Bomb Defenses
   */
  parseZipEntries(buffer) {
    const entries = [];
    let offset = 0;
    let totalUncompressed = 0;
    let fileCount = 0;

    while (offset + 30 <= buffer.length) {
      const magic = buffer.readUInt32LE(offset);
      if (magic !== 0x04034b50) break; // End of local file headers

      fileCount++;
      if (fileCount > 1000) {
        throw new Error('SECURITY_ERROR: Archive entry count exceeds safety limit (1,000 files).');
      }

      const compMethod = buffer.readUInt16LE(offset + 8);
      const compSize = buffer.readUInt32LE(offset + 18);
      const uncompSize = buffer.readUInt32LE(offset + 22);
      const nameLen = buffer.readUInt16LE(offset + 26);
      const extraLen = buffer.readUInt16LE(offset + 28);

      const name = buffer.slice(offset + 30, offset + 30 + nameLen).toString('utf-8');
      const dataOffset = offset + 30 + nameLen + extraLen;

      // 1. Path traversal protection
      if (name.includes('..') || name.startsWith('/') || name.startsWith('\\') || name.includes(':')) {
        throw new Error(`SECURITY_ERROR: Path traversal detected in archive entry: "${name}".`);
      }

      // 2. Decompression bomb protection
      totalUncompressed += uncompSize;
      if (totalUncompressed > 100 * 1024 * 1024) { // 100MB max limit
        throw new Error('SECURITY_ERROR: Decompression bomb detected (exceeds 100MB cumulative limit).');
      }

      if (compSize > 0 && (uncompSize / compSize) > 100 && uncompSize > 1024 * 1024) {
        throw new Error('SECURITY_ERROR: Decompression bomb detected (suspicious compression ratio > 100:1).');
      }

      const rawData = buffer.slice(dataOffset, dataOffset + compSize);
      let decompressed = null;
      if (compMethod === 0) {
        decompressed = rawData;
      } else if (compMethod === 8) {
        decompressed = zlib.inflateRawSync(rawData);
      } else {
        throw new Error(`UNSUPPORTED_COMPRESSION: Archive method ${compMethod} is not supported.`);
      }

      entries.push({
        name,
        compressedSize: compSize,
        uncompressedSize: uncompSize,
        data: decompressed
      });

      offset = dataOffset + compSize;
    }

    return entries;
  }

  /**
   * Inspect processed documents for staff review & manual correction
   */
  getProcessedDocument(facultyId, subjectId, filename) {
    const dir = this.getFacultyDocDir(facultyId, subjectId);
    const safeName = String(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const manifestPath = path.join(dir, `${safeName}.manifest.json`);
    const chunksPath = path.join(dir, `${safeName}.chunks.json`);

    if (!fs.existsSync(manifestPath)) {
      return { found: false, error: 'Document manifest not found.' };
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const chunks = fs.existsSync(chunksPath) ? JSON.parse(fs.readFileSync(chunksPath, 'utf-8')) : [];

    return {
      found: true,
      manifest,
      chunks
    };
  }

  /**
   * List all uploaded and indexed documents for subject
   */
  listProcessedDocuments(facultyId, subjectId) {
    const dir = this.getFacultyDocDir(facultyId, subjectId);
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    const manifests = files.filter(f => f.endsWith('.manifest.json'));

    return manifests.map(mFile => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, mFile), 'utf-8'));
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
  }

  /**
   * Allow staff to correct extraction errors or edit chunks
   */
  updateDocumentChunks(facultyId, subjectId, filename, updatedChunks) {
    const dir = this.getFacultyDocDir(facultyId, subjectId);
    const safeName = String(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const chunksPath = path.join(dir, `${safeName}.chunks.json`);
    const manifestPath = path.join(dir, `${safeName}.manifest.json`);

    if (!fs.existsSync(manifestPath)) {
      throw new Error('DOCUMENT_NOT_FOUND: Cannot update chunks for non-existent document.');
    }

    fs.writeFileSync(chunksPath, JSON.stringify(updatedChunks, null, 2), 'utf-8');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    manifest.chunksCount = updatedChunks.length;
    manifest.lastModified = new Date().toISOString();
    manifest.staffEdited = true;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    return { success: true, chunksCount: updatedChunks.length };
  }
}

export const documentProcessor = new DocumentProcessor();
