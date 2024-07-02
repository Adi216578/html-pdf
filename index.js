const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/generate-pdf', (req, res) => {
  const { html, css } = req.body;

  // Combine HTML and CSS
  const content = `
    <style>${css}</style>
    ${html}
  `;

  pdf.create(content).toStream((err, stream) => {
    if (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).send('Error generating PDF');
    }

    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');

    stream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
