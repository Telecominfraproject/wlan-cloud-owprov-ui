import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useSelectList = ({ values, hasEmpty = false, valueKey, labelKey }) => {
  const { t } = useTranslation();

  const toReturn = useMemo(() => {
    if (!values) return null;
    if (valueKey && labelKey) {
      return hasEmpty
        ? [
            {
              value: '',
              label: t('common.none'),
            },
            ...values.map((data) => ({
              value: data[valueKey],
              label: data[labelKey],
            })),
          ]
        : values.map((data) => ({
            value: data[valueKey],
            label: data[labelKey],
          }));
    }
    return hasEmpty
      ? [
          {
            value: '',
            label: t('common.none'),
          },
          ...values.map((v) => ({
            value: v,
            label: v,
          })),
        ]
      : values.map((v) => ({
          value: v,
          label: v,
        }));
  }, [values, hasEmpty]);

  return toReturn;
};

export default useSelectList;
