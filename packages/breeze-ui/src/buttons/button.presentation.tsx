import { ProgressBarContext } from 'react-aria-components/ProgressBar';
import { useSlottedContext } from 'react-aria-components/slots';
import { useBreezeContext } from '../provider/BreezeContext';
import { buttonVariants } from './button.styles';

/** Connect the pending announcement to a phrasing element inside the button. */
export default function ButtonLoadingStatus() {
  const progress = useSlottedContext(ProgressBarContext);
  const { getMessageLocale, messages } = useBreezeContext();

  return (
    <progress
      aria-label={messages.loading}
      className={buttonVariants.state.loadingStatus}
      id={progress?.id}
      lang={getMessageLocale('loading')}
    />
  );
}
