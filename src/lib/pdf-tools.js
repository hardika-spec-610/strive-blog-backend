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
          //   {
          //     image: `data:image/jpeg;base64,${imageToBase64Fun(
          //       blogPosts.cover
          //     )}`,
          //     width: 250,
          //     height: 250,
          //   },

          {
            text: "blog image",
            width: 250,
            height: 250,
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
        bold: true,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
