import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 1, 2, - 3 );
camera.lookAt( 0, 1, 0 );


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x555555 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
// hemiLight.position.set( 0, 0, 20 );
// scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( - 3, 10, - 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

//scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

// ground

const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshPhongMaterial( { color: 0xdddddd, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
// mesh.receiveShadow = true;
scene.add( mesh );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const loader = new GLTFLoader();

const gltf = await loader.loadAsync('kr10.glb');
scene.add(gltf.scene);
const base = gltf.scene.children[0];
const shoulder = base.children[0];
const arm = shoulder.children[0];
const elbow = arm.children[0];
const forearm = elbow.children[0];
const hand = forearm.children[0];

// loader.load( 'kr10.glb', function ( gltf ) {
//     const base = gltf.scene.children[0];
//     const shoulder = base.children[0];
//
//     scene.add( gltf.scene );
//     console.log(gltf)
//     console.log(shoulder)
//
// }, undefined, function ( error ) {
//
//     console.error( error );
//
// } );



function animate() {
    requestAnimationFrame( animate );
    shoulder.rotation.y += 0.01;
    forearm.rotation.x -= 0.01;
    controls.update();
    renderer.render( scene, camera );

}