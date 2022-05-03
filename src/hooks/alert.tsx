/* eslint-disable no-use-before-define */
import React, { createContext, useContext, useState } from 'react'

export type AlertType = 'OtherErrors' | null // TODO: ここにエラーの種類を足していく

type AlertContextType = {
  alertType: AlertType
  setAlert: (alertType: AlertType) => void
  resetAlert: () => void
}

const AlertContext = createContext<AlertContextType>({ alertType: null, setAlert: () => {}, resetAlert: () => {} })

export const useAlertContext = () => { return useContext(AlertContext) }

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertType, setAlertType] = useState<AlertType>(null)
  const resetAlert = () => { setAlertType(null) }

  return (
    <AlertContext.Provider value={{ alertType, setAlert: setAlertType, resetAlert }}>
      {children}
    </AlertContext.Provider>
  )
}
