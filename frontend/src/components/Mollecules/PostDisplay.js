import '../../styles/Mollecules/PostDisplay.css'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { CategoryContext } from '../../contexts'
import DisplayedPost from './DisplayedPost'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//----------------------------------------------------------------------------------------
//Composant d'affichage des post de la page d'accueil
//scroll infini via l'état de la scrollbar
function PostDisplay() {
    const { category } = useContext(CategoryContext)
    const [postBuffer, setPostBuffer] = useState([])
    const [lastPostId, setLastPostId] = useState(0)

    //indicateur de mise en marche du fetch (envoyé par l'API)
    const [keepGoing, setKeepGoing] = useState(true)
    //en chargement
    const isLoading = useRef(true)
    //premier rendu
    const firstRender = useRef(true)
    var _ = require('underscore')
    let token = sessionStorage.getItem('token')

    //debounce pour résoudre conflit d'affichage au premier rendu
    var lazyLoad = _.debounce(loadContent, 300)

    //----------------------------------------------
    //loadContent va fetch le post suivant en fonction de l'ID du dernier post affiché
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
    //-----------------------------------------
    //fonction lancé au scroll
    //vérifie si l'utilisateur est en bas de page :
    //lance le fetch si l'API a renvoyé keepgoing true
    function check_if_needs_more_content() {
        let pixelsFromWindowBottomToBottom =
            0 + document.body.scrollHeight - window.scrollY - window.innerHeight
        if (pixelsFromWindowBottomToBottom < 100 && keepGoing) {
            if (!firstRender.current) {
                lazyLoad(lastPostId)
            }
        }
    }
    //vérifie après rendu si au scroll l'utilisateur a besoin de plus de contenu
    useEffect(() => {
        window.onscroll = _.throttle(function () {
            check_if_needs_more_content()
        }, 100)
    })
    //cas de modification de catgorie : reset du scroll infini
    //l'API gère les post envoyés en fonction de la catégorie
    useEffect(() => {
        setPostBuffer([])
        setKeepGoing(true)
        loadContent(0)
    }, [category])

    //affichage via mapping des post
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
