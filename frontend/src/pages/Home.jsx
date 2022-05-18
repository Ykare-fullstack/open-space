import '../styles/Pages/App.css'
import React from 'react'
import { CategoryProvider } from '../contexts'
import Navigation from '../components/Organisms/Navigation'
import Billboard from '../components/Organisms/Billboard'
import Aside from '../components/Organisms/Aside'

// page principale de l'application contenant :
// - une section de navigation (gauche) lien vers: compte, cette page, les groupes et le tri de post par catégories
// - la section billboard qui affiche les posts selon les critères définis (plus récent par défaut)
// - un section informative
//-------------------------------------------------------------------------------------------
function Home() {
    return (
        <div className="home-bodyWrapper">
            <CategoryProvider>
                <Navigation />
                <div className="home-responsive-organizer">
                    <Billboard />
                    <Aside />
                </div>
            </CategoryProvider>
        </div>
    )
}

export default Home
