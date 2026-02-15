import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import "./App.css";

const STORAGE_KEYS = {
  SESSION: "rest3d_admin_session",
  DATA: "rest3d_catalog_data",
};

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "123456",
};

const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Hamburguesas", order: 1, isActive: true, accent: "#f4b740", sticker: "🍔" },
  { id: "c2", name: "Pizzas", order: 2, isActive: true, accent: "#f4b740", sticker: "🍕" },
  { id: "c3", name: "Sandwiches", order: 3, isActive: true, accent: "#f4b740", sticker: "🥪" },
];

const DEFAULT_DISHES = [
  {
    id: "d1",
    name: "Classic Burger",
    description: "Pan brioche, carne jugosa, queso y vegetales frescos.",
    priceCOP: 700,
    categoryId: "c1",
    tags: ["clásico"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.2, rotationY: 0.1, positionY: -0.45 },
    isPublished: true,
    order: 1,
  },
  {
    id: "d2",
    name: "Veggie Burger",
    description: "Versión vegetal con mix de hojas, tomate y salsa artesanal.",
    priceCOP: 750,
    categoryId: "c1",
    tags: ["veggie"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.15, rotationY: 0.2, positionY: -0.45 },
    isPublished: true,
    order: 2,
  },
  {
    id: "d3",
    name: "Special Burger",
    description: "Doble carne, cebolla crocante y salsa especial de la casa.",
    priceCOP: 800,
    categoryId: "c1",
    tags: ["premium"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.1, rotationY: -0.2, positionY: -0.5 },
    isPublished: true,
    order: 3,
  },
  {
    id: "d4",
    name: "Classic Pizza",
    description: "Pizza tradicional con mozzarella y salsa de tomate al horno.",
    priceCOP: 900,
    categoryId: "c2",
    tags: ["horno"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.05, rotationY: 0.1, positionY: -0.5 },
    isPublished: true,
    order: 4,
  },
  {
    id: "d5",
    name: "Veggie Pizza",
    description: "Base delgada con vegetales asados y toque de albahaca.",
    priceCOP: 900,
    categoryId: "c2",
    tags: ["veggie"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.25, rotationY: -0.1, positionY: -0.5 },
    isPublished: true,
    order: 5,
  },
  {
    id: "d6",
    name: "Special Pizza",
    description: "Combinación de sabores intensos con topping especial.",
    priceCOP: 950,
    categoryId: "c2",
    tags: ["especial"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.15, rotationY: 0.22, positionY: -0.5 },
    isPublished: true,
    order: 6,
  },
  {
    id: "d7",
    name: "Classic Sandwich",
    description: "Pan suave, jamón artesanal, queso y vegetales frescos.",
    priceCOP: 650,
    categoryId: "c3",
    tags: ["clásico"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.05, rotationY: -0.1, positionY: -0.55 },
    isPublished: true,
    order: 7,
  },
  {
    id: "d8",
    name: "Veggie Sandwich",
    description: "Opción vegetal con vegetales grillados y aderezo ligero.",
    priceCOP: 680,
    categoryId: "c3",
    tags: ["veggie"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.1, rotationY: 0.16, positionY: -0.55 },
    isPublished: true,
    order: 8,
  },
  {
    id: "d9",
    name: "Special Sandwich",
    description: "Triple capa con ingredientes premium y salsa especial.",
    priceCOP: 700,
    categoryId: "c3",
    tags: ["especial"],
    imageUrl: "",
    model3dUrl: "/models/Buger.glb",
    modelSettings: { scale: 1.2, rotationY: 0.05, positionY: -0.55 },
    isPublished: true,
    order: 9,
  },
];

const DEFAULT_DATA = { categories: DEFAULT_CATEGORIES, dishes: DEFAULT_DISHES };

function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function readCatalog() {
  const raw = localStorage.getItem(STORAGE_KEYS.DATA);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }
}

function DishModel({ dish }) {
  const gltf = useGLTF(dish.model3dUrl);
  const settings = dish.modelSettings || {};

  return (
    <primitive
      object={gltf.scene}
      scale={settings.scale || 1.1}
      position={[0, settings.positionY || -0.4, 0]}
      rotation={[0, settings.rotationY || 0, 0]}
    />
  );
}

