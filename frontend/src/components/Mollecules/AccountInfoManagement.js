import '../../styles/Mollecules/AccountInfoManagement.css'

import React, { useState, useContext } from 'react'
import { LoginContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AccountInfoManagementInput from './AccountInfoManagementInput'

//fonction d'afficahge du panneau de modification des informations utilisateurs
//-------------------------------------------------------------------------------------------
function AccountInfoManagement() {
    const [showing, setShowing] = useState(false)
    const [passwordValue, setPasswordValue] = useState('')
    const { userData } = useContext(LoginContext)
    function toggleManagementInput() {
        const url = 'http://localhost:3001/api/user/check'
        const token = sessionStorage.getItem('token')
        const authPayload = {
            pass: passwordValue,
            userId: userData.userId,
        }
        const checkPass = {
            method: 'POST',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(url, checkPass)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.check)
                if (res.check) setShowing((v) => !v)
                else {
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //l'affichage du panneau de modification est toggle on/off via vérification du password
    return (
        <div className="account-info-management-frame">
            {showing ? (
                <AccountInfoManagementInput
                    showing={showing}
                    setShowing={setShowing}
                />
            ) : (
                <div>
                    <p>
                        veuillez saisir votre mot de passe afin d'accéder aux
                        options d'administrations du compte
                    </p>
                    <input
                        type="password"
                        onChange={(e) => setPasswordValue(e.target.value)}
                        aria-label="zone de saisie de votre mot de passe"
                    />
                    <button
                        type="submit"
                        onClick={toggleManagementInput}
                        className="submit-pass-button"
                        aria-label="accès aux fonctions d'administration via vérification du mot de passe"
                    >
                        <FontAwesomeIcon icon="fa-solid fa-wrench" size="2x" />
                    </button>
                </div>
            )}
        </div>
    )
}
export default AccountInfoManagement
