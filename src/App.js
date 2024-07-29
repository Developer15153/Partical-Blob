import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import fragmentShader from "./fragment";
import vertexShader from "./vertex";

function Scene() {
  const mesh = useRef();
  const [scale, setScale] = useState(1.5);
  const speed = 0.3;
  const colorA = "#3f3089";
  const colorB = "#00bcff";
  const intensity = 0.15;
  const particalSize = 28.0;

  const uniforms = useMemo(() => {
    return {
      u_time: {
        value: 0.0
      },
      u_speed: {
        value: speed
      },
      u_intensity: {
        value: intensity
      },
      u_partical_size: {
        value: particalSize
      },
      u_color_a: {
        value: new THREE.Color(colorA)
      },
      u_color_b: {
        value: new THREE.Color(colorB)
      },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } // Added resolution uniform
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      mesh.current.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      setScale(window.innerWidth < 600 ? 1 : 1.5); //this will set a scale in mobile devices
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    mesh.current.material.uniforms.u_speed.value = speed;
    mesh.current.material.uniforms.u_intensity.value = intensity;
    mesh.current.material.uniforms.u_partical_size.value = particalSize;
    mesh.current.material.uniforms.u_color_a.value = new THREE.Color(colorA);
    mesh.current.material.uniforms.u_color_b.value = new THREE.Color(colorB);
  });

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight />
      <points scale={scale} ref={mesh}>
        <icosahedronGeometry args={[2, 20]} />
        <shaderMaterial
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export default function Example() {
  return (
    <Canvas camera={{ position: [8, 0, 0] }}>
      <Scene />
    </Canvas>
  );
}
