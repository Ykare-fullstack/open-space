import './styles/Pages/Hub.css'
import React from 'react'
import { CategoryProvider, LoginStatusProvider } from './contexts'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Banner from './components/Organisms/Banner'
import Account from './pages/Account'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Research from './pages/Research'
import Home from './pages/Home.jsx'
import OnePagePost from './pages/OnePagePost.jsx'
import OnePageProfile from './pages/OnePageProfile.jsx'
import PostRepair from './pages/PostRepair.jsx'
import LogScreen from './components/Virtual/LogScreen'
import PageTitle from './components/Atoms/PageTitle'

//Router de l'application : permet la redirection en fonction de l'URL entrée par l'utilisateur
//"logscreen" permet d'empecher l'accès sans Login
//"loginStatusProvider" gère le contexte de l'application (userData et loginStatus)
//-------------------------------------------------------------------------------------------
function Hub() {
    return (
        <Router>
            <LoginStatusProvider>
                <Banner />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <CategoryProvider>
                                <LogScreen>
                                    <PageTitle text="Bienvenue !" />
                                    <Home />
                                </LogScreen>
                            </CategoryProvider>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <LogScreen>
                                <PageTitle text="Administration du compte :" />
                                <Account />
                            </LogScreen>
                        }
                    />
                    <Route
                        path="/OnePageProfile/:userId"
                        element={
                            <LogScreen>
                                <PageTitle text="Profil utilisateur :" />
                                <OnePageProfile />
                            </LogScreen>
                        }
                    />
                    <Route
                        path="/onePagePost/:postId"
                        element={
                            <CategoryProvider>
                                <LogScreen>
                                    <PageTitle text="Publication :" />
                                    <OnePagePost />
                                </LogScreen>
                            </CategoryProvider>
                        }
                    />
                    <Route
                        path="/PostRepair/:postId"
                        element={
                            <CategoryProvider>
                                <LogScreen>
                                    <PageTitle text="Modification de publication :" />
                                    <PostRepair />
                                </LogScreen>
                            </CategoryProvider>
                        }
                    />
                    <Route
                        path="/Research"
                        element={
                            <LogScreen>
                                <PageTitle text="Recherche :" />
                                <Research />
                            </LogScreen>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <React.Fragment>
                                <PageTitle text="Page de création de compte :" />
                                <Signup />
                            </React.Fragment>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <React.Fragment>
                                <PageTitle text="Page d'Identification :" />
                                <Login />
                            </React.Fragment>
                        }
                    />
                </Routes>
            </LoginStatusProvider>
        </Router>
    )
}
export default Hub
