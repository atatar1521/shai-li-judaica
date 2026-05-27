import { createClient } from '../server'

const mockCreateServerClient = jest.fn().mockReturnValue({ from: jest.fn() })
const mockGetAll = jest.fn().mockReturnValue([{ name: 'sb-auth', value: 'token' }])
const mockSet = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: (...args: unknown[]) => mockCreateServerClient(...args),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({ getAll: mockGetAll, set: mockSet })
  ),
}))

describe('supabase server client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  it('returns a supabase client', async () => {
    const client = await createClient()
    expect(client).toBeDefined()
  })

  it('calls createServerClient with env vars', async () => {
    await createClient()
    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'anon-key',
      expect.objectContaining({ cookies: expect.any(Object) })
    )
  })

  it('getAll() reads cookies from the store', async () => {
    await createClient()
    const cookiesArg = mockCreateServerClient.mock.calls[0][2].cookies
    const result = cookiesArg.getAll()
    expect(result).toEqual([{ name: 'sb-auth', value: 'token' }])
  })

  it('setAll() writes cookies to the store', async () => {
    await createClient()
    const cookiesArg = mockCreateServerClient.mock.calls[0][2].cookies
    const toSet = [{ name: 'sb-auth', value: 'newtoken', options: {} }]
    cookiesArg.setAll(toSet)
    expect(mockSet).toHaveBeenCalledWith('sb-auth', 'newtoken', {})
  })

  it('setAll() silently ignores errors (Server Component context)', async () => {
    mockSet.mockImplementation(() => { throw new Error('Cannot set cookie in SC') })
    await createClient()
    const cookiesArg = mockCreateServerClient.mock.calls[0][2].cookies
    expect(() => cookiesArg.setAll([{ name: 'x', value: 'y', options: {} }])).not.toThrow()
  })
})
