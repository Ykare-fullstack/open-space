import React from 'react'
import '../../styles/Atoms/NavTitle.css'
//composant de navigation h3
function NavTitle({ text }) {
    return (
        <div className="nav-title-wrapper">
            <h3 className="nav-title">{text}</h3>
        </div>
    )
}

export default NavTitle
