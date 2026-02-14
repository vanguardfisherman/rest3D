import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function DishModel() {
    const model = useGLTF("/models/Buger.glb");
    return <primitive object={model.scene} scale={1.2} />;
}

export default function App() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [0, 1.2, 3], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <DishModel />
                <OrbitControls enablePan={false} />
            </Canvas>
        </div>
    );
}
