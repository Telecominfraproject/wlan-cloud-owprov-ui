import React, { useState } from 'react';
import { Box, Center, Flex, useColorMode, useColorModeValue, Image } from '@chakra-ui/react';
import { LoginFormProps } from 'models/Login';
import darkLogo from '../../assets/Logo_Dark_Mode.svg';
import lightLogo from '../../assets/Logo_Light_Mode.svg';
import LoginForm from './LoginForm';
import ChangePasswordForm from './ChangePasswordForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import MfaForm from './MfaForm';

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState<LoginFormProps>({ form: 'login' });
  const { colorMode } = useColorMode();
  const loginBg = useColorModeValue('gray.100', 'gray.700');

  const getForm = () => {
    if (activeForm.form === 'login') return <LoginForm setActiveForm={setActiveForm} />;
    if (activeForm.form === 'change-password' && activeForm.data?.userId && activeForm.data?.password)
      return <ChangePasswordForm activeForm={activeForm} setActiveForm={setActiveForm} />;
    if (activeForm.form === 'forgot-password') return <ForgotPasswordForm setActiveForm={setActiveForm} />;
    if (activeForm.form === 'mfa') return <MfaForm activeForm={activeForm} setActiveForm={setActiveForm} />;
    return null;
  };

  return (
    <Flex position="relative" mb="40px" ml="10vw" w={{ base: '80%', md: '85%', lg: '85vw' }}>
      <Flex
        h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
        w="40%"
        maxW="40vw"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
      >
        <Box mt="60px" overflowX="hidden" h="100%" w="100%" right="0px" px="5%">
          <Center overflowX="hidden" h="100%" w="100%" alignItems="center">
            <Image w="100%" src={colorMode === 'light' ? lightLogo : darkLogo} />
          </Center>
        </Box>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="start"
        style={{ userSelect: 'none' }}
        w={{ base: '100%', sm: '100%', md: '80%', lg: '50%' }}
      >
        <Flex
          borderRadius="40px"
          direction="column"
          w="100%"
          bgColor={loginBg}
          p="48px"
          mx={{ base: '0px', md: '24px', lg: '40px' }}
          mt="60px"
          boxShadow={colorMode === 'light' ? 'xl' : 'dark-lg'}
        >
          {getForm()}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
