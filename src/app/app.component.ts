import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild('canvas')
  canvas: HTMLCanvasElement;

  batAsset: any;

  ngOnInit(): void {
    this.webGLCheck();
  }

  webGLCheck(): any {
    try {
      let canvas = <HTMLCanvasElement>document.getElementById('canvas');
      !!window.WebGL2RenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      canvas = null;
    } catch (e) {
      console.log(e);
      return false;      
    }
    this.createThreejsBox();
  }

  createThreejsBox(): void {
    const canvas = document.getElementById('canvas');

    const scene = new THREE.Scene();

    const material = new THREE.MeshToonMaterial();

    // Object Loader

    const loader = new GLTFLoader();

    loader.load("assets\\bat_mki.glb", function ( gltf ) {
      this.batAsset = gltf.scene;
    
    }, undefined, function ( error ) {
      console.error( error );
    
    } );    

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      material
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(5, 1.5, 16, 100),
      material
    );

    scene.add(torus, this.batAsset);

    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasSizes.width / canvasSizes.height,
      0.001,
      1000
    );
    camera.position.z = 30;
    scene.add(camera);

    // Null check

    if (!canvas) {
      console.log('canvas is set as: ' + this.canvas);
      return;
    }

    // Renderer

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      camera.aspect = canvasSizes.width / canvasSizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
    });

    // Clock for animation

    const clock = new THREE.Clock();

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animation objects
      box.rotation.x = elapsedTime;
      box.rotation.y = elapsedTime;
      box.rotation.z = elapsedTime;

      torus.rotation.x = -elapsedTime;
      torus.rotation.y = -elapsedTime;
      torus.rotation.z = -elapsedTime;

      // Render
      renderer.render(scene, camera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }
}
