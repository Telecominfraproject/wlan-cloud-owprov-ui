import * as React from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import CreateEntityModal from './CreateEntityModal';

type Props = {
  id: string;
};

const CreateEntityButton = ({ id }: Props) => {
  const { t } = useTranslation();
  const modalProps = useDisclosure();
  return (
    <>
      <Button
        colorScheme="pink"
        onClick={modalProps.onOpen}
        leftIcon={
          <Plus
            size={18}
            weight="bold"
            style={{
              marginTop: '-2px',
            }}
          />
        }
      >
        {t('entities.one')}
      </Button>
      <CreateEntityModal {...modalProps} parentId={id} />
    </>
  );
};

export default CreateEntityButton;
