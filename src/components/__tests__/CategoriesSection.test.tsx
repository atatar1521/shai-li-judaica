import { render, screen, fireEvent } from '@testing-library/react'
import CategoriesSection from '../CategoriesSection'

const CATS_4 = [
  { name: 'חנוכיות' },
  { name: 'מזוזות' },
  { name: 'תכשיטים' },
  { name: 'מתנות' },
]

const CATS_8 = [
  { name: 'אומנות' },
  { name: 'נטלות' },
  { name: 'קופות צדקה' },
  { name: 'חנוכיות' },
  { name: 'מזוזות' },
  { name: 'תכשיטים' },
  { name: 'שבת וחגים' },
  { name: 'מתנות' },
]

describe('CategoriesSection', () => {
  it('renders all categories when count is 4 or fewer', () => {
    render(<CategoriesSection categories={CATS_4} />)
    CATS_4.forEach(c => expect(screen.getByText(c.name)).toBeInTheDocument())
  })

  it('does not show "see all" button when 4 or fewer categories', () => {
    render(<CategoriesSection categories={CATS_4} />)
    expect(screen.queryByRole('button', { name: /כל הקטגוריות/ })).not.toBeInTheDocument()
  })

  it('shows first 4 categories without hidden class', () => {
    render(<CategoriesSection categories={CATS_8} />)
    const links = screen.getAllByRole('link')
    const first4 = links.slice(0, 4)
    first4.forEach(l => {
      expect(l).not.toHaveClass('cat--hidden')
      expect(l).not.toHaveClass('cat--desktop-only')
    })
  })

  it('marks categories 5-6 as desktop-only', () => {
    render(<CategoriesSection categories={CATS_8} />)
    const links = screen.getAllByRole('link')
    expect(links[4]).toHaveClass('cat--desktop-only')
    expect(links[5]).toHaveClass('cat--desktop-only')
  })

  it('marks categories 7+ as hidden', () => {
    render(<CategoriesSection categories={CATS_8} />)
    const links = screen.getAllByRole('link')
    expect(links[6]).toHaveClass('cat--hidden')
    expect(links[7]).toHaveClass('cat--hidden')
  })

  it('shows "כל הקטגוריות" button when more than 4 categories', () => {
    render(<CategoriesSection categories={CATS_8} />)
    expect(screen.getByRole('button', { name: /כל הקטגוריות/ })).toBeInTheDocument()
  })

  it('drawer is not visible initially', () => {
    render(<CategoriesSection categories={CATS_8} />)
    expect(screen.queryByText('כל הקטגוריות', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('opens drawer when "see all" button is clicked', () => {
    render(<CategoriesSection categories={CATS_8} />)
    fireEvent.click(screen.getByRole('button', { name: /כל הקטגוריות/ }))
    expect(screen.getByText('כל הקטגוריות', { selector: 'h3' })).toBeInTheDocument()
  })

  it('drawer shows all categories', () => {
    render(<CategoriesSection categories={CATS_8} />)
    fireEvent.click(screen.getByRole('button', { name: /כל הקטגוריות/ }))
    CATS_8.forEach(c => {
      expect(screen.getAllByText(c.name).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('closes drawer when X button is clicked', () => {
    render(<CategoriesSection categories={CATS_8} />)
    fireEvent.click(screen.getByRole('button', { name: /כל הקטגוריות/ }))
    fireEvent.click(screen.getByRole('button', { name: 'סגור' }))
    expect(screen.queryByText('כל הקטגוריות', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('closes drawer when backdrop is clicked', () => {
    render(<CategoriesSection categories={CATS_8} />)
    fireEvent.click(screen.getByRole('button', { name: /כל הקטגוריות/ }))
    fireEvent.click(screen.getByTestId('drawer-backdrop'))
    expect(screen.queryByText('כל הקטגוריות', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('each category link in the grid points to /shop with correct param', () => {
    render(<CategoriesSection categories={CATS_4} />)
    const link = screen.getByRole('link', { name: /חנוכיות/ })
    expect(link).toHaveAttribute('href', '/shop?cat=%D7%97%D7%A0%D7%95%D7%9B%D7%99%D7%95%D7%AA')
  })
})
