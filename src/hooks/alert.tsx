/* eslint-disable no-use-before-define */
import React, { createContext, useContext, useState } from 'react'

type AlertType = 'OtherErrors' | null // TODO: ここにエラーの種類を足していく

type AlertContextType = {
  alertType: AlertType
  setAlertType: (alertType: AlertType) => void
}

const AlertContext = createContext<AlertContextType>({ alertType: null, setAlertType: () => {} })

export const useAlertContext = () => { return useContext(AlertContext) }

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertType, setAlertType] = useState<AlertType>(null)

  return (
    <AlertContext.Provider value={{ alertType, setAlertType }}>
      {children}
    </AlertContext.Provider>
  )
}
