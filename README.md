# Rest3D · Menú 3D interactivo

Aplicación web React + Three.js para mostrar un menú visual 3D en móvil, tablet y pantallas táctiles.

## Alcance MVP implementado

- Menú público en español con precios en peso colombiano (COP).
- 5 platos iniciales con visualizador 3D.
- Filtro por categorías.
- Panel admin con autenticación simple.
- CRUD básico de platos.
- Subida directa de modelo 3D (`.glb/.gltf`) e imagen fallback.
- Persistencia local en navegador (`localStorage`) para simular el flujo de almacenamiento local de servidor en esta versión frontend-only.

## Acceso admin (demo)

- Usuario: `admin`
- Contraseña: `123456`

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Nota sobre storage local

En esta versión (solo frontend) los archivos cargados se guardan como Data URL dentro de `localStorage`. En el siguiente paso se puede migrar a backend real con carpeta `/uploads/models` y `/uploads/images` en servidor.
