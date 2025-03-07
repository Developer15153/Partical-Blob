import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import fragmentShader from "./fragment";
import vertexShader from "./vertex";
import { useControls } from "leva";

function Scene() {
  const [scale, setScale] = useState(1.5);
  const mesh = useRef();
  const { speed, colorA, colorB, intensity, particalSize } = useControls({
    colorA: "#3f3089",
    colorB: "#00bcff",
    speed: {
      value: 0.3,
      min: 0.1,
      max: 2.0,
      step: 0.05
    },
    intensity: {
      value: 0.25,
      min: 0.01,
      max: 0.3,
      step: 0.01
    },
    particalSize: {
      value: 40.0,
      min: 5.0,
      max: 100.0,
      step: 1.0
    }
  });

  useEffect(() => {
    const handleResize = () => {
      mesh.current.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      setScale(window.innerWidth < 600 ? 1 : 1.5);
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