function DishViewer({ dish }) {
  if (!dish?.model3dUrl) {
    return (
      <div className="viewer-fallback">
        {dish?.imageUrl ? <img src={dish.imageUrl} alt={dish.name} /> : <p>Sin modelo 3D cargado.</p>}
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 1, 3.2], fov: 45 }}>
      <ambientLight intensity={1} />
      <directionalLight intensity={1.2} position={[3, 4, 5]} />
      <DishModel dish={dish} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

function DishModal({ dish, onClose }) {
  useEffect(() => {
    if (!dish) return undefined;

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleEsc);
    };
  }, [dish, onClose]);

  if (!dish) return null;

  return (
    <div className="dish-modal" role="dialog" aria-modal="true" aria-label={`Vista 3D de ${dish.name}`}>
      <button className="dish-modal-backdrop" type="button" aria-label="Cerrar" onClick={onClose} />
      <article className="dish-modal-card">
        <button type="button" className="close-modal" onClick={onClose}>
          ✕
        </button>
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <p className="price">{formatCOP(dish.priceCOP)}</p>
        <div className="viewer-wrap">
          <DishViewer dish={dish} />
        </div>
      </article>
    </div>
  );
}

function PublicMenu({ data }) {
  const [selectedDish, setSelectedDish] = useState(null);

  const activeCategories = useMemo(() => {
    const categories = data.categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.order - b.order);

    return categories.map((category, index) => {
      const dishes = data.dishes
        .filter((dish) => dish.isPublished && dish.categoryId === category.id)
        .sort((a, b) => a.order - b.order);

      return {
        ...category,
        dishes,
        imageSide: index % 2 === 0 ? "right" : "left",
      };
    });
  }, [data.categories, data.dishes]);

  return (
    <main className="menu-poster app-shell">
      <header className="poster-header">
        <p className="poster-logo">Tu logo aquí</p>
        <h1>
          CARTA <span>Menú</span>
        </h1>
        <p>Selecciona un alimento para abrir su visualización 3D</p>
      </header>

      <section className="poster-list">
        {activeCategories.map((category) => (
          <article className={`category-band ${category.imageSide}`} key={category.id}>
            <h2 style={{ color: category.accent || "#f4b740" }}>{category.name}</h2>
            <div className="category-content">
              <div className="dish-list">
                {category.dishes.map((dish) => (
                  <button key={dish.id} type="button" className="dish-item" onClick={() => setSelectedDish(dish)}>
                    <strong>{dish.name}</strong>
                    <span>{formatCOP(dish.priceCOP)}</span>
                  </button>
                ))}
                {category.dishes.length === 0 && <p>No hay platos publicados en esta categoría.</p>}
              </div>
              <div className="category-image" aria-hidden="true">
                <div>{category.sticker || "🍽️"}</div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </main>
  );
}

function AdminPanel({ data, onSave }) {
  const [session, setSession] = useState(localStorage.getItem(STORAGE_KEYS.SESSION) === "active");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [selectedDishId, setSelectedDishId] = useState(data.dishes[0]?.id || "");
  const effectiveDishId = data.dishes.some((dish) => dish.id === selectedDishId)
    ? selectedDishId
    : data.dishes[0]?.id || "";
  const selectedDish = data.dishes.find((dish) => dish.id === effectiveDishId) || null;

  const handleLogin = (event) => {
    event.preventDefault();
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem(STORAGE_KEYS.SESSION, "active");
      setSession(true);
      return;
    }

    alert("Credenciales inválidas. Usa admin / 123456");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setSession(false);
  };

  const updateDish = (dishId, field, value) => {
    const nextData = {
      ...data,
      dishes: data.dishes.map((dish) => (dish.id === dishId ? { ...dish, [field]: value } : dish)),
    };
    onSave(nextData);
  };

  const updateDishSetting = (dishId, field, value) => {
    const nextData = {
      ...data,
      dishes: data.dishes.map((dish) =>
        dish.id === dishId
          ? { ...dish, modelSettings: { ...dish.modelSettings, [field]: Number(value) } }
          : dish,
      ),
    };
    onSave(nextData);
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDish) return;

    const reader = new FileReader();
    reader.onload = () => {
      const field = type === "model" ? "model3dUrl" : "imageUrl";
      updateDish(selectedDish.id, field, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addDish = () => {
    const newDish = {
      id: crypto.randomUUID(),
      name: "Nuevo plato",
      description: "Descripción del plato.",
      priceCOP: 20000,
      categoryId: data.categories[0]?.id || "",
      tags: [],
      imageUrl: "",
      model3dUrl: "",
      modelSettings: { scale: 1.1, rotationY: 0, positionY: -0.4 },
      isPublished: false,
      order: data.dishes.length + 1,
    };

    const nextData = { ...data, dishes: [...data.dishes, newDish] };
    onSave(nextData);
    setSelectedDishId(newDish.id);
  };

  const deleteDish = () => {
    if (!selectedDish) return;
    const nextDishes = data.dishes.filter((dish) => dish.id !== selectedDish.id);
    onSave({ ...data, dishes: nextDishes });
  };

  if (!session) {
    return (
      <main className="login-shell">
        <form className="login-card" onSubmit={handleLogin}>
          <h1>Admin Rest3D</h1>
          <p>Autenticación simple habilitada</p>
          <input
            placeholder="Usuario"
            value={credentials.username}
            onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={credentials.password}
            onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
          />
          <button type="submit">Ingresar</button>
          <small>Demo: admin / 123456</small>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Panel admin</h1>
          <p>Gestiona menú y objetos 3D · almacenamiento local</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="admin-content">
        <aside>
          <div className="admin-actions">
            <button type="button" onClick={addDish}>
              + Nuevo plato
            </button>
            <button type="button" onClick={deleteDish} disabled={!selectedDish}>
              Eliminar
            </button>
          </div>
          {data.dishes.map((dish) => (
            <button
              key={dish.id}
              type="button"
              className={dish.id === effectiveDishId ? "selected" : ""}
              onClick={() => setSelectedDishId(dish.id)}
            >
              {dish.name}
            </button>
          ))}
        </aside>

        <article>
          {selectedDish ? (
            <div className="editor-grid">
              <label>
                Nombre
                <input
                  value={selectedDish.name}
                  onChange={(event) => updateDish(selectedDish.id, "name", event.target.value)}
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={selectedDish.description}
                  onChange={(event) => updateDish(selectedDish.id, "description", event.target.value)}
                />
              </label>

              <label>
                Precio COP
                <input
                  type="number"
                  value={selectedDish.priceCOP}
                  onChange={(event) => updateDish(selectedDish.id, "priceCOP", Number(event.target.value))}
                />
              </label>

              <label>
                Categoría
                <select
                  value={selectedDish.categoryId}
                  onChange={(event) => updateDish(selectedDish.id, "categoryId", event.target.value)}
                >
                  {data.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="check-inline">
                <input
                  type="checkbox"
                  checked={selectedDish.isPublished}
                  onChange={(event) => updateDish(selectedDish.id, "isPublished", event.target.checked)}
                />
                Publicado
              </label>

              <div className="upload-row">
                <label>
                  Modelo 3D (.glb/.gltf)
                  <input type="file" accept=".glb,.gltf,model/gltf-binary" onChange={(event) => handleFileUpload(event, "model")} />
                </label>

                <label>
                  Imagen fallback
                  <input type="file" accept="image/*" onChange={(event) => handleFileUpload(event, "image")} />
                </label>
              </div>

              <div className="settings-grid">
                <label>
                  Escala
                  <input
                    type="number"
                    step="0.05"
                    value={selectedDish.modelSettings?.scale || 1.1}
                    onChange={(event) => updateDishSetting(selectedDish.id, "scale", event.target.value)}
                  />
                </label>
                <label>
                  Rotación Y
                  <input
                    type="number"
                    step="0.1"
                    value={selectedDish.modelSettings?.rotationY || 0}
                    onChange={(event) => updateDishSetting(selectedDish.id, "rotationY", event.target.value)}
                  />
                </label>
                <label>
                  Posición Y
                  <input
                    type="number"
                    step="0.1"
                    value={selectedDish.modelSettings?.positionY || -0.4}
                    onChange={(event) => updateDishSetting(selectedDish.id, "positionY", event.target.value)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <p>No hay platos disponibles.</p>
          )}
        </article>
      </section>
    </main>
  );
}

export default function App() {
  const [data, setData] = useState(() => readCatalog());
  const [view, setView] = useState("public");

  const saveData = (nextData) => {
    setData(nextData);
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(nextData));
  };

  return (
    <>
      <nav className="top-nav">
        <button type="button" className={view === "public" ? "active" : ""} onClick={() => setView("public")}>
          Menú público
        </button>
        <button type="button" className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
          Admin
        </button>
      </nav>
      {view === "public" ? <PublicMenu data={data} /> : <AdminPanel data={data} onSave={saveData} />}
    </>
  );
}
