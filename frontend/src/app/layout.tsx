'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './globals.css'

// 必要に応じてカスタムテーマを定義
const theme = extendTheme({
  // カスタマイズが必要な場合はここに追加
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}
