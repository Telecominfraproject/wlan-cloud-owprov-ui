import { extendTheme } from '@chakra-ui/react';
import CardComponent from './additions/card/Card';
import CardBodyComponent from './additions/card/CardBody';
import CardHeaderComponent from './additions/card/CardHeader';
import MainPanelComponent from './additions/layout/MainPanel';
import PanelContainerComponent from './additions/layout/PanelContainer';
import PanelContentComponent from './additions/layout/PanelContent';
import alertStyles from './components/alert';
import badgeStyles from './components/badge';
import buttonStyles from './components/button';
import drawerStyles from './components/drawer';
import breakpoints from './foundations/breakpoints';
import font from './foundations/fonts';
import globalStyles from './styles';

// import { mode } from "@chakra-ui/theme-tools";
export default extendTheme(
  { breakpoints }, // Breakpoints
  globalStyles,
  font, // Global styles
  buttonStyles, // Button styles
  badgeStyles, // Badge styles
  drawerStyles, // Sidebar variant for Chakra's drawer
  alertStyles,
  CardComponent, // Card component
  CardBodyComponent, // Card Body component
  CardHeaderComponent, // Card Header component
  MainPanelComponent, // Main Panel component
  PanelContentComponent, // Panel Content component
  PanelContainerComponent, // Panel Container component
);
