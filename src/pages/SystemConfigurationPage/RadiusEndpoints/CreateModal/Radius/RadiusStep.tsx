import * as React from 'react';
import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import RadiusEndpointServerForm from './RadiusEndpointServerForm';
import DeleteButton from 'components/Buttons/DeleteButton';

type Props = {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
};

const CreateRadiusEndpointRadiusStep = ({ formRef, finishStep }: Props) => {
  const { t } = useTranslation();

  const FormSchema = React.useMemo(
    () =>
      Yup.object()
        .shape({
          RadiusServers: Yup.array()
            .of(Yup.object())
            .min(1, 'Must select at least one account')
            .required(t('form.required'))
            .default([]),
        })
        .default({
          RadiusServers: [],
        }),
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
          RadiusServers: values.RadiusServers,
        });
      }}
    >
      {({ setFieldValue, values }) => (
        <Box>
          <Heading mb={4} size="md" textDecoration="underline">
            Please input the information of one or more generic radius servers:
          </Heading>
          <RadiusEndpointServerForm setValue={setFieldValue} value={values.RadiusServers} />
          <Heading mt={8} mb={4} size="md" textDecoration="underline">
            Servers ({values.RadiusServers.length})
          </Heading>
          <UnorderedList>
            {values.RadiusServers.map((v: { Authentication: { Hostname: string }[] }) => (
              <ListItem key={uuid()} display="flex" alignItems="center">
                <Heading size="sm">{v.Authentication[0]?.Hostname}</Heading>
                <DeleteButton
                  ml={4}
                  onClick={() => {
                    setFieldValue(
                      'RadiusServers',
                      values.RadiusServers.filter(
                        (s: { Authentication: { Hostname: string }[] }) =>
                          s.Authentication[0]?.Hostname !== v.Authentication[0]?.Hostname,
                      ),
                    );
                  }}
                />
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </Formik>
  );
};

export default CreateRadiusEndpointRadiusStep;
