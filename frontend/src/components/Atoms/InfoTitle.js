import React from 'react'
import '../../styles/Atoms/InfoTitle.css'
//composant de titre d'encart informatif
function InfoTitle({ text }) {
    return (
        <div className="info-title-wrapper">
            <h3 className="info-title">{text}</h3>
        </div>
    )
}

export default InfoTitle
