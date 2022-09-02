import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getCronSchedulerLabel } from './helper';

type Props = {
  value?: string;
  setValue: (v: string) => void;
  isDisabled?: boolean;
};
const RrmScheduler = ({ value, setValue, isDisabled }: Props) => {
  const { t } = useTranslation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onExampleSelect = (v: string) => () => {
    setValue(v);
  };

  const description = React.useMemo(() => getCronSchedulerLabel(value), [value]);

  return (
    <Box mt={4}>
      <FormControl w="unset" isInvalid={!description}>
        <FormLabel ms="4px" mb={0} fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {t('rrm.cron_scheduler')}
        </FormLabel>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="* * * * *"
          w="200px"
          isDisabled={isDisabled}
        />
        {description ? (
          <Box mt={2}>
            <Heading fontStyle="italic" size="sm" colorScheme={description ? undefined : 'red'}>
              {description ?? t('rrm.cron_error')}
            </Heading>
          </Box>
        ) : (
          <FormErrorMessage>{t('rrm.cron_error')}</FormErrorMessage>
        )}
      </FormControl>
      <Box mt={2} hidden={isDisabled}>
        <Text>{t('rrm.cron_templates')}</Text>
        <UnorderedList>
          <ListItem>
            <Button variant="link" onClick={onExampleSelect('* * * * *')}>
              Every minute
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={onExampleSelect('*/5 * * * *')}>
              Every 5 minutes
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={onExampleSelect('0 * * * *')}>
              Every hour
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={onExampleSelect('0 9-17 * * *')}>
              Every hour from 9h to 17h
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={onExampleSelect('0 0 * * *')}>
              Every day at midnight
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={onExampleSelect('0 9-17 * * 1-5')}>
              Every hour from 9h to 17h on weekdays
            </Button>
          </ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default RrmScheduler;
