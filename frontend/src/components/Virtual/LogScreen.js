import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../../contexts'

const LogScreen = ({ children }) => {
    const { setLoginStatus } = useContext(LoginContext)
    const { setUserData } = useContext(LoginContext)
    const token = sessionStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token || token == null) {
            console.log('not logged in')
            navigate('/login')
        } else {
            let url = 'http://localhost:3001/api/checkedin/'
            let checkedinAndGetInfo = {
                method: 'GET',
                headers: new Headers({
                    authorization: token,
                }),
            }
            fetch(url, checkedinAndGetInfo)
                .then((response) => response.json())
                .then((authentification) => {
                    if (!authentification.authenticated) {
                        setLoginStatus(false)
                        console.log('Utilisateur  non authentifié')
                        navigate('/Login')
                    } else {
                        setLoginStatus(true)
                        url = 'http://localhost:3001/api/user/gu3'
                        fetch(url, checkedinAndGetInfo)
                            .then((response) => response.json())
                            .then((res) => {
                                setUserData({
                                    userId: res.userId,
                                    role: res.role,
                                    firstname: res.firstname,
                                    lastname: res.lastname,
                                    description: res.description,
                                    profilepicture: res.profilepicture,
                                })
                            })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [])

    return children
}
export default LogScreen
