import React, { useContext } from 'react'
import '../../styles/Mollecules/NavFrame.css'
import NavTitle from '../Atoms/NavTitle'
import { CategoryContext } from '../../contexts/index'
//selection de l'affichage par catégorie
function CategoriesNav() {
    const { setCategory } = useContext(CategoryContext)
    function updateCategory(e) {
        setCategory(e.target.value)
    }
    return (
        <form className="nav-frame" id="category-nav-frame">
            <NavTitle text="Catégories" />
            <div className="nav-frame-category-input">
                <label htmlFor="init" className="input-label">
                    <input
                        type="radio"
                        name="category"
                        id="init"
                        value="init"
                        onChange={updateCategory}
                    />
                    <p>Toutes</p>
                </label>
                <label htmlFor="Actualités" className="input-label">
                    <input
                        type="radio"
                        name="category"
                        id="Actualités"
                        value="news"
                        onChange={updateCategory}
                    />
                    <p>Actualités</p>
                </label>
                <label htmlFor="Vacances" className="input-label">
                    <input
                        type="radio"
                        name="category"
                        id="Vacances"
                        value="holidays"
                        onChange={updateCategory}
                    />
                    <p>Vacances</p>
                </label>
                <label htmlFor="Idées" className="input-label">
                    <input
                        type="radio"
                        name="category"
                        id="Idées"
                        value="ideas"
                        onChange={updateCategory}
                    />
                    <p>Idées</p>
                </label>
                <label htmlFor="Divers" className="input-label">
                    <input
                        type="radio"
                        name="category"
                        id="Divers"
                        value="diverse"
                        onChange={updateCategory}
                    />
                    <p>Divers</p>
                </label>
                <label htmlFor="CE" className="input-label">
                    <input
                        type="radio"
                        name="category"
                        id="CE"
                        value="CE"
                        onChange={updateCategory}
                    />
                    <p>CE</p>
                </label>
            </div>
        </form>
    )
}

export default CategoriesNav
