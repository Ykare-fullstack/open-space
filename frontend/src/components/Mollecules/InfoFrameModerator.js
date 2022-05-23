import React from 'react'
import '../../styles/Mollecules/InfoFrame.css'
import InfoTitle from '../Atoms/InfoTitle'

//espace de modération
function InfoFrameModerator() {
    return (
        <div className="info-frame-wrapper">
            <InfoTitle text="Infos de Modérations" />
            <div className="info-frame">
                <p>Bienvenue sur Open-Space !</p>
                <p>
                    Quelques règles sont à respecter afin que nous puissions
                    tous profiter de cet espace :
                </p>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    )
}

export default InfoFrameModerator
