import * as React from 'react';
import { State } from 'country-state-city';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import useFastField from 'hooks/useFastField';

type Props = {
  isDisabled?: boolean;
};

const StatePicker = ({ isDisabled }: Props) => {
  const { t } = useTranslation();
  const country = useFastField<string>({ name: 'country' });
  const province = useFastField<string>({ name: 'province' });
  const [options, setOptions] = React.useState<{ label: string; value: string }[]>([]);

  React.useEffect(() => {
    if (country.value) {
      const states = State.getStatesOfCountry(country.value);
      setOptions(states.map((s) => ({ label: s.name, value: s.isoCode })));
      if (states[0]) province.onChange(states[0].isoCode);
    }
  }, [country.value]);

  if (options.length === 0)
    return (
      <StringField
        name="province"
        label={`${t('roaming.province')}/${t('roaming.state')}`}
        isRequired
        isDisabled={isDisabled}
        w="300px"
      />
    );

  return (
    <SelectField
      name="province"
      label={`${t('roaming.province')}/${t('roaming.state')}`}
      isRequired
      isDisabled={isDisabled}
      w="max-content"
      options={options}
    />
  );
};

export default StatePicker;
