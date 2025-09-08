'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import FormularioProducto from '@/components/FormularioProducto';
import styles from './inventario.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';

interface Opcion {
  id: number;
  nombre: string;
  estado?: string;
}

interface Producto {
  id: number;
  sku: string;
  nombre: string;
  cantidad: number;
  precio: string | number;
  categoria: {
    id: number;
    nombre_categoria: string;
    detalle_categoria?: string;
  };
  unidad: {
    id: number;
    unidad: string;
    detalle?: string;
  };
  estado: {
    id: number;
    estado: string;
    detalle_estado?: string;
  };
}

interface ProductoFormValues {
  id?: number;
  sku: string;
  nombre: string;
  cod_categoria: number | string;
  cod_unidad: number | string;
  cod_estado: number | string;
  cantidad: number | "";
  precio: string | number;
}

export default function Page() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  const [unidades, setUnidades] = useState<Opcion[]>([]);
  const [estados, setEstados] = useState<Opcion[]>([]);

  useEffect(() => {
    let activo = true;
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const [productosRes, categoriasRes, unidadesRes, estadosRes] = await Promise.all([
          axios.get<Producto[]>(`${API_BASE}/api/productos/`),
          axios.get(`${API_BASE}/api/categorias/`),
          axios.get(`${API_BASE}/api/unidades/`),
          axios.get(`${API_BASE}/api/estados/`)
        ]);

        if (!activo) return;

        setProductos(productosRes.data);
        setCategorias(categoriasRes.data.map((c: any) => ({ id: c.id, nombre: c.nombre_categoria })));
        setUnidades(unidadesRes.data.map((u: any) => ({ id: u.id, nombre: u.unidad })));
        setEstados(estadosRes.data.map((e: any) => ({ id: e.id, nombre: e.estado })));
        setError(null);
      } catch {
        if (activo) setError('Error al cargar datos. Verifica tu API o configuración CORS.');
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarDatos();
    return () => { activo = false; };
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return q
      ? productos.filter(p =>
          p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        )
      : productos;
  }, [busqueda, productos]);

  const badgeClass = (estado?: string) => {
    const normal = estado?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (normal === 'mas vendido') return styles.badgeMasVendido;
    if (normal === 'pendiente') return styles.badgePendiente;
    return styles.badgeActivo;
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) return;
    setEliminandoId(id);
    try {
      await axios.delete(`${API_BASE}/api/productos/${id}/`);
      setProductos(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch {
      setError('No se pudo eliminar el producto. Inténtalo nuevamente.');
    } finally {
      setEliminandoId(null);
    }
  };

  const handleEdit = (producto: Producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleCreate = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const handleSubmit = async (values: ProductoFormValues) => {
    try {
      if (values.id) {
        await axios.put(`${API_BASE}/api/productos/${values.id}/`, values);
      } else {
        await axios.post(`${API_BASE}/api/productos/`, values);
      }
      const res = await axios.get<Producto[]>(`${API_BASE}/api/productos/`);
      setProductos(res.data);
      setMostrarFormulario(false);
      setError(null);
    } catch {
      setError('No se pudo guardar el producto. Verifica los datos o la API.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMostrarFormulario(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setMostrarFormulario(false);
    }
  };

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventario de Productos</h1>
        <div className={styles.toolbar}>
          <button className={styles.button} onClick={handleCreate}>+ Nuevo producto</button>
        </div>
      </div>

      <div className={styles.buscador}>
        <input
          className={styles.input}
          type="text"
          placeholder="Buscar por nombre o SKU"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button className={styles.button}>Buscar</button>
      </div>

      {cargando && <div className={styles.empty}>Cargando inventario…</div>}
      {error && <div className={styles.empty}>{error}</div>}

      {!cargando && !error && (
        <table className={styles.tabla}>
  <thead>
    <tr>
      <th className={styles.th}>SKU</th>
      <th className={styles.th}>Producto</th>
      <th className={styles.th}>Categoría</th>
      <th className={styles.th}>Unidad</th>
      <th className={styles.th}>Cantidad</th>
      <th className={styles.th}>Precio</th>
      <th className={styles.th}>Estado</th>
      <th className={styles.th}>Acciones</th>
    </tr>
  </thead>
  <tbody>
  {filtrados.map((p) => (
    <tr key={p.id}>
      <td className={styles.td}>{p.sku}</td>
      <td className={styles.td}>{p.nombre}</td>
      <td className={styles.td}>{p.categoria?.nombre_categoria ?? '—'}</td>
      <td className={styles.td}>{p.unidad?.unidad ?? '—'}</td>
      <td className={styles.td}>{p.cantidad}</td>
      <td className={styles.td}>S/ {Number(p.precio).toFixed(2)}</td>
      <td className={styles.td}>
        <span className={`${styles.badge} ${badgeClass(p.estado?.estado)}`}>
          {p.estado?.estado ?? '—'}
        </span>
      </td>
      <td className={styles.td}>
        <div className={styles.acciones}>
          <button
          className={`${styles.btn} ${styles.btnEdit}`}
          onClick={() => handleEdit(p)}
          disabled={eliminandoId === p.id}
        >
          Editar
        </button>
        <button
          className={`${styles.btn} ${styles.btnDelete}`}
          onClick={() => handleDelete(p.id, p.nombre)}
          disabled={eliminandoId === p.id}
        >
          {eliminandoId === p.id ? 'Eliminando…' : 'Eliminar'}
        </button>
        </div>
        
      </td>
    </tr>
  ))}
</tbody>

</table>
      )}
      {mostrarFormulario && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modal} ref={modalRef}>
            <button
              className={styles.modalClose}
              onClick={() => setMostrarFormulario(false)}
              aria-label="Cerrar formulario"
            >
              &times;
            </button>
            <FormularioProducto
              initialValues={
                productoEditando
                  ? {
                      id: productoEditando.id,
                      sku: productoEditando.sku,
                      nombre: productoEditando.nombre,
                      cod_categoria: productoEditando.categoria?.id ?? '',
                      cod_unidad: productoEditando.unidad?.id ?? '',
                      cod_estado: productoEditando.estado?.id ?? '',
                      cantidad: productoEditando.cantidad,
                      precio:
                        typeof productoEditando.precio === 'number'
                          ? productoEditando.precio
                          : productoEditando.precio === ''
                            ? ''
                            : Number(productoEditando.precio) || ''
                    }
                  : undefined
              }
              categorias={categorias}
              unidades={unidades}
              estados={estados}
              onSubmit={handleSubmit}
              onCancel={() => setMostrarFormulario(false)}
              submitLabel={productoEditando ? 'Actualizar' : 'Guardar'}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
