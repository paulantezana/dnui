import type { ComponentType } from 'react'
import { Link, Route, Routes } from 'react-router'
import { Layout } from './site/Layout'
import { ALL_LINKS } from './site/nav'

import { Introduccion } from './pages/Introduccion'
import { Instalacion } from './pages/Instalacion'
import { AppPage } from './pages/AppPage'
import { Tema } from './pages/Tema'
import { Motor } from './pages/Motor'

import { ButtonPage } from './pages/ButtonPage'
import { IconPage } from './pages/IconPage'
import { BadgePage } from './pages/BadgePage'
import { AvatarPage } from './pages/AvatarPage'

import { CardPage } from './pages/CardPage'
import { DividerPage } from './pages/DividerPage'
import { EmptyPage } from './pages/EmptyPage'
import { JoinPage } from './pages/JoinPage'
import { ListPage } from './pages/ListPage'
import { TablePage } from './pages/TablePage'
import { CodeViewerPage } from './pages/CodeViewerPage'

import { FormPage } from './pages/FormPage'
import { TogglePage } from './pages/TogglePage'
import { ToggleGroupPage } from './pages/ToggleGroupPage'
import { ControlGroupPage } from './pages/ControlGroupPage'
import { UploadPage } from './pages/UploadPage'

import { NavigationPage } from './pages/NavigationPage'
import { MenuPage } from './pages/MenuPage'
import { TabsPage } from './pages/TabsPage'
import { CollapsePage } from './pages/CollapsePage'
import { PaginationPage } from './pages/PaginationPage'

import { AlertPage } from './pages/AlertPage'
import { MessagePage } from './pages/MessagePage'
import { ModalPage } from './pages/ModalPage'
import { TooltipPage } from './pages/TooltipPage'
import { FreezePage } from './pages/FreezePage'

/** Cada ruta declarada en `nav.ts` apunta aqui a su pagina. */
const PAGES: Record<string, ComponentType> = {
  '/': Introduccion,
  '/instalacion': Instalacion,
  '/app': AppPage,
  '/tema': Tema,
  '/motor': Motor,

  '/button': ButtonPage,
  '/icon': IconPage,
  '/badge': BadgePage,
  '/avatar': AvatarPage,

  '/card': CardPage,
  '/divider': DividerPage,
  '/empty': EmptyPage,
  '/join': JoinPage,
  '/list': ListPage,
  '/table': TablePage,
  '/code-viewer': CodeViewerPage,

  '/form': FormPage,
  '/toggle': TogglePage,
  '/toggle-group': ToggleGroupPage,
  '/control-group': ControlGroupPage,
  '/upload': UploadPage,

  '/navigation': NavigationPage,
  '/menu': MenuPage,
  '/tabs': TabsPage,
  '/collapse': CollapsePage,
  '/pagination': PaginationPage,

  '/alert': AlertPage,
  '/message': MessagePage,
  '/modal': ModalPage,
  '/tooltip': TooltipPage,
  '/freeze': FreezePage
}

const NoEncontrada = () => (
  <div className="empty">
    <p className="text-lg mb-2">Esa pagina no existe.</p>
    <Link to="/" className="text-primary underline">
      Volver al inicio
    </Link>
  </div>
)

export const App = () => (
  <Layout>
    <Routes>
      {ALL_LINKS.map((link) => {
        const Component = PAGES[link.path]
        return Component ? (
          <Route key={link.path} path={link.path} element={<Component />} />
        ) : null
      })}
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  </Layout>
)
