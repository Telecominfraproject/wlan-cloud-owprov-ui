import * as React from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import CreateVenueModal from 'components/Tables/VenueTable/CreateVenueModal';

type Props = {
  id: string;
  type: 'venue' | 'entity';
};

const CreateVenueButton = ({ id, type }: Props) => {
  const modalProps = useDisclosure();

  return (
    <>
      <Button
        colorScheme="purple"
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
        Venue
      </Button>
      <CreateVenueModal
        {...modalProps}
        parentId={type === 'venue' ? id : undefined}
        entityId={type === 'entity' ? id : undefined}
      />
    </>
  );
};

export default CreateVenueButton;
