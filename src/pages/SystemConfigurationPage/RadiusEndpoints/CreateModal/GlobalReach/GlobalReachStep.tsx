import * as React from 'react';
import { Box, Center, Heading, Select, Spinner } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import GlobalReachAccountField from './GlobalReachAccountField';
import { GlobalReachAccount, useGetGlobalReachCertificates } from 'hooks/Network/GlobalReach';

type Props = {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  accounts: GlobalReachAccount[];
};

const CreateRadiusEndpointGlobalReachStep = ({ formRef, finishStep, accounts }: Props) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = React.useState<GlobalReachAccount>(accounts[0] as GlobalReachAccount);
  const getCertificates = useGetGlobalReachCertificates(selectedAccount.id);

  const FormSchema = React.useMemo(
    () =>
      Yup.object()
        .shape({
          Accounts: Yup.array()
            .of(
              Yup.object().shape({
                UseOpenRoamingAccount: Yup.string().required(t('form.required')).default(''),
                Weight: Yup.number().required(t('form.required')).min(0).max(500).default(0),
              }),
            )
            .min(1, 'Must select at least one account')
            .required(t('form.required'))
            .default([]),
        })
        .default([]),
    [t],
  );

  type FormValues = Yup.InferType<typeof FormSchema>;

  const initialValues: FormValues = FormSchema.cast({});

  return (
    <Formik
      innerRef={formRef as (instance: FormikProps<FormValues> | null) => void}
      initialValues={initialValues}
      validateOnMount
      validationSchema={FormSchema}
      onSubmit={async (values: FormValues) => {
        await finishStep({
          RadsecServers: values.Accounts,
        });
      }}
    >
      {({ isSubmitting }) => (
        <Box>
          <Heading mb={4} size="md" textDecoration="underline">
            What GlobalReach account would like to use?
          </Heading>
          <Select
            mb={2}
            value={selectedAccount.id}
            onChange={(e) => {
              const found = accounts.find((account) => account.id === e.target.value);
              if (found) {
                setSelectedAccount(found);
              }
            }}
            w="max-content"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <Heading mb={4} size="md" textDecoration="underline">
            Please choose one or more certificates to use:
          </Heading>
          <Box>
            {getCertificates.data ? (
              <GlobalReachAccountField certificates={getCertificates.data} name="Accounts" isDisabled={isSubmitting} />
            ) : (
              <Center my={8}>
                <Spinner size="xl" />
              </Center>
            )}
          </Box>
        </Box>
      )}
    </Formik>
  );
};

export default CreateRadiusEndpointGlobalReachStep;
