import { v4 as uuid } from 'uuid';

export const errorToast = ({ t, description, id = uuid() }) => ({
  id,
  title: t('common.error'),
  description,
  status: 'error',
  duration: 5000,
  isClosable: true,
  position: 'top-right',
});

export const successToast = ({ t, description, id = uuid() }) => ({
  id,
  title: t('common.success'),
  description,
  status: 'success',
  duration: 5000,
  isClosable: true,
  position: 'top-right',
});
