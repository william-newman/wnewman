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
  loadText = '';
  batAsset: any;

  ngOnInit(): void {
    // Object Loader

    const loader = new GLTFLoader();

    // Asyncronous asset loader with progress event as first argument
    loader.loadAsync("assets\\bat_mki.glb", () => {
      this.loadText = 'LOADING!';
    }).then((gltf) => {
      this.batAsset = gltf.scene;
    }).catch((error) => {
      this.loadText = error
      console.log("asset load error: " + error);
    }).finally(() => {
      this.loadText = '';
      this.webGLCheck();
    });
  }

  webGLCheck(): any {
    try {
      !!window.WebGL2RenderingContext
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

    const ambientLight = new THREE.AmbientLight(0x00FFFF, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = -1;
    scene.add(pointLight);

    this.batAsset.position.x = -60;
    this.batAsset.position.y = -8;

    const materialBright = new THREE.MeshLambertMaterial({
      color: 0x941010,
      emissive: 0x943603,
      emissiveIntensity: 1.3,
      reflectivity: 2
   });

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 28, 28),
      materialBright
    );

    sphere.position.setY(36);

    // Lovely meshInstance for loop
    // for (let i = 0; i < sphere.count; i++) {

    //   let x = Math.floor(Math.random() * 90) - 45;
    //   let y = 36;

    //   let matrix = new THREE.Matrix4();
    //   matrix.setPosition(x, y, 0);
    //   sphere.setMatrixAt(i, matrix);
    // }

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(48, 2.3, 4, 12),
      material
    );

    scene.add(torus, this.batAsset, sphere);

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

      sphere.translateX((Math.random() * 0.3) - 0.1);
      sphere.translateY((Math.random() * 0.1) - 0.1);

      // Update animation objects
      this.batAsset.translateX(0.02);
      this.batAsset.translateY(0.001);
      this.batAsset.position.z = -1;

      if (this.batAsset.position.x > 120) {
        this.batAsset.position.setX(-60)
      }

      if (sphere.position.y <= -72 || sphere.position.x > 60 || sphere.position.x < -60) {
        sphere.position.setY(36);
        sphere.position.setX(Math.floor(Math.random() * 90) - 45);
      }

      torus.rotation.x = 1;
      torus.rotation.y = 2.98;
      torus.rotation.z = elapsedTime * 0.1;

      // Render
      renderer.render(scene, camera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }
}
