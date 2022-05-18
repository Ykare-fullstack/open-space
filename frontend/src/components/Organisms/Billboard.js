import React from 'react'
import '../../styles/Organisms/Billboard.css'
import PostGenerator from '../Mollecules/PostGenerator'
import PostDisplay from '../Mollecules/PostDisplay'

function Billboard() {
    return (
        <div className="billboard-tab">
            <PostGenerator />
            <PostDisplay />
        </div>
    )
}

export default Billboard
