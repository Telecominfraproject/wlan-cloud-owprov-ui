import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Center, Heading, Spacer, Spinner, useBoolean, useToast } from '@chakra-ui/react';
import CardBody from 'components/Card/CardBody';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import RefreshButton from 'components/Buttons/RefreshButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import SaveButton from 'components/Buttons/SaveButton';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetSubscriber } from 'hooks/Network/Subscribers';
import EditSubscriberForm from './Form';
import DeleteVenuePopover from './DeleteVenuePopover';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const SubscriberCard = ({ id }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [editing, setEditing] = useBoolean();
  const { data: subscriber, refetch, isFetching } = useGetSubscriber({ t, toast, id });
  const [form, setForm] = useState({});
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  );

  return (
    <Card mb={4}>
      <CardHeader mb="10px" display="flex">
        <Box pt={1}>
          <Heading size="md">{subscriber?.name}</Heading>
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
          <DeleteVenuePopover isDisabled={editing || isFetching} subscriber={subscriber} />
          <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
        </Box>
      </CardHeader>
      <CardBody>
        {!subscriber && isFetching ? (
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

SubscriberCard.propTypes = propTypes;

export default React.memo(SubscriberCard);
