import { useEffect, useState } from 'react'

/**
 * Creates and maintains an object URL for a given File or Blob,
 * revoking it when the file changes or the component unmounts.
 */
export function useObjectUrl(file?: File | Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return url
}
