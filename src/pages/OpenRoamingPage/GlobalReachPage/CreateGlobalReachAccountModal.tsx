import * as React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import PrivateKeyField from './PrivateKeyField';
import StatePicker from './StatePicker';
import CreateButton from 'components/Buttons/CreateButton';
import SaveButton from 'components/Buttons/SaveButton';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import COUNTRY_LIST from 'constants/countryList';
import { testPemPrivateKey } from 'constants/formTests';
import { CreateGlobalReachAccountRequest, useCreateGlobalReachAccount } from 'hooks/Network/GlobalReach';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { useNotification } from 'hooks/useNotification';

const CreateGlobalReachAccountModal = () => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = React.useState(0);
  const { form, formRef } = useFormRef<CreateGlobalReachAccountRequest>();
  const modal = useFormModal({
    isDirty: form.dirty,
    onCloseSideEffect: () => {
      setFormKey((k) => k + 1);
    },
  });
  const { successToast, apiErrorToast } = useNotification();
  const create = useCreateGlobalReachAccount();

  const onSubmit = async (
    data: CreateGlobalReachAccountRequest,
    helpers: FormikHelpers<CreateGlobalReachAccountRequest>,
  ) => {
    helpers.setSubmitting(true);

    await create.mutateAsync(data, {
      onSuccess: () => {
        successToast({
          description: t('roaming.account_created'),
        });
        modal.closeCancelAndForm();
        helpers.resetForm();
        helpers.setSubmitting(false);
      },
      onError: (error) => {
        apiErrorToast({ e: error });
        helpers.setSubmitting(false);
      },
    });
  };

  const FormSchema = React.useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('form.required')),
        description: Yup.string(),
        notes: Yup.array().of(Yup.string()),
        privateKey: Yup.string()
          .test('test-key', t('roaming.invalid_key'), (v) => testPemPrivateKey(v))
          .required(t('form.required')),
        country: Yup.string().required(t('form.required')),
        province: Yup.string().required(t('form.required')),
        city: Yup.string().required(t('form.required')),
        organization: Yup.string().required(t('form.required')),
        commonName: Yup.string().required(t('form.required')),
        GlobalReachAcctId: Yup.string().required(t('form.required')),
      }),
    [t],
  );

  const isFieldDisabled = create.isLoading;

  return (
    <>
      <CreateButton onClick={modal.onOpen} />
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={`${t('common.create')} ${t('roaming.account_one')}`}
        topRightButtons={<SaveButton onClick={form.submitForm} isLoading={form.isSubmitting} />}
      >
        <Box>
          <Formik
            key={formKey}
            innerRef={formRef}
            initialValues={
              {
                name: '',
                description: '',
                notes: [],
                privateKey: '',
                country: 'US',
                province: 'AL',
                city: '',
                organization: '',
                commonName: '',
                GlobalReachAcctId: '',
              } as CreateGlobalReachAccountRequest
            }
            validateOnMount
            validationSchema={FormSchema}
            onSubmit={onSubmit}
          >
            <Box>
              <Heading size="md" textDecoration="underline">
                {t('roaming.account_one')} {t('common.details')}
              </Heading>
              <Flex my={2}>
                <StringField name="name" label={t('common.name')} isRequired isDisabled={isFieldDisabled} w="300px" />
                <Box ml={2}>
                  <StringField
                    name="commonName"
                    label={`${t('roaming.common_name')}`}
                    isRequired
                    placeholder="example.com"
                    isDisabled={isFieldDisabled}
                    w="300px"
                  />
                </Box>
              </Flex>{' '}
              <StringField name="Description" isArea h="80px" isDisabled={isFieldDisabled} />
              <Heading size="md" textDecoration="underline" mt={2}>
                {t('roaming.global_reach')}
              </Heading>
              <Flex my={2}>
                <StringField
                  name="GlobalReachAcctId"
                  label={t('roaming.global_reach_account_id')}
                  isRequired
                  isDisabled={isFieldDisabled}
                  w="266px"
                />
                <Box ml={2}>
                  <PrivateKeyField isDisabled={isFieldDisabled} />
                </Box>
              </Flex>
              <Heading size="md" textDecoration="underline">
                {t('roaming.location_details_title')}
              </Heading>{' '}
              <Flex my={2}>
                <Box>
                  <SelectField
                    name="country"
                    label={t('roaming.country')}
                    options={COUNTRY_LIST}
                    isRequired
                    w="max-content"
                  />
                </Box>
                <Box ml={2}>
                  <StatePicker isDisabled={isFieldDisabled} />
                </Box>
              </Flex>
              <Flex my={2}>
                <StringField
                  name="city"
                  label={`${t('roaming.city')}`}
                  isRequired
                  isDisabled={isFieldDisabled}
                  w="266px"
                />
                <Box ml={2}>
                  <StringField
                    name="organization"
                    label={`${t('roaming.organization')}`}
                    isRequired
                    isDisabled={isFieldDisabled}
                    w="300px"
                  />
                </Box>
              </Flex>
            </Box>
          </Formik>
        </Box>
      </Modal>
      <ConfirmCloseAlert isOpen={modal.isConfirmOpen} confirm={modal.closeCancelAndForm} cancel={modal.closeConfirm} />
    </>
  );
};

export default CreateGlobalReachAccountModal;
