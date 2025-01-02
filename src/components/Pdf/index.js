import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pdf = ({ filePath }) => {
  const [pageWidth, setPageWidth] = React.useState(600);
  // const [pageNumber] = React.useState(1);
  const [numPages, setNumPages] = React.useState(1);
  // setPagNumber
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const pageZoomIn = () => {
    const pageWidths = pageWidth * 1.2;
    setPageWidth(pageWidths);
  };

  const pageZoomOut = () => {
    if (pageWidth <= 600) {
      return;
    }
    const pageWidths = pageWidth * 0.8;
    setPageWidth(pageWidths);
  };

  return (
    <div style={{ overflow: "auto" }}>
      <div
        style={{
          position: "fixed",
          top: "52px",
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "rgb(238, 238, 238)",
          height: "50px",
        }}
      >
        <p onClick={pageZoomIn}>
          <ZoomInIcon color="disabled" fontSize="large" />
        </p>
        <p onClick={pageZoomOut}>
          <ZoomOutIcon color="disabled" fontSize="large" />
        </p>
      </div>

      <div style={{ width: "95%", margin: "24px auto" }}>
        <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess}>
          {new Array(numPages).fill("").map((item, index) => {
            return (
              <Page
                key={index}
                pageNumber={index + 1}
                width={pageWidth}
                scale={0.6}
              />
            );
          })}
        </Document>
      </div>

      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
    </div>
  );
};

export default Pdf;
