import React, { useState, createContext } from 'react'
export const LoginContext = createContext()
export const CategoryContext = createContext()

//Contexte utilisé après login réussi et accessible dans toute l'application contenant :
// -les informations utilisateurs publiques (userData)
// -le statut de login (loginStatus = true or false)
export const LoginStatusProvider = ({ children }) => {
    const [loginStatus, setLoginStatus] = useState(false)
    const [userData, setUserData] = useState({})

    return (
        <LoginContext.Provider
            value={{ loginStatus, setLoginStatus, userData, setUserData }}
        >
            {children}
        </LoginContext.Provider>
    )
}

export const CategoryProvider = ({ children }) => {
    const [category, setCategory] = useState('init')
    const [postIndex, setPostIndex] = useState(0)

    return (
        <CategoryContext.Provider
            value={{ category, setCategory, postIndex, setPostIndex }}
        >
            {children}
        </CategoryContext.Provider>
    )
}
