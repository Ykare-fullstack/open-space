import React from 'react'
import ReactDOM from 'react-dom/client'
import Hub from './Hub'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import { library } from '@fortawesome/fontawesome-svg-core'
import './assets/fonts/Brolachess-nRJm4.ttf'
import './assets/fonts/Nalieta-nR5EP.otf'
import {
    faMagnifyingGlass,
    faFileArrowUp,
    faArrowRightFromBracket,
    faCheckSquare,
    faCheck,
    faCoffee,
    faThumbsUp,
    faThumbsDown,
    faComment,
    faPaperPlane,
    faPaperclip,
    faSpinner,
    faTrashAlt,
    faPenAlt,
    faRotateLeft,
    faWrench,
    faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import './styles/index.css'
library.add(
    faCircleXmark,
    faMagnifyingGlass,
    faFileArrowUp,
    faArrowRightFromBracket,
    faCheckSquare,
    faCheck,
    faCoffee,
    faThumbsUp,
    faThumbsDown,
    faComment,
    faPaperPlane,
    faPaperclip,
    faSpinner,
    faTrashAlt,
    faPenAlt,
    faRotateLeft,
    faWrench
)
disableReactDevTools()
//"Plug" allant s'injecter dans #root dans index.html
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Hub />)
