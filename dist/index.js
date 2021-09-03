import * as THREE from './ThreeBuild/three.module.js';
import {STLLoader} from './ThreeBuild/STLLoader.js';
import {OrbitControls} from './ThreeBuild/OrbitControls.js';
import {FBXLoader} from './ThreeBuild/FBXLoader.js';
import {DragControls} from './ThreeBuild/DragControls.js';

let scene, camera, renderer,dControl,R2,light,light2,space,yoda,ship,loader,clone;
let scale;
let posx,posz;

//inicializacion de camara, scene y render
function init(){
    posx=THREE.MathUtils.randFloatSpread(200);
    posz=THREE.MathUtils.randFloatSpread(200);
    //scene
    scene= new THREE.Scene();
    space= new THREE.TextureLoader().load('/dist/Models/space.jpg');
    scene.background=space;
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    //camera
    camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.z=5;

    //renderer
    renderer = new THREE.WebGLRenderer({antialise:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Create 300 stars
    for(var i=0;i<300;i++) addStars();

    //Control with mouse
    var controls=new OrbitControls(camera,renderer.domElement);

    dControl=new DragControls([clone],camera,renderer.domElement);
    controls.minDistance=3;
    controls.maxDistance=50;
    dControl.addEventListener('dragstart',()=>{
        controls.enabled=false;
    });
    dControl.addEventListener('dragend',()=>{
        controls.enabled=true;
    });

    //lights
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 200, 20 );

    light=new THREE.DirectionalLight(0x000055,0.7);
    light.position.set(0,0,10);

    light2=new THREE.DirectionalLight(0x000055,0.9);
    light2.position.set(0,0,-40);
   
    scene.add(light2,light,hemiLight);
    scene.add(yoda,ship,clone);

    //loader of R2
    R2=new FBXLoader();
    R2.load('./Models/R2.fbx', function ( object ) {
        object.scale.set(0.01,0.01,0.01);
        object.position.set(0,-5,0);
        scene.add(object);
    } );

    renderer.render(scene,camera);
    animate();
       
};
    //loader of ship
    loader= new STLLoader();
    loader.load('/dist//Models/solo.stl',(model)=>{
        ship=new THREE.Mesh(model,new THREE.MeshLambertMaterial({color:0xffffff}));
        ship.scale.set(0.09,0.09,0.09);
        ship.position.set(-30,30,-30);
    });

    //loader of clone
    loader= new STLLoader();
    loader.load('/dist//Models/Clone2.stl',(model)=>{
        clone=new THREE.Mesh(model,new THREE.MeshLambertMaterial({color:0xffffff}));
        clone.scale.set(0.02,0.02,0.02);
        clone.position.set(-25,0,-20);
    });

    //loader of yoda
    loader.load('/dist//Models/Baby_Yoda_v2.22.stl',(model)=>{
        yoda=new THREE.Mesh(model,new THREE.MeshLambertMaterial({color:0xffffff}));
        yoda.scale.set(0.05,0.05,0.05);
        yoda.position.set(20,0,-10);
        yoda.rotation.x=-Math.PI/2;
        init();
    });

    //Resize window
    window.addEventListener('resize',redimensionar);
        function redimensionar(){
        camera.aspect=window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.render(scene,camera);
    }


    function animate(){
        yoda.rotation.z+=0.01;
        requestAnimationFrame(animate);
        renderer.render(scene,camera);
        Moveship();
        YodaScale();
    };


    function YodaScale(){
        if(scale){
            if(yoda.scale.x<0.08){
                yoda.scale.x+=0.001;
                yoda.scale.y+=0.001;
                yoda.scale.z+=0.001;
            }
        }
        if(!scale){
            if(yoda.scale.x>0.05){
                yoda.scale.x-=0.001;
                yoda.scale.y-=0.001;
                yoda.scale.z-=0.001;
            }
    
        }
        
    };

    //random function to add Starts to scene
    function addStars(){
        const geometryStart=new THREE.SphereGeometry(2,24,24);
        const materialStart=new THREE.MeshLambertMaterial({color:0xFFFFFF});
        var star=new THREE.Mesh(geometryStart,materialStart);
        const[x,y,z]=Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(1000));
        star.position.set(x,y,z);
        scene.add(star);
    }

    //Event of button to scale Yoda
    document.getElementById('scale').onmousedown=()=>{
        scale=true;
    };

    document.getElementById('scale').onmouseup=()=>{
        scale=false;
    };
    

    //Move of ship
    function Moveship(){
        if(ship.position.x==posx&&ship.position.z==posz){
            posx=THREE.MathUtils.randFloatSpread(100);
            posz=THREE.MathUtils.randFloatSpread(100);
        }

        ship.rotation.y+=0.01;
        if(ship.position.x<posx){
            ship.position.x+=0.6;
            if(ship.position.x>posx){
                ship.position.x=posx;
            }
        }else if(ship.position.x>posx){
            ship.position.x-=0.6;
            if(ship.position.x>posx){
                ship.position.x=posx;
            }
        }
        if(ship.position.z<posz){
            ship.position.z+=0.6;
            if(ship.position.z>posz){
                ship.position.z=posz;
            }
        }else if(ship.position.z>posz){
            ship.position.z-=0.6;
            if(ship.position.z<posz){
                ship.position.z=posz;
            }
    }

};