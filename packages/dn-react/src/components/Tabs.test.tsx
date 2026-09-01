import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from './Tabs'

const Sample = (props: { defaultIndex?: number; onChange?: (index: number) => void }) => (
  <Tabs {...props}>
    <TabList label="Secciones">
      <Tab>Uno</Tab>
      <Tab>Dos</Tab>
      <Tab disabled>Tres</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>Contenido uno</TabPanel>
      <TabPanel>Contenido dos</TabPanel>
      <TabPanel>Contenido tres</TabPanel>
    </TabPanels>
  </Tabs>
)

describe('Tabs', () => {
  it('activa la primera pestana por defecto, como dn-ui', () => {
    render(<Sample />)

    expect(screen.getByRole('tab', { name: 'Uno' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contenido uno')
  })

  it('respeta defaultIndex', () => {
    render(<Sample defaultIndex={1} />)

    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contenido dos')
  })

  it('expone los roles de WAI-ARIA', () => {
    render(<Sample />)

    expect(screen.getByRole('tablist')).toHaveAccessibleName('Secciones')
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Uno' })).toHaveAttribute(
      'aria-controls',
      screen.getByRole('tabpanel').id
    )
  })

  it('cambia de pestana al pulsar', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('tab', { name: 'Dos' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contenido dos')
    expect(screen.getByRole('tab', { name: 'Uno' })).toHaveClass('tab-title')
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveClass('is-active')
  })

  it('solo la pestana activa es tabulable', () => {
    render(<Sample />)

    expect(screen.getByRole('tab', { name: 'Uno' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute('tabindex', '-1')
  })

  it('navega con las flechas y da la vuelta', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    screen.getByRole('tab', { name: 'Uno' }).focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Uno' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Dos' })).toHaveAttribute('aria-selected', 'true')
  })

  it('salta la pestana deshabilitada al navegar', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    screen.getByRole('tab', { name: 'Dos' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Tres' })).toHaveAttribute('aria-selected', 'false')
  })

  it('no activa una pestana deshabilitada al pulsarla', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('tab', { name: 'Tres' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contenido uno')
  })

  it('avisa del cambio con onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Sample onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'Dos' }))

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('funciona controlado desde fuera', () => {
    const { rerender } = render(
      <Tabs index={0}>
        <TabList>
          <Tab>Uno</Tab>
          <Tab>Dos</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Contenido uno</TabPanel>
          <TabPanel>Contenido dos</TabPanel>
        </TabPanels>
      </Tabs>
    )

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contenido uno')

    rerender(
      <Tabs index={1}>
        <TabList>
          <Tab>Uno</Tab>
          <Tab>Dos</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Contenido uno</TabPanel>
          <TabPanel>Contenido dos</TabPanel>
        </TabPanels>
      </Tabs>
    )

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contenido dos')
  })
})
