import React, { useEffect, useState } from 'react';
import { FormControl, Input, InputGroup } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
  setValue: (v: string, file?: File) => void;
  setFileName?: (v: string) => void;
  refreshId: string;
  accept: string;
  isHidden?: boolean;
  isStringFile?: boolean;
  wantBase64?: boolean;
}

const defaultProps = {
  setFileName: undefined,
  isHidden: false,
  isStringFile: false,
};

const FileInputButton = ({
  value,
  setValue,
  setFileName,
  refreshId,
  accept,
  isHidden,
  isStringFile,
  wantBase64,
}: Props) => {
  const [fileKey, setFileKey] = useState(uuid());
  let fileReader: FileReader | undefined;

  const handleStringFileRead = () => {
    if (fileReader) {
      const content = fileReader.result;
      if (content) {
        setValue(content as string);
      }
    }
  };

  const handleBase64FileRead = () => {
    if (fileReader) {
      const content = fileReader.result;
      if (content && typeof content === 'string') {
        const split = content.split('base64,');
        if (split[1]) {
          setValue(split[1] as string);
        }
      }
    }
  };

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      const newVal = URL.createObjectURL(file);
      if (wantBase64) {
        fileReader = new FileReader();
        fileReader.onloadend = handleBase64FileRead;
        fileReader.readAsDataURL(file);
      } else if (!isStringFile) {
        setValue(newVal, file);
        if (setFileName) setFileName(file.name ?? '');
      } else {
        fileReader = new FileReader();
        if (setFileName) setFileName(file.name);
        fileReader.onloadend = handleStringFileRead;
        fileReader.readAsText(file);
      }
    }
  };

  useEffect(() => {
    if (value === '') setFileKey(uuid());
  }, [refreshId, value]);

  return (
    <FormControl hidden={isHidden}>
      <InputGroup>
        <Input
          borderRadius="15px"
          pt={1}
          fontSize="sm"
          type="file"
          onChange={changeFile}
          key={fileKey}
          accept={accept}
        />
      </InputGroup>
    </FormControl>
  );
};

FileInputButton.defaultProps = defaultProps;

export default FileInputButton;
