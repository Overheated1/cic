import { createSlice } from "@reduxjs/toolkit";

const LanguSlice = createSlice({
    name:"Languages",
    initialState:{
        Español:{
            deportes:"Deportes",
            ingresos:"Ingresos",
            primerDep:"Baloncesto",
            segundoDep:"Lucha",
            tercerDep:"Tiro con Arco",
            TextSupLog:"Registrarse",
            placeholderUs:"Usuario",
            placeholderPas:"Contraseña",
            botonLog:"Iniciar sesión",
            crearCuent:"Crear cuenta",
            mensajeCuent:"No tienes cuenta?,hazte una! ",
            botonRegis:"Registrarse",
            mensajeBienv:"Hola"
          },
          English:{
            deportes:"Sports",
            ingresos:"Income",
            primerDep:"Basketball",
            segundoDep:"Wrestling",
            tercerDep:"Archery",
            TextSupLog:"Login",
            placeholderUs:"User",
            placeholderPas:"Password",
            botonLog:"Sign up",
            crearCuent:"Create account",
            mensajeCuent:"Don't you have an account?,make yourself one! ",
            botonRegis:"Registrarse",
            mensajeBienv:"Hello"
          }
    },
    reducers:{
        setLang:(state,action) => {
            console.log("here")   
        }
    }
})
export default LanguSlice.reducer;