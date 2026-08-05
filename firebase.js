

// ================================
// FIREBASE
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ===================================
// CONFIGURACIÓN FIREBASE
// ===================================

const firebaseConfig = {
  apiKey: "AIzaSyCvgCDWXcD5se__g5qlv0w78PTL1txez2Y",
  authDomain: "elohim-barra-de-caf.firebaseapp.com",
  projectId: "elohim-barra-de-caf",
  storageBucket: "elohim-barra-de-caf.firebasestorage.app",
  messagingSenderId: "65613706707",
  appId: "1:65613706707:web:6df0344a37875c53622b26",
};


// ===================================
// INICIAR FIREBASE
// ===================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// CLOUDINARY
const CLOUD_NAME = "qvusvtts";
const UPLOAD_PRESET = "elohim_productos";


// ===================================
// PRODUCTOS
// ===================================

export async function obtenerProductos(){

    const snapshot = await getDocs(
        query(
            collection(db,"productos"),
            orderBy("orden")
        )
    );

    return snapshot.docs.map(documento => {

        const datos = documento.data();

        return {
            ...datos,
            id: documento.id
        };

    });

}


export async function actualizarProducto(id, datos){

    await updateDoc(
        doc(db,"productos",id),
        datos
    );

}

export async function agregarProducto(datos){

    await addDoc(
        collection(db, "productos"),
        datos
    );

}

export async function eliminarPedido(id){

    await deleteDoc(
        doc(db, "pedidos", id)
    );

}

export async function eliminarProducto(id){

    await deleteDoc(
        doc(db, "productos", id)
    );

}

export async function subirImagenProducto(file){

    const datos = new FormData();

    datos.append("file", file);
    datos.append("upload_preset", UPLOAD_PRESET);

    const respuesta = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: datos
        }
    );

    const json = await respuesta.json();

    if(json.secure_url){
        return json.secure_url;
    }

    throw new Error("No se pudo subir la imagen");
}

export async function eliminarImagenProducto(url){
    // Cloudinary no elimina imágenes desde el navegador.
    return true;
}

export async function actualizarStock(id, stock){

    await updateDoc(
        doc(db,"productos",id),
        {
            stock: stock
        }
    );

}


// ===================================
// ESCUCHAR PRODUCTOS EN TIEMPO REAL
// ===================================

export function escucharProductos(callback){

    return onSnapshot(
        query(
            collection(db, "productos"),
            orderBy("orden")
        ),
        snapshot => {

            console.log("🔥 FIREBASE RESPONDIÓ");
            console.log("Cantidad de documentos:", snapshot.docs.length);

            const productosFirebase = snapshot.docs.map(doc => ({

                id: doc.id,

                ...doc.data()

            }));

            console.log("📦 Productos recibidos:");
            console.log(productosFirebase);

            callback(productosFirebase);

        },

        error => {

            console.error("❌ ERROR DE FIRESTORE:");
            console.error(error);

        }

    );

}



// ===================================
// PEDIDOS
// ===================================

export async function obtenerPedidos() {

    const snapshot = await getDocs(
        collection(db, "pedidos")
    );

    return snapshot.docs.map(documento => {

    const datos = documento.data();

    return {
        ...datos,
        id: documento.id
    };
    });
}

export async function actualizarPedido(id, datos){

    await updateDoc(
        doc(db,"pedidos",id),
        datos
    );

}

// ===================================
// EXPORTAR FUNCIONES BASE DE FIREBASE
// ===================================

export {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp
};