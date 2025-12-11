'use client';

import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { VRM } from '@pixiv/three-vrm';
import VRMAvatar from './VRMAvatar';

interface PatientViewerProps {
  vrmUrl: string;
  patientName?: string;
  onVRMLoaded?: (vrm: VRM) => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  );
}

export function PatientViewer({
  vrmUrl,
  patientName = '患者',
  onVRMLoaded
}: PatientViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const vrmRef = useRef<VRM | null>(null);

  const handleVRMLoaded = useCallback((vrm: VRM) => {
    vrmRef.current = vrm;
    setIsLoading(false);
    onVRMLoaded?.(vrm);
  }, [onVRMLoaded]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      {/* 患者名表示 */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow">
        <p className="text-sm text-gray-500">患者</p>
        <p className="text-lg font-bold text-gray-800">{patientName}</p>
      </div>

      {/* ローディング表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">アバターを読み込み中...</p>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-50">
          <div className="text-center text-red-600">
            <p className="text-xl mb-2">⚠️</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* 3Dキャンバス */}
      <Canvas
        camera={{ position: [0, 0.5, 2], fov: 35 }}
        shadows
      >
        {/* 環境光 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        {/* 環境マップ（リアルな照明反射用） */}
        <Environment preset="apartment" />

        {/* VRMアバター */}
        <Suspense fallback={<LoadingFallback />}>
          <VRMAvatar
            url={vrmUrl}
            position={[0, -0.8, 0]}
            scale={1}
            onLoaded={handleVRMLoaded}
          />
        </Suspense>

        {/* 床の影 */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* カメラコントロール */}
        <OrbitControls
          target={[0, 0.3, 0]}
          minDistance={1}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}

export default PatientViewer;
