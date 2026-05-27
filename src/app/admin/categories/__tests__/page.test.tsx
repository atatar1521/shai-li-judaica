import { render, screen } from '@testing-library/react'
import CategoriesPage from '../page'

const mockFrom = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    from: mockFrom,
  })),
}))

jest.mock('../AddCategoryForm', () => ({
  __esModule: true,
  default: () => <div data-testid="add-category-form" />,
}))

jest.mock('../DeleteCategoryButton', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <button data-testid="delete-btn">{name}</button>,
}))

function setupCategories(categories: object[] | null) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: categories }),
  })
}

describe('CategoriesPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows empty state when there are no categories', async () => {
    setupCategories([])
    const result = await CategoriesPage()
    render(result as React.ReactElement)
    expect(screen.getByText('אין קטגוריות עדיין')).toBeInTheDocument()
  })

  it('renders each category name in the list', async () => {
    setupCategories([
      { id: 'c1', name: 'חנוכיות', display_order: 1, created_at: '2024-01-01T00:00:00Z' },
      { id: 'c2', name: 'מזוזות', display_order: 2, created_at: '2024-01-02T00:00:00Z' },
    ])
    const result = await CategoriesPage()
    render(result as React.ReactElement)
    expect(screen.getByText('חנוכיות')).toBeInTheDocument()
    expect(screen.getByText('מזוזות')).toBeInTheDocument()
  })

  it('renders the add-category form', async () => {
    setupCategories([])
    const result = await CategoriesPage()
    render(result as React.ReactElement)
    expect(screen.getByTestId('add-category-form')).toBeInTheDocument()
  })

  it('renders a delete button for each category', async () => {
    setupCategories([
      { id: 'c1', name: 'חנוכיות', display_order: 1, created_at: '2024-01-01T00:00:00Z' },
      { id: 'c2', name: 'מזוזות', display_order: 2, created_at: '2024-01-02T00:00:00Z' },
    ])
    const result = await CategoriesPage()
    render(result as React.ReactElement)
    expect(screen.getAllByTestId('delete-btn')).toHaveLength(2)
  })
})
