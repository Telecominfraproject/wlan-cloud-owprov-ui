import * as React from 'react';
import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import RadiusEndpointServerForm from './RadsecEndpointServerForm';
import DeleteButton from 'components/Buttons/DeleteButton';

type Props = {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
};

const CreateRadiusEndpointRadsecStep = ({ formRef, finishStep }: Props) => {
  const { t } = useTranslation();

  const FormSchema = React.useMemo(
    () =>
      Yup.object()
        .shape({
          RadsecServers: Yup.array()
            .of(Yup.object())
            .min(1, 'Must select at least one account')
            .required(t('form.required'))
            .default([]),
        })
        .default({
          RadsecServers: [],
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
          RadsecServers: values.RadsecServers,
        });
      }}
    >
      {({ setFieldValue, values }) => (
        <Box>
          <Heading mb={4} size="md" textDecoration="underline">
            Please input the information of one or more Radsec Servers:
          </Heading>
          <RadiusEndpointServerForm setValue={setFieldValue} value={values.RadsecServers} />
          <Heading mt={8} mb={4} size="md" textDecoration="underline">
            Radsec Servers ({values.RadsecServers.length})
          </Heading>
          <UnorderedList>
            {values.RadsecServers.map((v: { Hostname: string }) => (
              <ListItem key={uuid()} display="flex" alignItems="center">
                <Heading size="sm">{v.Hostname}</Heading>
                <DeleteButton
                  ml={4}
                  onClick={() => {
                    setFieldValue(
                      'RadsecServers',
                      values.RadsecServers.filter((s: { Hostname: string }) => s.Hostname !== v.Hostname),
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

export default CreateRadiusEndpointRadsecStep;
