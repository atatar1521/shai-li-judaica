import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = '972538698008'
    render(<Footer />)
  })

  it('renders brand name', () => {
    expect(screen.getByText(/שי לי/, { selector: 'a' })).toBeInTheDocument()
  })

  it('renders navigation section', () => {
    expect(screen.getByText('ניווט')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'קטגוריות' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'מוצרים' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'עלינו' })).toBeInTheDocument()
  })

  it('renders customer service section', () => {
    expect(screen.getByText('שירות לקוחות')).toBeInTheDocument()
    expect(screen.getByText(/משלוחים/)).toBeInTheDocument()
  })

  it('renders contact section with real phone number from env', () => {
    expect(screen.getByText('צרו קשר')).toBeInTheDocument()
    const phoneLink = screen.getByRole('link', { name: /053/ })
    expect(phoneLink).toHaveAttribute('href', 'tel:+972538698008')
  })

  it('renders contact email', () => {
    expect(screen.getByRole('link', { name: /Tair060215@gmail\.com/ })).toBeInTheDocument()
  })

  it('renders WhatsApp link pointing to wa.me with correct number', () => {
    const waLink = screen.getByRole('link', { name: 'WhatsApp' })
    expect(waLink).toHaveAttribute('href', 'https://wa.me/+972538698008')
  })

  it('renders copyright footer', () => {
    expect(screen.getByText(/2025 שי לי יודאיקה/)).toBeInTheDocument()
  })
})
