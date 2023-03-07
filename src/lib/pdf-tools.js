import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (blogPosts) => {
  // Define font files
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      {
        text: "Blog post details",
        style: "header",
      },
      {
        alignment: "justify",
        columns: [
          {
            image: `${blogPosts.cover}`,
            width: 180,
            height: 180,
          },
          {
            text: `${blogPosts.title}`,
            style: "subheader",
          },
          {
            type: "none",
            ol: [
              `Category: ${blogPosts.category}`,
              `Readtime: ${blogPosts.readTime.value} ${blogPosts.readTime.unit}`,
              `Author: ${blogPosts.author.name}`,
            ],
          },
        ],
      },

      //   {
      //     text: "Comments",
      //     style: "subheader",
      //   },
    ],
    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
