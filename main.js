import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'lil-gui';
// import * as THREE from './node_modules/three/build/three.module.min.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js';

all()
async function all() {
    // Camera and scene
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(1, 2, -3);
    camera.lookAt(0, 1, 0);


    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555555);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

// Lights

// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
// hemiLight.position.set( 0, 0, 20 );
// scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight(0xffffff, 15);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);

// Objects (Models)

//scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

// ground
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshPhongMaterial({
        color: 0x555555,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

//robot
    const loader = new GLTFLoader();

    const gltf = await loader.loadAsync('kr10.glb');
    scene.add(gltf.scene);
    const base = gltf.scene.children[0];
    const shoulder = base.children[0];
    const arm = shoulder.children[0];
    const elbow = arm.children[0];
    const forearm = elbow.children[0];
    const hand = forearm.children[0];

//GUI
    const gui = new GUI();
    gui.title('Robot Kuka kr10');
// const folder_pos = gui.addFolder('Position');
    const folder_ctrl = gui.addFolder('Control');
    const robot_pose = {
        A1: 0.,
        A2: 0.,
        A3: 0.,
        A4: 0.,
        A5: 0.,
        A6: 0.,
        reset: function () {
            this.A1 = 0;
            this.A2 = 0;
            this.A3 = 0;
            this.A4 = 0;
            this.A5 = 0;
            this.A6 = 0;
        }
    }


    folder_ctrl.add(robot_pose, "A1", -170, 170).listen();
    folder_ctrl.add(robot_pose, "A2", -190, 45).listen();
    folder_ctrl.add(robot_pose, "A3", -120, 156).listen();
    folder_ctrl.add(robot_pose, "A4", -185, 185).listen();
    folder_ctrl.add(robot_pose, "A5", -120, 120).listen();
    folder_ctrl.add(robot_pose, "A6", -350, 350).listen();
    folder_ctrl.add(robot_pose, "reset");


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    function animate() {
        requestAnimationFrame( animate );
        shoulder.rotation.y = robot_pose.A1 * Math.PI / 180;
        arm.rotation.z = robot_pose.A2 * Math.PI / 180;
        elbow.rotation.z = robot_pose.A3 * Math.PI / 180;
        forearm.rotation.x = robot_pose.A4 * Math.PI / 180;
        hand.rotation.z = robot_pose.A5 * Math.PI / 180;

        // forearm.rotation.x -= 0.01;
        controls.update();
        renderer.render( scene, camera );

    }
}

