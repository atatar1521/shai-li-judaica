import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  beforeEach(() => render(<Footer />))

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

  it('renders contact section with phone and email', () => {
    expect(screen.getByText('צרו קשר')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /050/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /info@/ })).toBeInTheDocument()
  })

  it('renders copyright footer', () => {
    expect(screen.getByText(/2025 שי לי יודאיקה/)).toBeInTheDocument()
  })
})
