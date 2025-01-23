import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Logo() {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(10, 10, 10);
    scene.add(spotLight);

    // Ring geometry with Tailwind color
    const geometry = new THREE.RingGeometry(1, 1.5, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
    });

    const ring = new THREE.Mesh(geometry, material);
    scene.add(ring);

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      ring.rotation.y += 0.01; // Rotate the ring around its Z-axis
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={refContainer}></div>;
}
