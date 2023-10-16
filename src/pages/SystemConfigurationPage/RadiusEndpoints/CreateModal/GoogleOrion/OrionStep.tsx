import * as React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import OrionAccountField from './OrionAccountField';
import { GoogleOrionAccount } from 'hooks/Network/GoogleOrion';

type Props = {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  accounts: GoogleOrionAccount[];
};

const CreateRadiusEndpointOrionStep = ({ formRef, finishStep, accounts }: Props) => {
  const { t } = useTranslation();

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
            Please choose one or more Google Orion accounts you would like to use:
          </Heading>
          <OrionAccountField accounts={accounts} name="Accounts" isDisabled={isSubmitting} />
        </Box>
      )}
    </Formik>
  );
};

export default CreateRadiusEndpointOrionStep;
