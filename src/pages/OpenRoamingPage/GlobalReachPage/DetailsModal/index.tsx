import * as React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UseDisclosureReturn,
  useClipboard,
} from '@chakra-ui/react';
import { State } from 'country-state-city';
import { useTranslation } from 'react-i18next';
import CertificatesTable from './CertificatesTable';
import { Modal } from 'components/Modals/Modal';
import COUNTRY_LIST from 'constants/countryList';
import { GlobalReachAccount } from 'hooks/Network/GlobalReach';

const labelProps = {
  mr: 2,
} as const;

type Props = {
  account: GlobalReachAccount;
  modalProps: UseDisclosureReturn;
};

const DetailsModal = ({ account, modalProps }: Props) => {
  const { t } = useTranslation();
  const privateKeyCopy = useClipboard(account.privateKey);
  const csrCopy = useClipboard(account.CSR);

  const state = () => {
    const found = State.getStateByCodeAndCountry(account.province, account.country);

    return found?.name ?? account.province;
  };

  React.useEffect(() => {
    privateKeyCopy.setValue(account.privateKey);
    csrCopy.setValue(account.CSR);
  }, [account.privateKey]);

  return (
    <Modal {...modalProps} title={account.name}>
      <Box>
        <Tabs>
          <TabList>
            <Tab>{t('common.details')}</Tab>
            <Tab>{t('certificates.title')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Heading size="md" textDecoration="underline">
                {t('roaming.account_one')} {t('common.details')}
              </Heading>
              <Flex my={2} alignItems="center">
                <Heading size="sm" {...labelProps}>
                  {t('common.name')}:
                </Heading>
                <Text>{account.name}</Text>
              </Flex>
              <Flex my={2} alignItems="center">
                <Heading size="sm" {...labelProps}>
                  {t('roaming.common_name')}:
                </Heading>
                <Text>{account.commonName}</Text>
              </Flex>
              <Flex my={2} alignItems="center" hidden={account.description.length === 0}>
                <Heading size="sm" {...labelProps}>
                  {t('common.description')}:
                </Heading>
                <Text>{account.description}</Text>
              </Flex>
              <Heading size="md" textDecoration="underline" mt={2}>
                {t('roaming.global_reach')}
              </Heading>
              <Flex my={2} alignItems="center">
                <Heading size="sm" {...labelProps}>
                  {t('roaming.global_reach_account_id')}:
                </Heading>
                <Text>{account.GlobalReachAcctId}</Text>
              </Flex>
              <Flex my={2} alignItems="center">
                <Heading size="sm" {...labelProps}>
                  {t('roaming.private_key')}:
                </Heading>
                <Button onClick={privateKeyCopy.onCopy} size="sm" colorScheme="blue">
                  {privateKeyCopy.hasCopied ? 'Copied!' : t('common.copy')}
                </Button>
              </Flex>
              <Flex my={2} alignItems="center">
                <Heading size="sm" {...labelProps}>
                  CSR:
                </Heading>
                <Button onClick={csrCopy.onCopy} size="sm" colorScheme="blue">
                  {csrCopy.hasCopied ? 'Copied!' : t('common.copy')}
                </Button>
              </Flex>
              <Heading size="md" textDecoration="underline">
                {t('roaming.location_details_title')}
              </Heading>
              <Heading size="sm" my={2}>
                {account.city}, {state()},{' '}
                {COUNTRY_LIST.find((acc) => acc.value === account.country)?.label ?? account.country}
              </Heading>
              <Flex my={2} alignItems="center">
                <Heading size="sm" {...labelProps}>
                  {t('roaming.organization')}:
                </Heading>
                <Text>{account.organization}</Text>
              </Flex>
            </TabPanel>
            <TabPanel>
              <CertificatesTable account={account} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
