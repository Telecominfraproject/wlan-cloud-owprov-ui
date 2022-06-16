import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { Pencil } from 'phosphor-react';
import GoogleAuthenticatorModal from '../GoogleAuthenticatorModal';
import AddPhoneNumberModal from '../AddPhoneNumberModal';

interface Props {
  name: string;
  phoneName: string;
  label: string;
  setValidated?: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
}

const MfaSelectField: React.FC<Props> = ({
  name,
  phoneName,
  setValidated,
  isDisabled,
  label,
  isRequired,
  isHidden,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPhoneOpen, onOpen: onPhoneOpen, onClose: onPhoneClose } = useDisclosure();
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);
  const [{ value: phoneNumber }, , { setValue: setPhone }] = useField(phoneName);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (newValue === 'authenticator') onOpen();
    if (newValue === 'sms') onPhoneOpen();
    else setValue(newValue);

    setTouched(true);
    e.preventDefault();
  };

  const onSuccess = () => {
    setValue('authenticator');
  };
  const onPhoneSuccess = (newPhone: string) => {
    setValue('sms');
    setPhone(newPhone);
    if (setValidated) setValidated(true);
  };
  const handleEditPhoneClick = () => {
    onPhoneOpen();
  };

  return (
    <>
      <FormControl
        isInvalid={error !== undefined && touched}
        isRequired={isRequired}
        isDisabled={isDisabled}
        hidden={isHidden}
      >
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          {label}
        </FormLabel>
        <Select value={value} onChange={onChange} borderRadius="15px" fontSize="sm">
          <option value="">{t('common.none')}</option>
          <option value="email">{t('common.email')}</option>
          <option value="sms">{t('account.sms')}</option>
          <option value="authenticator">{t('account.google_authenticator')}</option>
        </Select>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <FormControl isDisabled={isDisabled} hidden={!phoneNumber || phoneNumber.length === 0}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          {t('account.phone_number')}
        </FormLabel>
        <InputGroup size="md">
          <Input type="text" borderRadius="15px" value={phoneNumber} isDisabled />
          <InputRightElement>
            <IconButton
              aria-label="Edit phone number"
              icon={<Pencil size={20} />}
              size="sm"
              color="gray"
              onClick={handleEditPhoneClick}
              isDisabled={phoneNumber.length === 0 || isDisabled}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <GoogleAuthenticatorModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />
      <AddPhoneNumberModal isOpen={isPhoneOpen} onClose={onPhoneClose} onSuccess={onPhoneSuccess} />
    </>
  );
};

export default MfaSelectField;
