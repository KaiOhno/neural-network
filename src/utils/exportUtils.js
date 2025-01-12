import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const exportToImage = async (reactFlowInstance, darkMode) => {
  if (!reactFlowInstance) return null;

  try {
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return null;

    const viewport = reactFlowInstance.getViewport();
    const nodesBounds = reactFlowInstance.getNodes().reduce((bounds, node) => {
      bounds.left = Math.min(bounds.left, node.position.x);
      bounds.right = Math.max(bounds.right, node.position.x + 300);
      bounds.top = Math.min(bounds.top, node.position.y);
      bounds.bottom = Math.max(bounds.bottom, node.position.y + 200);
      return bounds;
    }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

    const dataUrl = await toPng(flowElement, {
      backgroundColor: darkMode ? '#111827' : '#ffffff',
      width: flowElement.offsetWidth,
      height: flowElement.offsetHeight,
      style: {
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
      },
      filter: (node) => {
        return !node.classList?.contains('react-flow__minimap') &&
               !node.classList?.contains('react-flow__controls');
      }
    });

    return dataUrl;
  } catch (error) {
    console.error('Error exporting image:', error);
    return null;
  }
};

export const exportToPDF = async (reactFlowInstance, darkMode, nodes, edges, networkStats) => {
  const imageUrl = await exportToImage(reactFlowInstance, darkMode);
  if (!imageUrl) return;

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add title and metadata
    pdf.setFontSize(20);
    pdf.text('Neural Network Visualization', 20, 20);

    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

    // Add stats
    pdf.setFontSize(12);
    pdf.text(`Total Nodes: ${networkStats.nodeCount}`, 20, 40);
    pdf.text(`Total Connections: ${networkStats.edgeCount}`, 20, 45);

    // Add node details
    pdf.setFontSize(14);
    pdf.text('Node Details:', 20, 60);
    let yPosition = 70;
    
    nodes.forEach((node, index) => {
      if (yPosition > 180) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(12);
      pdf.text(`Node ${index + 1}: ${node.data.label.substring(0, 50)}${node.data.label.length > 50 ? '...' : ''}`, 25, yPosition);
      if (node.data.keywords?.length) {
        pdf.setFontSize(10);
        pdf.text(`Keywords: ${node.data.keywords.join(', ')}`, 30, yPosition + 5);
      }
      yPosition += 15;
    });

    // Add visualization
    pdf.addPage();
    const imgProps = pdf.getImageProperties(imageUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const scale = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height) * 0.9;
    const scaledWidth = imgProps.width * scale;
    const scaledHeight = imgProps.height * scale;
    
    const xPos = (pdfWidth - scaledWidth) / 2;
    const yPos = (pdfHeight - scaledHeight) / 2;
    
    pdf.addImage(imageUrl, 'PNG', xPos, yPos, scaledWidth, scaledHeight);
    pdf.save(`neural-network-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
};

export const saveNetworkData = (nodes, edges) => {
  const data = {
    nodes,
    edges,
    metadata: {
      version: '1.0',
      timestamp: Date.now(),
      nodeCount: nodes.length,
      edgeCount: edges.length
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `neural-network-data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadNetworkData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};