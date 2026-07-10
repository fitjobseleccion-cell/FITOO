import html2pdf from 'html2pdf.js';

export const generatePdfFromElement = async (elementId, withWatermark = false) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  // Clone the element to avoid modifying the visible DOM during PDF generation
  const clonedElement = element.cloneNode(true);
  
  // Ensure the cloned element has the exact dimensions for A4
  clonedElement.style.width = '794px';
  clonedElement.style.minHeight = '1123px';
  clonedElement.style.position = 'relative';
  clonedElement.style.transform = 'none';
  clonedElement.style.margin = '0';
  
  // Create a temporary container off-screen
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.appendChild(clonedElement);
  document.body.appendChild(container);

  if (withWatermark) {
    const watermarkDiv = document.createElement('div');
    watermarkDiv.innerText = 'FITJOB - Vista previa';
    watermarkDiv.style.position = 'absolute';
    watermarkDiv.style.top = '50%';
    watermarkDiv.style.left = '50%';
    watermarkDiv.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    watermarkDiv.style.fontSize = '80px';
    watermarkDiv.style.fontWeight = 'bold';
    watermarkDiv.style.color = 'rgba(0, 0, 0, 0.08)';
    watermarkDiv.style.zIndex = '9999';
    watermarkDiv.style.pointerEvents = 'none';
    watermarkDiv.style.whiteSpace = 'nowrap';
    clonedElement.appendChild(watermarkDiv);
  }

  const opt = {
    margin: 0,
    filename: 'CV_FITJOB.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
  };

  try {
    const pdfWorker = html2pdf().set(opt).from(clonedElement);
    const pdfBlobUrl = await pdfWorker.output('bloburl');
    return pdfBlobUrl;
  } finally {
    document.body.removeChild(container);
  }
};

export const downloadPdfFromBlob = (blobUrl, filename = 'CV_FITJOB.pdf') => {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};