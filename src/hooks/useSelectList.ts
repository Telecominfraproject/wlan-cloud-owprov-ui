import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  values: string[] | { [key: string]: string }[] | any[];
  hasEmpty?: boolean;
  valueKey?: string;
  labelKey?: string;
}

const useSelectList = ({ values, hasEmpty = false, valueKey, labelKey }: Props) => {
  const { t } = useTranslation();

  const toReturn = useMemo(() => {
    if (!values) return [];
    return hasEmpty
      ? [
          {
            value: '',
            label: t('common.none'),
          },
          ...values.map((data: string | { [key: string]: string }) => ({
            value: typeof data === 'string' ? data : data[valueKey ?? ''] ?? '',
            label: typeof data === 'string' ? data : data[labelKey ?? ''] ?? '',
          })),
        ]
      : values.map((data: string | { [key: string]: string }) => ({
          value: typeof data === 'string' ? data : data[valueKey ?? ''] ?? '',
          label: typeof data === 'string' ? data : data[labelKey ?? ''] ?? '',
        }));
  }, [values, hasEmpty]);

  return toReturn;
};

export default useSelectList;
