import {
  faDownload,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip, Typography } from '@motech-development/breeze-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

interface IDocumentViewerProps {
  buttons?: ReactNode;
  file: Blob;
  onDownload: () => void;
}

const Document = styled(PdfDocument)`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Page = styled(PdfPage)`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
`;

const Toolbar = styled.div`
  border-bottom: 2.5px solid #007fa8;
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  justify-content: space-between;
  padding: 0 0 20px;

  @media (min-width: 576px) {
    flex-direction: row;
    gap: 0;
  }
`;

const ToolbarContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ToolbarSpacer = styled.div`
  flex: 1;
  width: 20px;

  @media (min-width: 576px) {
    flex: auto;
  }
`;

const Zoom = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  padding: 0 15px;
`;

function DocumentViewer({ buttons, file, onDownload }: IDocumentViewerProps) {
  const { t } = useTranslation('document-viewer');

  const [pages, setPages] = useState(0);

  const [zoom, setZoom] = useState(100);

  const [rotate, setRotate] = useState(0);

  const [width, setWidth] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const rotateDocument = () => {
    setRotate(rotate === 270 ? 0 : rotate + 90);
  };

  const zoomIn = () => {
    setZoom(zoom + 10);
  };

  const zoomOut = () => {
    setZoom(zoom - 10);
  };

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth * 0.5);
    }
  }, [ref]);

  return (
    <Container>
      <Toolbar>
        <ToolbarContent>
          <Tooltip
            id="zoom-in"
            parent={
              <Button aria-label={t('zoom-in')} onClick={zoomIn}>
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              </Button>
            }
            placement="top"
            colour="primary"
            message={t('zoom-in')}
          />

          <Zoom>
            <Typography component="p" variant="p" margin="none">
              {zoom}%
            </Typography>
          </Zoom>

          <Tooltip
            id="zoom-out"
            parent={
              <Button aria-label={t('zoom-out')} onClick={zoomOut}>
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              </Button>
            }
            placement="top"
            colour="primary"
            message={t('zoom-out')}
          />

          <ToolbarSpacer />

          <Tooltip
            id="rotate"
            parent={
              <Button aria-label={t('rotate')} onClick={rotateDocument}>
                <FontAwesomeIcon icon={faRotate} />
              </Button>
            }
            placement="top"
            colour="primary"
            message={t('rotate')}
          />
        </ToolbarContent>

        <ToolbarContent>
          <Tooltip
            id="download"
            parent={
              <Button aria-label={t('download')} onClick={onDownload}>
                <FontAwesomeIcon icon={faDownload} />
              </Button>
            }
            placement="top"
            colour="primary"
            message={t('download')}
          />

          {buttons && (
            <>
              <ToolbarSpacer />

              {buttons}
            </>
          )}
        </ToolbarContent>
      </Toolbar>

      <Content ref={ref}>
        <Document
          file={file}
          options={options}
          rotate={rotate}
          onLoadSuccess={({ numPages }) => {
            setPages(numPages);
          }}
        >
          {Array.from(new Array(pages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              width={width}
              scale={(zoom / 100) * 2}
              pageNumber={index + 1}
            />
          ))}
        </Document>
      </Content>
    </Container>
  );
}

export default DocumentViewer;
