import * as React from 'react';
import { Box, HStack, Heading, Icon, Spacer, VStack } from '@chakra-ui/react';
import { TreeStructure } from '@phosphor-icons/react';
import EntityFavoritesButton from '../../components/EntityFavoritesButton';
import CreateEntityButton from './CreateEntityButton';
import DeleteEntityPopover from './DeleteEntityPopover';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CreateVenueButton from 'components/CreateVenueButton';
import EntityBreadcrumb from 'components/EntityBreadcrumb';
import { useGetEntity } from 'hooks/Network/Entity';

type Props = {
  id: string;
};

const EntityPageHeader = ({ id }: Props) => {
  const getEntity = useGetEntity({ id });

  return (
    <Card mb={4} py={2}>
      <CardHeader px={4} variant="unstyled" display="flex">
        <HStack spacing={2} alignItems="start">
          <VStack alignItems="start">
            <HStack marginRight="auto" spacing={2} alignItems="start">
              <Icon my="auto" as={TreeStructure} color="inherit" boxSize="24px" />
              <Heading my="auto" size="md">
                {getEntity.data?.name}
              </Heading>
              <Box pt={-1}>
                <EntityFavoritesButton id={id} type="entity" />
              </Box>
            </HStack>
            <EntityBreadcrumb id={id} />
          </VStack>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <DeleteEntityPopover entity={getEntity.data} isDisabled={getEntity.isFetching || !getEntity.data} />
          <CreateEntityButton id={id} />
          <CreateVenueButton id={id} type="entity" />
          <RefreshButton onClick={getEntity.refetch} isFetching={getEntity.isFetching} isCompact />
        </HStack>
      </CardHeader>
    </Card>
  );
};

export default EntityPageHeader;
