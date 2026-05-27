import { render, screen } from '@testing-library/react'
import TrustBar from '../TrustBar'

describe('TrustBar', () => {
  it('renders the free shipping trust item', () => {
    render(<TrustBar />)
    expect(screen.getByText(/משלוח חינם/i)).toBeInTheDocument()
  })

  it('renders the secure payment trust item', () => {
    render(<TrustBar />)
    expect(screen.getByText(/תשלום מאובטח/i)).toBeInTheDocument()
  })

  it('renders the returns trust item', () => {
    render(<TrustBar />)
    expect(screen.getByText(/החזרה/i)).toBeInTheDocument()
  })

  it('renders the customer satisfaction trust item', () => {
    render(<TrustBar />)
    expect(screen.getByText(/לקוחות/i)).toBeInTheDocument()
  })
})
