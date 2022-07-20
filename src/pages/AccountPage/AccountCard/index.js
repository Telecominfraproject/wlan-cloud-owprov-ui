import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { Pencil, X } from 'phosphor-react';
import { useAuth } from 'contexts/AuthProvider';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import SaveButton from 'components/Buttons/SaveButton';
import useFormRef from 'hooks/useFormRef';
import { useDeleteAvatar, useUpdateAccount, useUpdateAvatar } from 'hooks/Network/Account';
import UpdateForm from './Form';

const AccountCard = () => {
  const { t } = useTranslation();
  const { user, refetchUser } = useAuth();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { isOpen: editing, onOpen: startEditing, onClose: stopEditing } = useDisclosure();

  const { form, formRef } = useFormRef();
  const updateUser = useUpdateAccount({ user });
  const deleteAvatar = useDeleteAvatar({ user, refetch: refetchUser });
  const updateAvatar = useUpdateAvatar({ user, refetch: refetchUser });

  const toggleEditing = () => {
    if (!editing) startEditing();
    else if (!form.dirty) stopEditing();
    else openConfirm();
  };

  const confirmStopEditing = () => {
    closeConfirm();
    stopEditing();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Flex w="100%" flexDirection="row" alignItems="center">
            <Box ms="auto">
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={!form.isValid}
                isCompact={false}
                hidden={!editing}
              />
              <Button colorScheme="gray" onClick={toggleEditing} rightIcon={editing ? <X /> : <Pencil />} ml={2}>
                {editing ? t('common.stop_editing') : t('common.edit')}
              </Button>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <UpdateForm
            finishUpdate={confirmStopEditing}
            stopEditing={toggleEditing}
            updateUser={updateUser}
            editing={editing}
            formRef={formRef}
            updateAvatar={updateAvatar}
            deleteAvatar={deleteAvatar}
          />
        </CardBody>
      </Card>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={confirmStopEditing} cancel={closeConfirm} />
    </>
  );
};

export default AccountCard;
