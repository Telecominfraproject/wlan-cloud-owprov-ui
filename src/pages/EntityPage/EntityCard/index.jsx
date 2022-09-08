import React from 'react';
import { Box, Center, Heading, Spacer, Spinner, useBoolean } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import DeleteEntityPopover from './DeleteEntityPopover';
import EditEntityForm from './Form';
import RefreshButton from 'components/Buttons/RefreshButton';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetEntity } from 'hooks/Network/Entity';
import useFormRef from 'hooks/useFormRef';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const EntityCard = ({ id }) => {
  const [editing, setEditing] = useBoolean();
  const { data: entity, refetch, isFetching } = useGetEntity({ id });
  const { form, formRef } = useFormRef();

  return (
    <Card mb={4}>
      <CardHeader mb="10px" display="flex">
        <Box pt={1}>
          <Heading size="md">{entity?.name}</Heading>
        </Box>
        <Spacer />
        <Box>
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            isCompact={false}
            isDisabled={!editing || !form.isValid || !form.dirty}
            ml={2}
          />
          <ToggleEditButton
            toggleEdit={setEditing.toggle}
            isEditing={editing}
            isDisabled={isFetching}
            isDirty={formRef.dirty}
            ml={2}
          />
          <DeleteEntityPopover isDisabled={editing || isFetching} entity={entity} />
          <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
        </Box>
      </CardHeader>
      <CardBody>
        {!entity && isFetching ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <EditEntityForm editing={editing} entity={entity} stopEditing={setEditing.off} formRef={formRef} />
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

EntityCard.propTypes = propTypes;

export default React.memo(EntityCard);
