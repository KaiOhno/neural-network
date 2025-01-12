import { processText, findSimilarities } from './textProcessor';

export const createNode = (text, position = { x: 0, y: 0 }) => {
  const processedData = processText(text);
  
  return {
    id: `node-${Date.now()}`,
    type: 'custom',
    position,
    data: {
      label: processedData.summary,
      fullText: processedData.fullText,
      keywords: processedData.keywords,
      tokenCount: processedData.tokenCount
    }
  };
};

export const createEdges = (newNode, existingNodes, similarityThreshold = 0.1) => {
  return existingNodes
    .map(existingNode => {
      const similarity = findSimilarities(
        newNode.data,
        existingNode.data
      );

      if (similarity >= similarityThreshold) {
        return {
          id: `edge-${newNode.id}-${existingNode.id}`,
          source: newNode.id,
          target: existingNode.id,
          style: { strokeWidth: Math.max(1, similarity * 5) },
          data: { similarity }
        };
      }
      return null;
    })
    .filter(Boolean);
};

export const calculateNetworkStats = (nodes, edges) => {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  
  // Calculate average connections per node
  const avgConnections = edgeCount / nodeCount || 0;
  
  // Find most connected node
  const nodeConnections = nodes.map(node => ({
    id: node.id,
    connections: edges.filter(edge => 
      edge.source === node.id || edge.target === node.id
    ).length
  }));
  
  const mostConnected = nodeConnections.reduce((max, curr) => 
    curr.connections > max.connections ? curr : max
  , { connections: 0 });

  return {
    nodeCount,
    edgeCount,
    avgConnections,
    mostConnectedNode: mostConnected.id,
    density: (2 * edgeCount) / (nodeCount * (nodeCount - 1)) || 0
  };
};