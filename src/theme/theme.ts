import { Tooltip, extendTheme } from '@chakra-ui/react';
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

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  font,
  breakpoints,
  colors: globalStyles.colors,
  styles: globalStyles.styles,
  components: {
    Alert: alertStyles.components.Alert,
    Badge: badgeStyles.components.Badge,
    Button: buttonStyles.components.Button,
    Drawer: drawerStyles.components.Drawer,
    Card: CardComponent.components.Card,
    CardBody: CardBodyComponent.components.CardBody,
    CardHeader: CardHeaderComponent.components.CardHeader,
    MainPanel: MainPanelComponent.components.MainPanel,
    PanelContent: PanelContentComponent.components.PanelContent,
    PanelContainer: PanelContainerComponent.components.PanelContainer,
  },
});

Tooltip.defaultProps = { ...Tooltip.defaultProps, hasArrow: true };
export default theme;
