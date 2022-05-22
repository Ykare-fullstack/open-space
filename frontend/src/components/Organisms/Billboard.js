import React, { useState } from 'react'
import '../../styles/Organisms/Billboard.css'
import PostGenerator from '../Mollecules/PostGenerator'
import PostDisplay from '../Mollecules/PostDisplay'

function Billboard() {
    const [hasUpdated, setHasUpdated] = useState(false)
    return (
        <div className="billboard-tab">
            <PostGenerator
                setHasUpdated={setHasUpdated}
                hasUpdated={hasUpdated}
            />
            <PostDisplay />
        </div>
    )
}

export default Billboard
