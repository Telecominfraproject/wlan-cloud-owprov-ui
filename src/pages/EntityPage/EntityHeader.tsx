import * as React from 'react';
import { HStack, Heading, Icon, Spacer } from '@chakra-ui/react';
import { TreeStructure } from 'phosphor-react';
import DeleteEntityPopover from './DeleteEntityPopover';
import EntityDropdown from './EntityDropdown';
import VenueDropdown from './VenueDropdown';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import { useGetEntity } from 'hooks/Network/Entity';

type Props = {
  id: string;
};

const EntityPageHeader = ({ id }: Props) => {
  const getEntity = useGetEntity({ id });

  return (
    <Card mb={4} p={2}>
      <CardHeader display="flex">
        <HStack spacing={2}>
          <Icon my="auto" as={TreeStructure} color="inherit" boxSize="24px" mr={2} />
          <Heading my="auto" size="md">
            {getEntity.data?.name}
          </Heading>
          <EntityDropdown id={id} />
          <VenueDropdown id={id} />
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <DeleteEntityPopover entity={getEntity.data} isDisabled={getEntity.isFetching || !getEntity.data} />
          <RefreshButton onClick={getEntity.refetch} isFetching={getEntity.isFetching} isCompact />
        </HStack>
      </CardHeader>
    </Card>
  );
};

export default EntityPageHeader;
