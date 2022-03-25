import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CloseButton,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Tooltip,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowSquareOut } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'components/ModalHeader';
import CirclePack from './CirclePack';

const propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Object),
};

const defaultProps = {
  data: null,
};

const CirclePackExpandButton = ({ isDisabled, data }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const breakpoint = useBreakpoint();

  const button = () => {
    if (breakpoint !== 'base' && breakpoint !== 'sm') {
      return (
        <Button
          colorScheme="gray"
          type="button"
          onClick={onOpen}
          rightIcon={<ArrowSquareOut size={20} />}
          isDisabled={isDisabled}
        >
          {t('common.fullscreen')}
        </Button>
      );
    }
    return (
      <Tooltip label={t('common.fullscreen')}>
        <IconButton
          colorScheme="red"
          type="button"
          onClick={onOpen}
          icon={<ArrowSquareOut size={20} />}
          isDisabled={isDisabled}
        />
      </Tooltip>
    );
  };

  return (
    <>
      {button()}
      <Modal onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader title={t('analytics.live_view')} right={<CloseButton ml={2} onClick={onClose} />} />
          <ModalBody>
            <CirclePack timepoints={data} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

CirclePackExpandButton.propTypes = propTypes;
CirclePackExpandButton.defaultProps = defaultProps;
export default React.memo(CirclePackExpandButton);
