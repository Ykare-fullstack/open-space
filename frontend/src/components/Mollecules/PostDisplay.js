import '../../styles/Mollecules/PostDisplay.css'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { CategoryContext } from '../../contexts'
import DisplayedPost from './DisplayedPost'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function PostDisplay() {
    const { category } = useContext(CategoryContext)
    const [postBuffer, setPostBuffer] = useState([])
    const [lastPostId, setLastPostId] = useState(0)
    const [keepGoing, setKeepGoing] = useState(true)
    const isLoading = useRef(true)
    const firstRender = useRef(true)
    var _ = require('underscore')
    let token = sessionStorage.getItem('token')

    var lazyLoad = _.debounce(loadContent, 300)
    function loadContent(id) {
        const url =
            'http://localhost:3001/api/publication/gp3/' + category + '/' + id
        const getPost = {
            method: 'GET',
            headers: new Headers({
                authorization: token,
            }),
        }
        isLoading.current = true
        fetch(url, getPost)
            .then((response) => response.json())
            .then((postObject) => {
                if (postObject.keepGoing === false) {
                    setKeepGoing(false)
                    isLoading.current = false
                } else {
                    console.log(postObject)

                    setPostBuffer((postBuffer) => [...postBuffer, postObject])
                    setLastPostId(postObject.idPost)

                    firstRender.current = false
                    isLoading.current = false
                }
            })
            .catch((err) => console.log({ err: err.message }))
    }

    function check_if_needs_more_content() {
        let pixelsFromWindowBottomToBottom =
            0 + document.body.scrollHeight - window.scrollY - window.innerHeight
        if (pixelsFromWindowBottomToBottom < 100 && keepGoing) {
            if (!firstRender.current) {
                lazyLoad(lastPostId)
            }
        }
    }

    useEffect(() => {
        window.onscroll = _.throttle(function () {
            check_if_needs_more_content()
        }, 100)
    })

    useEffect(() => {
        setPostBuffer([])
        setKeepGoing(true)
        loadContent(0)
    }, [category])
    return (
        <div className="display-tab">
            {postBuffer.map((post, index) => (
                <DisplayedPost key={index} post={post} />
            ))}

            {keepGoing ? null : (
                <div className="black-rabbit">
                    <FontAwesomeIcon
                        icon="fa-solid fa-circle-xmark"
                        size="4x"
                    />
                    <p>plus de post :</p>
                </div>
            )}
        </div>
    )
}
export default PostDisplay
