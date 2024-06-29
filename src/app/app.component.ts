import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MainPanelComponent } from './menus/main-panel/main-panel.component';
import { MathUtils } from 'three/src/math/MathUtils.js';
import { last } from 'rxjs';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainPanelComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild('canvas')
  displayPanelsToggle = false;
  canvas: HTMLCanvasElement;
  loadText = '';
  voyagerAsset: any;
  spaceBackground: any;
  textGeo: any;
  textMesh: any;
  materials: any;
  loadedFont: any;
  pointLight: THREE.PointLight;


  ngOnInit(): void {
    // Object Loader
    const backgroundLoader = new THREE.TextureLoader();

    backgroundLoader.loadAsync("assets\\space_bkg_wnewman.jpg", () => {
      // Loading
    }).then((bkg) => {
      this.spaceBackground = bkg;
    }).catch((error) => {
      console.log("background load error: " + error);
    }).finally(() => {
      this.fontLoading();
    });
  }

  // Font Loader
  fontLoading() {
    const fontLoader = new FontLoader();

    fontLoader.loadAsync("assets\\droid_serif_regular.typeface.json", () => {
      // Loading
    }).then((threeFont) => {
      this.loadedFont = threeFont;
    }).catch((error) => {
      console.log("Font load error: " + error);
    }).finally(() => {
      this.voyagerAssetLoading();
    });
  }

  voyagerAssetLoading(): void {
    const voyagerAssetLoader = new GLTFLoader();

    // Set decoder
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    voyagerAssetLoader.setDRACOLoader(dracoLoader);

    // Asyncronous asset loader with progress event as first argument
    voyagerAssetLoader.loadAsync("assets\\Voyager_17.glb", () => {
      this.loadText = 'L O A D I N G';
    }).then((gltf) => {
      this.voyagerAsset = gltf.scene;
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
    this.createThreejsScene();
  }

  // Create floating name text
  // addTextMeshToScene(text: string): THREE.Mesh {
  //   const depth = 10,
  //     size = 110,
  //     hover = window.innerHeight / 2.5,
  //     curveSegments = 4,
  //     bevelEnabled = false;

  // this.textGeo = new TextGeometry(text, {
  //     font: this.loadedFont,
  //     size: size,
  //     depth: depth,
  //     curveSegments: curveSegments,
  //     bevelEnabled: bevelEnabled
  // });

  //   this.textGeo.computeBoundingBox();

  //   const centerOffset = - 0.5 * (this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x);

  //   this.materials = [
  //     new THREE.MeshPhysicalMaterial({ color: 0x69ffff, flatShading: true }), // front
  //     new THREE.MeshPhongMaterial({ color: 0xff34cc }) // side
  //   ];

  //   this.textMesh = new THREE.Mesh(this.textGeo, this.materials);

  //   this.textMesh.name = "TextMeshObject";

  //   this.textMesh.position.x = centerOffset;
  //   this.textMesh.position.y = hover;
  //   this.textMesh.position.z = -900;

  //   return this.textMesh;
  // }

  createThreejsScene(): void {
    const canvas = document.getElementById('canvas');

    const scene = new THREE.Scene();

    const material = new THREE.MeshToonMaterial();

    const ambientLight = new THREE.AmbientLight(0xfff0f0, 1);
    scene.add(ambientLight);

    if (this.textMesh) {
      scene.remove(this.textMesh);
    }

    // let firstText = this.addTextMeshToScene("William");
    // let lastText = this.addTextMeshToScene("Newman");
    // lastText.position.y = lastText.position.y - 150;

    // scene.add(firstText, lastText);

    scene.background = this.spaceBackground;
    scene.backgroundIntensity = 0.1;
    scene.fog = new THREE.FogExp2(0xcccccc, 0.001)
    scene.fog.name = "Foggo";

    this.voyagerAsset.position.x = -60;
    this.voyagerAsset.position.y = -8;
    this.voyagerAsset.position.z = -10;
    this.voyagerAsset.rotation.x = 82;
    this.voyagerAsset.children[0].children[0].material.map.minfilter = THREE.LinearMipmapLinearFilter;
    this.voyagerAsset.children[0].children[1].material.map.minfilter = THREE.LinearMipmapLinearFilter;
    this.voyagerAsset.children[0].children[2].material.map = this.voyagerAsset.children[0].children[1].material.map;
    
    this.pointLight = new THREE.PointLight(0x696969, 0.8);
    this.pointLight.position.x = this.voyagerAsset.position.x;
    this.pointLight.position.y = this.voyagerAsset.position.y;
    this.pointLight.position.z = this.voyagerAsset.position.z;
    scene.add(this.pointLight);

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

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(48, 2.3, 4, 12),
      material
    );

    scene.add(torus, this.voyagerAsset, sphere);

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
      antialias: true
    });

    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      camera.aspect = canvasSizes.width / canvasSizes.height;

      const fov = 110;
      const planeAspectRatio = 16 / 9;

      if (camera.aspect > planeAspectRatio) {
        // window too large
        const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
        const ratio = camera.aspect / planeAspectRatio;
        const newCameraHeight = cameraHeight / ratio;
        camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
      } else {
        // window too narrow
        camera.fov = fov;
      }

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
      this.voyagerAsset.translateX(0.02);
      this.voyagerAsset.translateY(0.001);
      this.pointLight.position.setX(this.voyagerAsset.position.x + 1);
      this.pointLight.position.setY(this.voyagerAsset.position.y + 2);

      if (this.voyagerAsset.position.x > 120) {
        this.voyagerAsset.position.setX(-60);
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
    this.displayPanelsToggle = true;
  }
}
