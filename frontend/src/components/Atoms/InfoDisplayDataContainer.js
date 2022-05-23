import React from 'react'
import '../../styles/Atoms/InfoDisplayDataContainer.css'
//composant structure pour texte
function InfoDisplayDataContainer({ data }) {
    return (
        <div className="info-display-container">
            <p>{data}</p>
        </div>
    )
}
export default InfoDisplayDataContainer
