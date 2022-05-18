import React, { useContext, useEffect } from 'react'
import { PostContext } from '../../contexts/index'
import { useNavigate } from 'react-router-dom'
function GoToOnePage(postToSend) {
    const { setPost } = useContext(PostContext)
    const navigate = useNavigate()
    function goToOnePage() {
        setPost(postToSend)
    }
    useEffect(() => {
        navigate('/OnePagePost')
    }, [setPost])
    return <button onClick={goToOnePage}></button>
}

export default GoToOnePage
