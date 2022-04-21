import { Configuration, ConfigurationNestedProps } from 'models/Configuration';
import { useCallback, useEffect, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';

const useNestedConfigurationForm = ({
  defaultConfiguration,
}: {
  defaultConfiguration: Configuration[] | undefined;
}) => {
  const [configuration, setConfiguration] = useState<ConfigurationNestedProps | undefined>(undefined);

  const onConfigurationChange = useCallback((newConfiguration) => setConfiguration(newConfiguration), []);
  const reset = () => setConfiguration(undefined);

  const data = useMemo(() => {
    if (!configuration)
      return {
        isDirty: false,
        isValid: true,
        configuration: null,
      };

    return {
      isDirty: configuration.__form.isDirty === undefined ? false : configuration.__form.isDirty,
      isValid: configuration.__form.isValid,
      configuration: configuration.data,
    };
  }, [configuration]);

  const toReturn = useMemo(
    () => ({
      data,
      onChange: onConfigurationChange,
      reset,
    }),
    [data],
    // @ts-ignore
    isEqual,
  );

  useEffect(
    () => {
      if (defaultConfiguration) {
        onConfigurationChange({
          __form: {
            isDirty: false,
            isValid: true,
          },
          configuration: defaultConfiguration,
        });
      }
    },
    [defaultConfiguration],
    // @ts-ignore
    isEqual,
  );

  return toReturn;
};

export default useNestedConfigurationForm;
