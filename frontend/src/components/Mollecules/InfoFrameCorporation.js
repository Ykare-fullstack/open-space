import React from 'react'
import '../../styles/Mollecules/InfoFrame.css'
import InfoTitle from '../Atoms/InfoTitle'

//message général de groupomania
function InfoFrameCorporation() {
    return (
        <div className="info-frame-wrapper">
            <InfoTitle text="Infos Générales" />
            <div className="info-frame">
                <p>
                    Une nouvelle Machine à café pour la salle de pause devrait
                    arriver en début de semaine prochaine.
                </p>
                <p>
                    Le C.E. a de nouvelles offres à vous proposer ! rendez-vous
                    sur leurs publications !
                </p>
                <p>Joyeuses Pâques !</p>
            </div>
        </div>
    )
}

export default InfoFrameCorporation
