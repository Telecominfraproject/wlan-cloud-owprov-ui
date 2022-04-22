import React from 'react';
import { Box, FormControl, LayoutProps, SpaceProps } from '@chakra-ui/react';
import AddressSearchBar from 'components/SearchBars/AddressSearchBar';
import { useFormikContext } from 'formik';
import { AddressObject } from 'models/Location';

const defaultProps = {
  namePrefix: '',
  isDisabled: false,
  isHidden: false,
};

interface Props extends LayoutProps, SpaceProps {
  namePrefix?: string;
  placeholder: string;
  isDisabled?: boolean;
  isHidden?: boolean;
}

const AddressSearchField: React.FC<Props> = ({ namePrefix, isDisabled, placeholder, isHidden, ...props }) => {
  const { setFieldValue, validateForm } = useFormikContext();

  const onSelect = (v: AddressObject) => {
    const city =
      v.locality.long_name ?? v.administrative_area_level_3.long_name ?? v.administrative_area_level_2.long_name;

    setFieldValue(
      `${namePrefix ? `${namePrefix}.` : ''}addressLineOne`,
      `${v.street_number.long_name} ${v.route.long_name}`,
    );
    setFieldValue(`${namePrefix ? `${namePrefix}.` : ''}city`, city);
    setFieldValue(`${namePrefix ? `${namePrefix}.` : ''}state`, v.administrative_area_level_1.long_name);
    setFieldValue(`${namePrefix ? `${namePrefix}.` : ''}postal`, v.postal_code.long_name);
    setFieldValue(`${namePrefix ? `${namePrefix}.` : ''}country`, v.country.short_name);
    setFieldValue(`${namePrefix ? `${namePrefix}.` : ''}geoCode`, JSON.stringify(v.geoCode));
    setTimeout(() => {
      validateForm();
    }, 500);
  };

  return (
    <Box {...props}>
      <FormControl isDisabled={isDisabled} hidden={isHidden}>
        <AddressSearchBar isDisabled={isDisabled} onSelect={onSelect} placeholder={placeholder} />
      </FormControl>
    </Box>
  );
};

AddressSearchField.defaultProps = defaultProps;

export default AddressSearchField;
