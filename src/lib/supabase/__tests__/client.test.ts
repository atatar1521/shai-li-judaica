import { createClient } from '../client'

const mockCreateBrowserClient = jest.fn().mockReturnValue({ from: jest.fn() })

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: unknown[]) => mockCreateBrowserClient(...args),
}))

describe('supabase browser client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  it('returns a supabase client', () => {
    const client = createClient()
    expect(client).toBeDefined()
  })

  it('calls createBrowserClient with env vars', () => {
    createClient()
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'anon-key'
    )
  })
})
