const express = require('express');
const bodyParser = require('body-parser');
const { PDFDocument, rgb } = require('pdf-lib');
const { JSDOM } = require('jsdom');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/generate-pdf', async (req, res) => {
  const { html, css } = req.body;

  try {
    const dom = new JSDOM(`<html><head><style>${css}</style></head><body>${html}</body></html>`);
    const content = dom.window.document.body.textContent || "";

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const textWidth = width - 2 * fontSize;
    const textHeight = height - 2 * fontSize;

    page.drawText(content, {
      x: fontSize,
      y: textHeight - fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
      maxWidth: textWidth,
    });

    const pdfBytes = await pdfDoc.save();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
