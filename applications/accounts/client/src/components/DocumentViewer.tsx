import {
  faClose,
  faDownload,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip, Typography } from '@motech-development/breeze-ui';
// eslint-disable-next-line import/extensions
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

interface IDocumentViewerProps {
  file: Blob;
  onClose?: () => void;
  onDownload: () => void;
}

interface IDocProps {
  zoom: number;
}

const Doc = styled(Document)<IDocProps>`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
  zoom: ${({ zoom }) => `${zoom}%`};
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
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0 20px;
`;

const ToolbarContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ToolbarSpacer = styled.div`
  width: 20px;
`;

const Zoom = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  padding: 0 15px;
`;

function DocumentViewer({ file, onClose, onDownload }: IDocumentViewerProps) {
  const { t } = useTranslation('document-viewer');

  const [pages, setPages] = useState(0);

  const [zoom, setZoom] = useState(100);

  const [rotate, setRotate] = useState(0);

  const rotateDocument = () => {
    setRotate(rotate === 270 ? 0 : rotate + 90);
  };

  const zoomIn = () => {
    setZoom(zoom + 10);
  };

  const zoomOut = () => {
    setZoom(zoom - 10);
  };

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

          <ToolbarSpacer />

          <Tooltip
            id="close"
            parent={
              <Button aria-label={t('close')} colour="danger" onClick={onClose}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
            }
            placement="top"
            colour="primary"
            message={t('close')}
          />
        </ToolbarContent>
      </Toolbar>

      <Content>
        <Doc
          file={file}
          options={options}
          rotate={rotate}
          zoom={zoom}
          onLoadSuccess={({ numPages }) => {
            setPages(numPages);
          }}
        >
          {Array.from(new Array(pages), (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Doc>
      </Content>
    </Container>
  );
}

export default DocumentViewer;
