import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

describe('Hero', () => {
  beforeEach(() => render(<Hero />))

  it('renders the main headline', () => {
    expect(screen.getByRole('heading', { name: /מתנות/ })).toBeInTheDocument()
  })

  it('renders the hero badge', () => {
    expect(screen.getByText(/פריטי יודאיקה מובחרים/)).toBeInTheDocument()
  })

  it('renders the products CTA link', () => {
    const link = screen.getByRole('link', { name: /לקטלוג המוצרים/ })
    expect(link).toHaveAttribute('href', '#products')
  })

  it('renders the about CTA link', () => {
    const link = screen.getByRole('link', { name: /קצת עלינו/ })
    expect(link).toHaveAttribute('href', '#about')
  })

  it('renders the logo image', () => {
    expect(screen.getByAltText('שי לי יודאיקה')).toBeInTheDocument()
  })

  it('renders the Hanukkah collection caption', () => {
    expect(screen.getByText(/אוסף חנוכה 2025/)).toBeInTheDocument()
  })
})
