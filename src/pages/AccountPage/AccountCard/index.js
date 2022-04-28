import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import { axiosSec } from 'utils/axiosInstances';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import { useMutation, useQueryClient } from 'react-query';
import CardHeader from 'components/Card/CardHeader';
import { Pencil, X } from 'phosphor-react';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import useFormRef from 'hooks/useFormRef';
import UpdateForm from './Form';

const addAvatar = (userId, avatarFile) => {
  const data = new FormData();
  data.append('file', avatarFile);
  return axiosSec.post(`/avatar/${userId}`, data);
};

const AccountCard = () => {
  const { t } = useTranslation();
  const { user, refetchUser } = useAuth();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { isOpen: editing, onOpen: startEditing, onClose: stopEditing } = useDisclosure();
  const queryClient = useQueryClient();
  const { form, formRef } = useFormRef();
  const updateUser = useMutation((userInfo) => axiosSec.put(`user/${user.id}`, userInfo), {
    onSuccess: (data) => {
      const newUser = {
        ...user,
        name: data.data.name,
        description: data.data.description,
        notes: data.data.notes,
        userTypeProprietaryInfo: data.data.userTypeProprietaryInfo,
      };
      queryClient.setQueryData(['get-user-profile'], newUser);
    },
  });
  const deleteAvatar = useMutation(() => axiosSec.delete(`avatar/${user.id}`), {
    onSuccess: () => refetchUser(),
  });
  const updateAvatar = useMutation((newAvatar) => addAvatar(user.id, newAvatar), {
    onSuccess: () => refetchUser(),
  });

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
                isDisabled={!form.isValid || !form.dirty}
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
