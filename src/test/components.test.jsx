import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TierBadge from '../components/UI/TierBadge'
import ItemImage from '../components/UI/ItemImage'

describe('TierBadge', () => {
  it('renders T0 with gray styling', () => {
    render(<TierBadge tier={0} />)
    const badge = screen.getByText('T0')
    expect(badge).toBeInTheDocument()
    expect(badge.style.backgroundColor).toBeTruthy()
  })

  it('renders T1', () => {
    render(<TierBadge tier={1} />)
    expect(screen.getByText('T1')).toBeInTheDocument()
  })

  it('renders T2', () => {
    render(<TierBadge tier={2} />)
    expect(screen.getByText('T2')).toBeInTheDocument()
  })

  it('renders T3', () => {
    render(<TierBadge tier={3} />)
    expect(screen.getByText('T3')).toBeInTheDocument()
  })

  it('renders T4 with golden styling', () => {
    render(<TierBadge tier={4} />)
    const badge = screen.getByText('T4')
    expect(badge).toBeInTheDocument()
    expect(badge.style.color).toBeTruthy()
  })

  it('defaults to T0 when tier is undefined', () => {
    render(<TierBadge />)
    expect(screen.getByText('T0')).toBeInTheDocument()
  })

  it('defaults to T0 when tier is null', () => {
    render(<TierBadge tier={null} />)
    expect(screen.getByText('T0')).toBeInTheDocument()
  })
})

describe('ItemImage', () => {
  it('renders an img element when src is provided', () => {
    render(
      <ItemImage
        src="https://www.tibiawiki.com.br/images/Falcon_Plate.gif"
        category="armadura"
        alt="Falcon Plate"
      />
    )
    const img = screen.getByRole('img', { name: 'Falcon Plate' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://www.tibiawiki.com.br/images/Falcon_Plate.gif')
  })

  it('shows fallback emoji when src is empty', () => {
    render(<ItemImage src="" category="arma" />)
    expect(screen.getByText('⚔️')).toBeInTheDocument()
  })

  it('shows fallback emoji when src is null', () => {
    render(<ItemImage src={null} category="armadura" />)
    expect(screen.getByText('🛡️')).toBeInTheDocument()
  })

  it('uses correct fallback for each category', () => {
    const cases = [
      ['arma', '⚔️'],
      ['armadura', '🛡️'],
      ['acessório', '💍'],
      ['montaria', '🐴'],
      ['outfit', '👘'],
      ['misc', '📦'],
    ]
    cases.forEach(([cat, emoji]) => {
      const { unmount } = render(<ItemImage src={null} category={cat} />)
      expect(screen.getByText(emoji)).toBeInTheDocument()
      unmount()
    })
  })

  it('respects custom size prop', () => {
    render(
      <ItemImage
        src="https://www.tibiawiki.com.br/images/Falcon_Plate.gif"
        category="armadura"
        size={64}
        alt="test"
      />
    )
    const img = screen.getByRole('img', { name: 'test' })
    expect(img).toHaveAttribute('width', '64')
    expect(img).toHaveAttribute('height', '64')
  })

  it('defaults to 32px size', () => {
    render(
      <ItemImage
        src="https://www.tibiawiki.com.br/images/Falcon_Plate.gif"
        category="armadura"
        alt="test"
      />
    )
    const img = screen.getByRole('img', { name: 'test' })
    expect(img).toHaveAttribute('width', '32')
    expect(img).toHaveAttribute('height', '32')
  })

  it('uses 📦 as fallback for unknown category', () => {
    render(<ItemImage src={null} category="unknown_cat" />)
    expect(screen.getByText('📦')).toBeInTheDocument()
  })
})
