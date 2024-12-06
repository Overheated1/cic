import { Routes,Route, Outlet } from "react-router-dom";
import { Login } from './Login';
import { lazy,Suspense } from "react";
import { getCookie } from "../utils/utils";
import { RequireAuth } from "./RequiredAuth";
import { NavBar } from './NavBar';
import { QualityControlSvg } from "./svg_components/QualityControlSvg";
import { AboutSvg } from "./svg_components/AboutSvg";
import { HelpSvg } from "./svg_components/HelpSvg";
import { AboutCard4Svg } from "./svg_components/AboutCard4Svg";
import NavigateHandler from "./NavigateHandler";
import Users from "./Users";
import Report from "./Report";
// import { AdminPanel } from "./AdminPanel";

const AdminPanel = lazy(() => import("./AdminPanel"));
const Repeatability = lazy(() => import("./Repeatability"));
const Reproducibility = lazy(() => import("./Reproducibility"));
const About = lazy(() => import("./About"));
const Help = lazy(() => import("./Help"));
const SampleElaboration = lazy(() => import("./SampleElaboration"));
const Home = lazy(() => import("./Home"));


export const RouteHandler = ({navigate}) => {
    const authToken = getCookie('auth_token');

    const isAuth = authToken !== null;

    let admin_menu_data = [
        {
            'tag':'Datos',
            'subMenu':[
                {
                    'tag' : 'Usuarios',
                    'to'  : '/Users',
                },
                // {
                //     'tag' : 'Repetibilidad',
                //     'to'  : '/Repetibilidad',
                // },
                // {
                //     'tag' : 'Reproducibilidad',
                //     'to'  : '/Reproducibilidad',
                // },
                // {
                //     'tag' : 'Elaboración de Muestras',
                //     'to'  : '/Elaboración-de-Muestras',
                // }
            ],
            'svgComponent':<QualityControlSvg/>
        },
        // {
        //     'tag':'Estadísticas',
        //     'to' : '/Estadísticas',
        //     'svgComponent':<AboutCard4Svg/>
        // },
    ]
    let laboratory_worker_menu_data = [
    {
        'tag':'Control de Calidad',
        'subMenu':[
            {
                'tag' : 'Repetibilidad',
                'to'  : '/Repetibilidad',
            },
            {
                'tag' : 'Reproducibilidad',
                'to'  : '/Reproducibilidad',
            },{
                'tag' : 'Elaboración de Muestras',
                'to'  : '/Elaboración-de-Muestras',
            }
        ],
        'svgComponent':<QualityControlSvg/>
    },
    {
        'tag':'Acerca',
        'to' : '/Acerca',
        'svgComponent':<AboutSvg/>
    },

    {
        'tag':'Ayuda',
        'to' : '/Ayuda',
        'svgComponent':<HelpSvg/>
    }
]
    return(
        <Suspense fallback={<h1>asdd</h1>}>
            <Routes>
                <Route element={<RequireAuth allowedLevels={[0,1]} />}>
                    <Route element={
                        <>
                            <NavBar navigate={navigate} data={[]} />
                            <Outlet />
                        </>
                    }>
                        <Route exact path="/Report" element={<Report />} />
                    </Route>
                </Route>
                <Route element={<RequireAuth allowedLevels={[0,2]} />}>
                    <Route element={
                        <>
                            <NavBar navigate={navigate} data={admin_menu_data} />
                            <Outlet />
                        </>
                    }>
                        <Route exact path="/Admin" element={<AdminPanel />} />
                        <Route exact path="/Users" element={<Users />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowedLevels={[0,2]} />}>
                    <Route element={
                        <>
                            <NavBar navigate={navigate} data={laboratory_worker_menu_data} />
                            <Outlet />
                        </>
                    }>
                        <Route exact path="/Home" element={<Home navigate={navigate} />} />
                        <Route exact path="/Repetibilidad" element={<Repeatability />} />
                        <Route exact path="/Reproducibilidad" element={<Reproducibility />} />
                        <Route exact path="/Acerca" element={<About />} />
                        <Route exact path="/Ayuda" element={<Help />} />
                        <Route exact path="/Elaboración de muestras" element={<SampleElaboration />} />
                    </Route>
                </Route>

                <Route exact path="/Login" element={<Login navigate={navigate} />} />
                <Route exact path="/" element={<NavigateHandler />} />
            </Routes>
        </Suspense>
);
} 
