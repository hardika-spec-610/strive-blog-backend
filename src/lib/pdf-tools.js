import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";
import { promisify } from "util"; // CORE PACKAGE

//or
//import imageToBase64 from 'image-to-base64/browser';
// Path to the image

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

  const imageToBase64Encoded = await imageToBase64(blogPosts.cover);
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
                image: `data:image/jpeg;base64,${imageToBase64Encoded}`,
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
export const getAuthorsPDFReadableStream = async (authors) => {
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

  // const imageToBase64Encoded = await imageToBase64(blogPosts.cover);
  const docDefinition = {
    content: [
      {
        text: "Authors details",
        style: "header",
        margin: [0, 5, 0, 15],
      },
      {
        style: "tableExample",
        table: {
          body: [
            ["Author Name", "Author Surname", "Author Email", "Author DOB"],
            [
              {
                text: `${authors.name}`,
                style: "subheader",
              },
              {
                text: `${authors.surname}`,
                style: "subheader",
              },
              {
                text: `${authors.email}`,
                style: "subheader",
              },
              {
                text: `${authors.DOB}`,
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

  const pdfReadableStream2 = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream2.end();

  return pdfReadableStream2;
};

export const asyncPDFGenerationAuthors = async (author) => {
  // normally pipeline function works with callbacks to tell us when the stream is ended, we shall avoid using callbacks and in particular mixing them with Promises
  // pipeline(source, destination, err => {}) <-- "BAD" (callback based pipeline)
  // await pipeline(source, destination) <-- GOOD (Promise based pipeline)

  // Promisify is a (very cool) tool which turns a callback based function (err first callback) into a promise based function
  // Since pipeline is an error first callback based function --> we can turn pipeline into a promise based pipeline

  const source = getAuthorsPDFReadableStream(author);
  const destination = getPDFWritableStream("authorsData.pdf");

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
