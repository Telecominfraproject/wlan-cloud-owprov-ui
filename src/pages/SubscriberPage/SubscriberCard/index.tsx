import React from 'react';
import { Box, Center, Flex, Heading, Spacer, Spinner, useBoolean } from '@chakra-ui/react';
import Actions from './Actions';
import DeleteVenuePopover from './DeletePopover';
import EditSubscriberForm from './Form';
import SuspendedNotification from './SuspendedNotification';
import WaitingForVerification from './WaitingForVerification';
import RefreshButton from 'components/Buttons/RefreshButton';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetSubscriber } from 'hooks/Network/Subscribers';
import useFormRef from 'hooks/useFormRef';

interface Props {
  id: string;
}

const SubscriberCard = ({ id }: Props) => {
  const [editing, setEditing] = useBoolean();
  const { data: subscriber, refetch, isFetching } = useGetSubscriber({ id });
  const { form, formRef } = useFormRef();

  return (
    <Card mb={4}>
      <CardHeader mb="10px" display="flex">
        <Flex pt={1}>
          <Heading size="md" pt={1} mb={0} pb={0}>
            {subscriber?.name}
          </Heading>
          <SuspendedNotification id={id} refresh={refetch} isSuspended={subscriber?.suspended} isDisabled={editing} />
          <WaitingForVerification
            id={id}
            refresh={refetch}
            isWaitingForEmailVerification={subscriber?.waitingForEmailCheck}
            isDisabled={editing}
          />
        </Flex>
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
            isDirty={form.dirty}
            ml={2}
          />
          <DeleteVenuePopover isDisabled={editing || isFetching} subscriber={subscriber} />
          <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
          <Actions subscriber={subscriber} refresh={refetch} isDisabled={editing} />
        </Box>
      </CardHeader>
      <CardBody>
        {!subscriber ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <EditSubscriberForm
              editing={editing}
              subscriber={subscriber}
              stopEditing={setEditing.off}
              formRef={formRef}
            />
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

export default React.memo(SubscriberCard);
