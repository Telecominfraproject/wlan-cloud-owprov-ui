import React from 'react';
import { Box, Center, Heading, Spacer, Spinner, useBoolean } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import DeleteOperatorButton from './DeleteButton';
import EditOperatorForm from './Form';
import RefreshButton from 'components/Buttons/RefreshButton';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetOperator } from 'hooks/Network/Operators';
import useFormRef from 'hooks/useFormRef';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const OperatorDetailsCard = ({ id }) => {
  const [editing, setEditing] = useBoolean();
  const { data: operator, refetch, isFetching } = useGetOperator({ id });
  const { form, formRef } = useFormRef();

  return (
    <Card mb={4}>
      <CardHeader mb="10px" display="flex">
        <Box pt={1}>
          <Heading size="md">{operator?.name}</Heading>
        </Box>
        <Spacer />
        <DeleteOperatorButton isDisabled={editing || isFetching} operator={operator} />
        <SaveButton
          onClick={form.submitForm}
          isLoading={form.isSubmitting}
          isDisabled={!editing || !form.isValid || !form.dirty}
          hidden={!editing}
          ml={2}
        />
        <ToggleEditButton
          toggleEdit={setEditing.toggle}
          isEditing={editing}
          isDisabled={isFetching}
          isDirty={formRef.dirty}
          ml={2}
        />
        <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
      </CardHeader>
      <CardBody>
        {!operator && isFetching ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <EditOperatorForm editing={editing} operator={operator} stopEditing={setEditing.off} formRef={formRef} />
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

OperatorDetailsCard.propTypes = propTypes;

export default React.memo(OperatorDetailsCard);
