//  ORGANISME
import '../../styles/Organisms/Navigation.css'
import React from 'react'
import GeneralNav from '../Mollecules/NavFrameGeneral'
import CategoriesNav from '../Mollecules/NavFrameCategories'

//Bloc de navigation comprenant :
// - navigation générale dans l'app (compte, page principale, recherche)
// - selection de catégories pour l'affichage des posts

//-------------------------------------------------------------------------------------------
function Navigation() {
    return (
        <div className="navigation-tab">
            <GeneralNav />
            <CategoriesNav />
        </div>
    )
}

export default Navigation
