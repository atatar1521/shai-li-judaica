import { render, screen } from '@testing-library/react'
import NewProductPage from '../new/page'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/components/ProductForm', () => ({
  __esModule: true,
  default: ({ initial }: { initial?: object }) => (
    <div data-testid="product-form" data-has-initial={!!initial} />
  ),
}))

describe('NewProductPage', () => {
  it('renders the page heading', () => {
    render(<NewProductPage />)
    expect(screen.getByText('הוספת מוצר חדש')).toBeInTheDocument()
  })

  it('renders ProductForm without initial data', () => {
    render(<NewProductPage />)
    const form = screen.getByTestId('product-form')
    expect(form).toBeInTheDocument()
    expect(form.getAttribute('data-has-initial')).toBe('false')
  })

  it('renders back link to admin', () => {
    render(<NewProductPage />)
    expect(screen.getByRole('link', { name: /חזרה/ })).toHaveAttribute('href', '/admin')
  })
})
