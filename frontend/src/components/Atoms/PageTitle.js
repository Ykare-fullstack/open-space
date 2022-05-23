import '../../styles/Atoms/PageTitle.css'
import React from 'react'
//composant de titre h1
function PageTitle(props) {
    return (
        <div id="page-title-wrapper">
            <h1>{props.text}</h1>
        </div>
    )
}
export default PageTitle
