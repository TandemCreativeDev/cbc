import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Logo() {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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

    setRendererSize();
    window.addEventListener("resize", setRendererSize);

    const ambientLight = new THREE.AmbientLight(0xc14627, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc14627, 2, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const radius = 1.75;
    const curve = new THREE.CatmullRomCurve3(
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

    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.08, 16, true);

    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc14627,
      transparent: true,
      opacity: 0.6,
      emissive: 0xc14627,
      emissiveIntensity: 1,
      metalness: 0.8,
      roughness: 0.3,
    });

    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.castShadow = true;
    tube.receiveShadow = true;
    scene.add(tube);

    camera.position.set(0, 0, 5);

    const animate = function () {
      requestAnimationFrame(animate);
      tube.rotation.y += 0.010549;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div
      ref={refContainer}
      className="fixed top-0 left-0 w-full h-full overflow-hidden"
    ></div>
  );
}
