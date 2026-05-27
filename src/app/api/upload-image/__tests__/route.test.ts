import { POST } from '../route'
import { NextRequest } from 'next/server'

const mockUpload = jest.fn()
const mockGetPublicUrl = jest.fn()

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  })),
}))

function makeRequest(file: File | null): NextRequest {
  const fd = new FormData()
  if (file) fd.append('file', file)
  return new NextRequest('http://localhost/api/upload-image', {
    method: 'POST',
    body: fd,
  })
}

describe('POST /api/upload-image', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
    mockUpload.mockResolvedValue({ error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/img.jpg' } })
  })

  it('returns 400 when no file is provided', async () => {
    const res = await POST(makeRequest(null))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('No file provided')
  })

  it('returns 400 for non-image file type', async () => {
    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' })
    const res = await POST(makeRequest(file))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Only image files are allowed')
  })

  it('returns 400 when file exceeds 5MB', async () => {
    const bigContent = new Uint8Array(6 * 1024 * 1024)
    const file = new File([bigContent], 'big.jpg', { type: 'image/jpeg' })
    const res = await POST(makeRequest(file))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('File too large (max 5MB)')
  })

  it('returns 500 when Supabase upload fails', async () => {
    mockUpload.mockResolvedValue({ error: { message: 'Storage error' } })
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const res = await POST(makeRequest(file))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Storage error')
  })

  it('returns 200 with the public URL on success', async () => {
    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const res = await POST(makeRequest(file))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.url).toBe('https://example.com/img.jpg')
  })
})
