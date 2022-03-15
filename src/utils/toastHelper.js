import { v4 as createUuid } from 'uuid';

export const errorToast = ({ t, description, id = createUuid() }) => ({
  id,
  title: t('common.error'),
  description,
  status: 'error',
  duration: 5000,
  isClosable: true,
  position: 'top-right',
});

export const successToast = ({ t, description, id = createUuid() }) => ({
  id,
  title: t('common.success'),
  description,
  status: 'success',
  duration: 5000,
  isClosable: true,
  position: 'top-right',
});
