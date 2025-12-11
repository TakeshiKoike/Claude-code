'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

interface VRMAvatarProps {
  url: string;
  position?: [number, number, number];
  scale?: number;
  onLoaded?: (vrm: VRM) => void;
}

export function VRMAvatar({
  url,
  position = [0, -0.8, 0],
  scale = 1,
  onLoaded
}: VRMAvatarProps) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const vrmRef = useRef<VRM | null>(null);
  const onLoadedRef = useRef(onLoaded);

  // onLoadedの参照を更新
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    const loader = new GLTFLoader();
    // @ts-expect-error - VRMLoaderPluginとGLTFLoaderの型定義の不一致を無視
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      url,
      (gltf) => {
        const vrmModel = gltf.userData.vrm as VRM;

        // VRMの最適化
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        // 正面を向かせる（VRMは通常+Z方向を向いている）
        vrmModel.scene.rotation.y = Math.PI;

        vrmRef.current = vrmModel;
        setVrm(vrmModel);
        onLoadedRef.current?.(vrmModel);
      },
      (xhr) => {
        // 読み込み進捗
        const progress = (xhr.loaded / xhr.total) * 100;
        console.log(`VRM読み込み中: ${progress.toFixed(0)}%`);
      },
      (error) => {
        console.error('VRM読み込みエラー:', error);
      }
    );

    return () => {
      if (vrmRef.current) {
        VRMUtils.deepDispose(vrmRef.current.scene);
        vrmRef.current = null;
      }
    };
  }, [url]);

  // アニメーション更新（まばたき等）
  useFrame((state, delta) => {
    if (vrm) {
      // VRMの更新
      vrm.update(delta);

      // 自然なまばたき
      const blinkTime = state.clock.elapsedTime;
      const blinkInterval = 3; // 3秒ごと
      const blinkDuration = 0.1;
      const blinkPhase = blinkTime % blinkInterval;

      if (blinkPhase < blinkDuration) {
        const blinkValue = Math.sin((blinkPhase / blinkDuration) * Math.PI);
        vrm.expressionManager?.setValue('blink', blinkValue);
      } else {
        vrm.expressionManager?.setValue('blink', 0);
      }

      // 軽い呼吸アニメーション
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
      if (vrm.scene) {
        vrm.scene.position.y = position[1] + breathe;
      }
    }
  });

  if (!vrm) {
    return null;
  }

  return (
    <primitive
      object={vrm.scene}
      position={position}
      scale={[scale, scale, scale]}
    />
  );
}

export default VRMAvatar;
