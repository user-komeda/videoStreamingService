import { useState } from 'react'

interface UseSubscriptionProps {
  initialIsSubscribed?: boolean
}

export const useSubscription = ({
  initialIsSubscribed = false,
}: UseSubscriptionProps = {}) => {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed)

  const handleToggleSubscribe = () => {
    setIsSubscribed((prev) => !prev)
  }

  return {
    isSubscribed,
    handleToggleSubscribe,
  }
}
