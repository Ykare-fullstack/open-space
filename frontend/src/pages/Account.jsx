import React from 'react'
import AccountInfoDisplay from '../components/Mollecules/AccountInfoDisplay'
import AccountInfoManagement from '../components/Mollecules/AccountInfoManagement'
import GeneralNav from '../components/Mollecules/NavFrameGeneral'
import '../styles/Pages/Account.css'

// fonction d'affichage et modification des informations utilisateur, comprend :
// - Une section d'affichage des infos
// - Une section de modification desinformations utilisateurs

//note : les informations utilisateurs sont importées via le contexte
//-------------------------------------------------------------------------------------------
function Account() {
    return (
        <div className="account-body">
            <div className="account-nav">
                <GeneralNav />
            </div>

            <div className="account-dashboard">
                <AccountInfoDisplay />
                <AccountInfoManagement />
            </div>
        </div>
    )
}
export default Account

/*
 */
