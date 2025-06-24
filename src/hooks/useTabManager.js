import { useState } from 'react'

export const useTabManager = () => {
  const [isActiveTab] = useState(true) // Always active for now

  return { isActiveTab }
}
