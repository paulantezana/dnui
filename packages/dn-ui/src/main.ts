import './main_dist.scss';

// Utilidades comunes
import { Icon }  from './utils/icon';
import { FormatNumber } from './utils/formatNumber';
import uniqueId  from './utils/unique-id';

import { LoadingState } from './utils/loadingState';
import { Theme } from './theme/theme';

// Componentes de interacción
import { Alert } from './components/alert';
import { Collapse } from './components/collapse';
import { Tooltip } from './components/tooltip';
import { Modal } from './components/modal';
import { Tab } from './components/tab';
import { Tree } from './components/tree';

// Componentes de formularios
import { Input } from './components/form';

// Componentes de tablas y filtros
import Table from './components/table';
import Filter from './components/filter';
import Pagination from './components/pagination';

// Componentes de navegación
import { Navigation, ActiveNavigation } from './components/navigation';
import Menu from './components/menu';

// Otras funcionalidades
import { Freeze } from './components/freeze';
import { Message } from './components/message';
import { Ripple } from './components/ripple';

export {
  Icon, uniqueId, FormatNumber, LoadingState,
  Theme, Alert, Collapse, Tooltip, Modal, Tab, Tree,
  Input, Table, Filter, Pagination, Navigation, ActiveNavigation,
  Menu, Freeze, Message, Ripple
};

// Extiende la interfaz global del objeto `window` para evitar errores de tipo
declare global {
  interface Window {
    PdCollapse: typeof Collapse;
    PdIcon: typeof Icon;
    PdUniqueId: typeof uniqueId;
    PdFormatNumber: typeof FormatNumber;
    PdLoadingState: typeof LoadingState;
    PdInput: typeof Input;
    PdFreeze: typeof Freeze;
    PdNavigation: typeof Navigation;
    PdActiveNavigation: typeof ActiveNavigation;
    PdMessage: typeof Message;
    PdModal: typeof Modal;
    PdTab: typeof Tab;
    PdTree: typeof Tree;
    PdTable: typeof Table;
    PdFilter: typeof Filter;
    PdPagination: typeof Pagination;
    PdMenu: typeof Menu;
    PdRipple: typeof Ripple;
    PdAlert: typeof Alert;
  }
}

// Asignación a window con tipos correctos
window.PdCollapse = Collapse;
window.PdIcon = Icon;
window.PdUniqueId = uniqueId;
window.PdFormatNumber = FormatNumber;
window.PdLoadingState = LoadingState;
window.PdInput = Input;
window.PdFreeze = Freeze;
window.PdNavigation = Navigation;
window.PdActiveNavigation = ActiveNavigation;
window.PdMessage = Message;
window.PdModal = Modal;
window.PdTab = Tab;
window.PdTree = Tree;
window.PdTable = Table;
window.PdFilter = Filter;
window.PdPagination = Pagination;
window.PdMenu = Menu;
window.PdRipple = Ripple;
window.PdAlert = Alert;

// Init Components
document.addEventListener('DOMContentLoaded', () => {
  console.log('NINIT DNUI UI LISTENSSS');
  Input();
  Modal.init();
  Tab.listen();
  Collapse.init();
  // Icon.render(); // Descomentarlo si es necesario
  Alert.listen();
  Menu.listen();
  Ripple();
});
