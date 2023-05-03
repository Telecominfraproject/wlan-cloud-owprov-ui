import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Flex,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import SubscriberSearchDisplayTable from './Table';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import SubscriberSearch from 'components/SearchBars/SubscriberSearch';
import { Subscriber } from 'models/Subscriber';

interface Props {
  operatorId: string;
}

const SubscriberSearchModal = ({ operatorId }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [results, setResults] = useState<Subscriber[]>([]);

  return (
    <>
      <Tooltip label={t('common.search')} hasArrow>
        <IconButton aria-label={t('common.search')} icon={<MagnifyingGlass />} onClick={onOpen} colorScheme="teal" />
      </Tooltip>
      <Modal onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader
            title={`${t('common.search')} ${t('subscribers.other')}`}
            right={<CloseButton ml={2} onClick={onClose} />}
          />
          <ModalBody>
            <Flex>
              <SubscriberSearch operatorId={operatorId} setResults={setResults} />
            </Flex>
            <SubscriberSearchDisplayTable subscribers={results} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubscriberSearchModal;
