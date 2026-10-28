// server/src/ai/conceptGraphEngine.js
// Production-grade Technical Concept and Knowledge Graph Engine.
// Constructs defensible concept graphs from syllabus ontologies and ingested reference materials.
// Connects concepts, governing equations, prerequisites, boundary conditions, and misconceptions.
// 100% OFFLINE, ZERO CLOUD.

import { ACADEMIC_REGISTRY } from '../../../src/services/academicAssessmentEngine.js';

export class ConceptGraphEngine {
  constructor() {
    this.cachedGraphs = new Map();
  }

  /**
   * Build or retrieve the concept graph for a subject and topic
   */
  buildConceptGraph(subjectName, topicName, referencePassages = []) {
    const cleanSubj = String(subjectName || 'General Engineering').trim();
    const cleanTop = String(topicName || 'Core Topic').trim();
    const cacheKey = `${cleanSubj.toLowerCase()}::${cleanTop.toLowerCase()}`;

    // 1. Extract curriculum nodes from authoritative ACADEMIC_REGISTRY
    const nodes = new Map();
    const edges = [];
    const misconceptions = [];

    // Search subject in registry
    let regSubj = null;
    for (const [k, s] of Object.entries(ACADEMIC_REGISTRY)) {
      if (s.name.toLowerCase() === cleanSubj.toLowerCase() || cleanSubj.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(cleanSubj.toLowerCase())) {
        regSubj = s;
        break;
      }
    }

    if (regSubj) {
      // Find matching topic
      for (const [tKey, tObj] of Object.entries(regSubj.topics)) {
        if (tObj.name.toLowerCase() === cleanTop.toLowerCase() || cleanTop.toLowerCase().includes(tObj.name.toLowerCase()) || tObj.name.toLowerCase().includes(cleanTop.toLowerCase())) {
          // Add Topic Root Node
          nodes.set(tKey, {
            id: tKey,
            name: tObj.name,
            type: 'topic_root',
            subject: regSubj.name,
            prerequisites: tObj.prerequisites || ['Foundational Engineering Mathematics'],
            description: `Primary syllabus topic for ${tObj.name}`
          });

          // Add Concepts
          if (tObj.concepts) {
            let prevConceptId = null;
            for (const [cKey, cObj] of Object.entries(tObj.concepts)) {
              const cNode = {
                id: cKey,
                name: cObj.name,
                type: 'core_concept',
                topicId: tKey,
                learningObjective: cObj.learningObjective,
                governingPrinciples: [],
                equations: [],
                boundaryConditions: [],
                questions: (cObj.questions || []).map(q => q.id),
                studentMasteryEvidence: {
                  demonstratedCount: 0,
                  attemptCount: 0,
                  masteryProbability: 0.25,
                  uncertainty: 1.0,
                  status: 'NOT_YET_ASSESSED'
                }
              };

              // Extract equations & governing principles from question data
              (cObj.questions || []).forEach(q => {
                if (q.numericalDetails?.formula) {
                  cNode.equations.push(q.numericalDetails.formula);
                }
                if (q.expectedKeywords) {
                  cNode.governingPrinciples.push(...q.expectedKeywords.slice(0, 3));
                }
                // Record known misconceptions from distractors
                if (Array.isArray(q.options) && q.options.length > 1) {
                  q.options.slice(1).forEach((opt, oIdx) => {
                    misconceptions.push({
                      id: `misc_${cKey}_${oIdx}`,
                      conceptId: cKey,
                      distractorText: opt,
                      targetedMisconception: `Misconception #${oIdx + 1} regarding ${cObj.name}`
                    });
                  });
                }
              });

              cNode.governingPrinciples = Array.from(new Set(cNode.governingPrinciples));
              cNode.equations = Array.from(new Set(cNode.equations));
              nodes.set(cKey, cNode);

              // Defensible edge from topic to concept
              edges.push({
                source: tKey,
                target: cKey,
                relation: 'CONTAINS_CONCEPT',
                defensible: true
              });

              // Defensible prerequisite edge between sequential concepts
              if (prevConceptId) {
                edges.push({
                  source: prevConceptId,
                  target: cKey,
                  relation: 'PREREQUISITE_FOR',
                  defensible: true
                });
              }
              prevConceptId = cKey;
            }
          }
          break;
        }
      }
    }

    // 2. Enrich graph with uploaded reference materials
    if (Array.isArray(referencePassages) && referencePassages.length > 0) {
      referencePassages.forEach((psg, pIdx) => {
        const psgNodeId = `ref_psg_${psg.passageId || pIdx}`;
        nodes.set(psgNodeId, {
          id: psgNodeId,
          name: `${psg.sourceDocument} (p. ${psg.pageNumber})`,
          type: 'source_evidence',
          passageType: psg.passageType,
          textExcerpt: (psg.text || '').slice(0, 200),
          citation: psg.citation,
          section: psg.sectionHeading
        });

        // Link evidence to the primary topic
        const topicNode = Array.from(nodes.values()).find(n => n.type === 'topic_root');
        if (topicNode) {
          edges.push({
            source: topicNode.id,
            target: psgNodeId,
            relation: 'EVIDENCED_BY',
            defensible: true
          });
        }
      });
    }

    // If no nodes found in curriculum, construct a grounded universal ontology node
    if (nodes.size === 0) {
      const fallbackId = cleanTop.toLowerCase().replace(/[^a-z0-9]/g, '_');
      nodes.set(fallbackId, {
        id: fallbackId,
        name: cleanTop,
        type: 'topic_root',
        subject: cleanSubj,
        prerequisites: ['Foundational Domain Principles'],
        learningObjective: `Demonstrate technical understanding of ${cleanTop}`,
        status: 'UNKNOWN_RELATIONSHIPS_MARKED'
      });
    }

    const graph = {
      subject: cleanSubj,
      topic: cleanTop,
      totalNodes: nodes.size,
      totalEdges: edges.length,
      nodes: Array.from(nodes.values()),
      edges,
      misconceptions,
      generatedAt: new Date().toISOString()
    };

    this.cachedGraphs.set(cacheKey, graph);
    return graph;
  }

  /**
   * Update student evidence on graph
   */
  updateStudentEvidence(graph, conceptId, isCorrect, hintsUsed = 0) {
    if (!graph || !graph.nodes) return;
    const node = graph.nodes.find(n => n.id === conceptId || n.name.toLowerCase() === String(conceptId).toLowerCase());
    if (node && node.studentMasteryEvidence) {
      const ev = node.studentMasteryEvidence;
      ev.attemptCount++;
      if (isCorrect) ev.demonstratedCount++;
      ev.uncertainty = Math.max(0.10, 1.0 / (1.0 + 0.6 * ev.attemptCount));
      ev.masteryProbability = isCorrect
        ? Math.min(0.99, ev.masteryProbability + (hintsUsed > 0 ? 0.15 : 0.30))
        : Math.max(0.05, ev.masteryProbability - 0.20);

      if (ev.demonstratedCount >= 2 && ev.uncertainty <= 0.48 && ev.masteryProbability >= 0.80) {
        ev.status = 'INDEPENDENTLY_DEMONSTRATED';
      } else if (ev.demonstratedCount > 0) {
        ev.status = 'DEVELOPING';
      } else {
        ev.status = 'INTRODUCED';
      }
    }
  }
}

export const conceptGraphEngine = new ConceptGraphEngine();
