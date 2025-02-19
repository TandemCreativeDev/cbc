import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { useEffect, useRef } from "react";

export default function SpinningLogo() {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const radius = 1.6;
    const headerHeight = 6 * 16;
    const footerHeight = 4.5 * 16;
    const height = window.innerHeight - headerHeight - footerHeight;
    const width = window.innerWidth;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    const setRendererSize = () => {
      if (refContainer.current) {
        renderer.setSize(
          refContainer.current.clientWidth,
          refContainer.current.clientHeight
        );
        camera.aspect =
          refContainer.current.clientWidth / refContainer.current.clientHeight;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", setRendererSize);

    const controls = new OrbitControls(camera, refContainer.current);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xfebc12, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfebc12, 3, 50);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const circleCurve = new THREE.CatmullRomCurve3(
      new Array(100).fill(0).map((_, i) => {
        const angle = (i / 100) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        );
      }),
      true
    );

    const tubeGeometry = new THREE.TubeGeometry(
      circleCurve,
      100,
      0.07,
      16,
      true
    );

    function createStripedTexture() {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        for (let i = 0; i < size; i += 50) {
          ctx.fillStyle =
            i % 16 === 0
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.7)";
          ctx.fillRect(0, i, size, 50);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 10);
      return texture;
    }

    const tubeMaterial = new THREE.MeshStandardMaterial({
      map: createStripedTexture(),
      transparent: true,
      opacity: 0.7,
      emissive: 0xfebc12,
      emissiveIntensity: 3,
      metalness: 0.3,
      roughness: 0.8,
    });

    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    const textureLoader = new THREE.TextureLoader();
    const baseTexture = textureLoader.load("/hologram/hologram_nolight.png");
    const lightTextures = [
      textureLoader.load("/hologram/hologram_light1.png"),
      textureLoader.load("/hologram/hologram_light2.png"),
      textureLoader.load("/hologram/hologram_light3.png"),
    ];

    const frontGeometry = new THREE.PlaneGeometry(radius * 2, radius * 2);
    const logoMaterials = [
      new THREE.MeshBasicMaterial({
        map: baseTexture,
        transparent: true,
        opacity: 1,
      }),
      ...lightTextures.map(
        (texture) =>
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
          })
      ),
    ];

    const frontMeshes = logoMaterials.map(
      (mat) => new THREE.Mesh(frontGeometry, mat)
    );

    frontMeshes.forEach((mesh) => {
      mesh.position.set(0, 0, 0.1);
      scene.add(mesh);
    });

    const backMeshes = frontMeshes.map((mesh) => {
      const backMesh = mesh.clone();
      backMesh.rotation.y = Math.PI;
      backMesh.position.set(0, 0, 0.1);
      scene.add(backMesh);
      return backMesh;
    });

    const allPlaneMeshes = [...frontMeshes, ...backMeshes];

    function flickerLights() {
      logoMaterials.slice(1).forEach((material) => {
        material.opacity = Math.random() > 0.5 ? 1 : 0;
      });

      setTimeout(flickerLights, Math.random() * 500);
    }

    flickerLights();

    const animate = function () {
      controls.update();
      tube.rotation.y += 0.01;
      tubeMaterial.opacity = 0.5 + Math.random() * 0.25;
      if (tubeMaterial.map) {
        tubeMaterial.map.offset.y -= 0.01;
      }
      allPlaneMeshes.forEach((mesh) => (mesh.rotation.y += 0.01));
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div
      ref={refContainer}
      className="fixed top-[5rem] left-0 w-full h-[calc(100vh-9.5rem)] overflow-hidden hidden md:block md:motion-reduce:hidden z-50"
    ></div>
  );
}
