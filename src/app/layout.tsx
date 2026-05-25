import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'שי לי יודאיקה | פריטי יודאיקה יחודיים',
  description: 'אוסף מקיף של פריטי יודאיקה איכותיים — מחנוכיות ומזוזות ועד תכשיטים ואמנות יהודית לבית.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
