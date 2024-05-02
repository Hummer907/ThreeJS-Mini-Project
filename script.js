import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 3, 5);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/1.2, window.innerHeight/1.2 );
document.body.appendChild( renderer.domElement );




//light
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

// // Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(1, 1, 1).normalize();
// scene.add(directionalLight);


//3D Model

const loader = new GLTFLoader();


//Soldier

let soldier_model,idleAction,walkAction,runAction,actions ,curr_action ;
let mixer;
loader.load( './src/models/Soldier2.glb', function ( gltf ) {
    const model = gltf.scene;
    soldier_model = gltf.scale;
    model.position.set(0, 0, 0);
    const scaleValue = 1.5; // Adjust as needed
    model.scale.set(scaleValue, scaleValue, scaleValue);
    console.log("Load Model")

    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer( model );

    idleAction = mixer.clipAction( animations[ 0 ] );
    walkAction = mixer.clipAction( animations[ 3 ] );
    runAction = mixer.clipAction( animations[ 1 ] );

    actions = [ idleAction, walkAction, runAction ];
    curr_action = idleAction;
    curr_action.play();

   
    // model.rotation.set(0, Math.PI / 2, 0);
	scene.add( gltf.scene );

     

}, undefined, function ( error ) {

	console.error( error );

} );

//map
// loader.load( './src/models/map.glb', function ( gltf ) {
//     const model = gltf.scene;
//     model.position.set(0, 0, 0);
   
//     // model.rotation.set(0, Math.PI / 2, 0);
// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );


// Controls
const controls = new OrbitControls(camera, renderer.domElement);



//Key Controls

let keyPressed = false;

//Key Handlers 
function onKeyDown(){
    curr_action.stop();
    curr_action = walkAction;
    curr_action.play()

}

function onKeyUp(){
    curr_action.stop();
    curr_action = runAction;
    curr_action.play()

}
// Add key listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);


const clock = new THREE.Clock();
function animate() {
	requestAnimationFrame( animate );
    // Update controls
    mixer.update(clock.getDelta());
    controls.update();

    
	renderer.render( scene, camera );
}
animate();