//ORGANISME
import '../../styles/Organisms/Banner.css'
import React from 'react'

import logo from '../../assets/icon-left-font-monochrome-white.png'
import LinkedTitle from '../Atoms/LinkedTitle'

//bannière de l'application comprenant
// -le logo "groupomania"
// -le logo/titre de l'application (lien vers la page /home)
// -Un bouton de logout
//-------------------------------------------------------------------------------------------
function Banner() {
    //----------------------
    //fonction de logout, clear sessionStorage

    //----------------------

    //l'affichage du bouton de logout est conditionnellement lié au loginStatus (ternaire)
    return (
        <div className="banner">
            <div className="logo-open-space-wrapper">
                <LinkedTitle />
            </div>
            <div className="logo-groupo-wrapper">
                <img
                    src={logo}
                    className="logo-groupomania"
                    alt="logo groupomania"
                />
            </div>
        </div>
    )
}

export default Banner
