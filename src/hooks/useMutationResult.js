import { useToast } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

const propTypes = {
  objName: PropTypes.string.isRequired,
  operationType: PropTypes.oneOf(['update', 'delete', 'create']).isRequired,
  refresh: PropTypes.func,
  onClose: PropTypes.func,
  queryToInvalidate: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  refresh: () => {},
  onClose: () => {},
  queryToInvalidate: null,
};

const useMutationResult = ({ objName, operationType, refresh, onClose, queryToInvalidate }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const successDescription = () => {
    if (operationType === 'update')
      return t('crud.success_update_obj', {
        obj: objName,
      });
    if (operationType === 'delete')
      return t('crud.success_delete_obj', {
        obj: objName,
      });

    return t('crud.success_create_obj', {
      obj: objName,
    });
  };
  const errorDescription = (e) => {
    if (operationType === 'update')
      return t('crud.error_update_obj', {
        obj: objName,
        e: e?.response?.data?.ErrorDescription,
      });
    if (operationType === 'delete')
      t('crud.error_delete_obj', {
        obj: objName,
        e: e?.response?.data?.ErrorDescription,
      });

    return t('crud.error_create_obj', {
      obj: objName,
      e: e?.response?.data?.ErrorDescription,
    });
  };

  const onSuccess = useCallback(({ setSubmitting, resetForm } = { setSubmitting: null, resetForm: null }) => {
    if (refresh) refresh();
    if (setSubmitting) setSubmitting(false);
    if (resetForm) resetForm();
    toast({
      id: `${objName}-${operationType}-success`,
      title: t('common.success'),
      description: successDescription(),
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
    if (onClose) onClose();
    if (queryToInvalidate) queryClient.invalidateQueries(queryToInvalidate);
  }, []);

  const onError = useCallback((e, { setSubmitting } = { setSubmitting: null }) => {
    toast({
      id: uuid(),
      title: t('common.error'),
      description: errorDescription(e),
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
    if (setSubmitting) setSubmitting(false);
  }, []);

  const toReturn = useMemo(
    () => ({
      onSuccess,
      onError,
    }),
    [],
  );

  return toReturn;
};

useMutationResult.propTypes = propTypes;
useMutationResult.defaultProps = defaultProps;
export default useMutationResult;
