export const createNode = (text, position) => {
    const keywords = text
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);
  
    return {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: {
        x: position?.x ?? Math.random() * 500,
        y: position?.y ?? Math.random() * 300
      },
      data: {
        label: text.length > 30 ? text.substring(0, 30) + '...' : text,
        fullText: text,
        keywords,
        connections: 0
      },
      draggable: true, // Ensure nodes are draggable
    };
  };
  
  export const createEdges = (newNode, existingNodes) => {
    return existingNodes.map(existingNode => {
      const sourceKeywords = new Set(newNode.data.keywords);
      const targetKeywords = new Set(existingNode.data.keywords);
      const commonKeywords = [...sourceKeywords].filter(keyword => targetKeywords.has(keyword));
      
      if (commonKeywords.length > 0) {
        return {
          id: `edge-${newNode.id}-${existingNode.id}`,
          source: newNode.id,
          target: existingNode.id,
          animated: true,
          style: { stroke: '#2563eb', strokeWidth: Math.min(commonKeywords.length * 2, 5) }
        };
      }
      return null;
    }).filter(Boolean);
  };
  
  export const calculateNetworkStats = (nodes, edges) => {
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      density: nodes.length > 1 
        ? (2 * edges.length) / (nodes.length * (nodes.length - 1))
        : 0
    };
  };