import * as React from 'react';
import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { GlobalReachCertificate } from 'hooks/Network/GlobalReach';
import useFastField from 'hooks/useFastField';

type Props = {
  certificates: GlobalReachCertificate[];
  name: string;
  isDisabled?: boolean;
};

const GlobalReachAccountField = ({ certificates, name, isDisabled }: Props) => {
  const field = useFastField<{ UseOpenRoamingAccount: string; Weight: number }[]>({ name });

  return (
    <Box>
      <RadioGroup
        isDisabled={isDisabled}
        value={field.value[0]?.UseOpenRoamingAccount}
        onChange={(v) =>
          field.onChange([
            {
              UseOpenRoamingAccount: v,
              Weight: 0,
            },
          ])
        }
      >
        <Stack>
          {certificates.map((certificate) => (
            <Radio value={certificate.id} key={certificate.id}>
              {certificate.name}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default GlobalReachAccountField;
