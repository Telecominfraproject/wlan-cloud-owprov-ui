import * as React from 'react';
import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { GoogleOrionAccount } from 'hooks/Network/GoogleOrion';
import useFastField from 'hooks/useFastField';

type Props = {
  accounts: GoogleOrionAccount[];
  name: string;
  isDisabled?: boolean;
};

const OrionAccountField = ({ accounts, name, isDisabled }: Props) => {
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
          {accounts.map((account) => (
            <Radio value={account.id} key={account.id}>
              {account.name} {account.description ? ` - ${account.description}` : ''}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default OrionAccountField;
