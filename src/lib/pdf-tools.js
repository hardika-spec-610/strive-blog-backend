import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

//or
//import imageToBase64 from 'image-to-base64/browser';
// Path to the image
const imageToBase64Fun = async (url) => {
  try {
    let image = await imageToBase64(url); //"cGF0aC90by9maWxlLmpwZw=="
    return image;
  } catch (error) {
    console.log(error);
  }
};

export const getPDFReadableStream = async (blogPosts) => {
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
        margin: [0, 5, 0, 15],
      },
      {
        style: "tableExample",
        table: {
          body: [
            ["Blog image", "Blog details"],
            [
              {
                text: "blog image",
                width: 250,
                height: 250,
              },
              {
                type: "none",
                ol: [
                  `${blogPosts.title}`,
                  `Category: ${blogPosts.category}`,
                  `Readtime: ${blogPosts.readTime.value} ${blogPosts.readTime.unit}`,
                  `Author: ${blogPosts.author.name}`,
                ],
                style: "subheader",
              },
            ],
          ],
        },
      },
    ],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
      },
      subheader: {
        fontSize: 15,
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
