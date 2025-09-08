'use client';

import { useEffect, useState } from 'react';
import styles from './FormularioProducto.module.css';

export interface Opcion {
  id: number;
  nombre: string;
}

export interface ProductoFormValues {
  id?: number;
  sku: string;
  nombre: string;
  cod_categoria: number | '';
  cod_unidad: number | '';
  cantidad: number | '';
  precio: number | '';
  cod_estado: number | '';
}

  
interface Props {
  initialValues?: Partial<ProductoFormValues>;
  categorias: Opcion[];
  unidades: Opcion[];
  estados: Opcion[];
  onSubmit: (values: ProductoFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

const defaultValues: ProductoFormValues = {
  sku: '',
  nombre: '',
  cod_categoria: '',
  cod_unidad: '',
  cantidad: '',
  precio: '',
  cod_estado: '',
};

export default function FormularioProducto({
  initialValues,
  categorias,
  unidades,
  estados,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
}: Props) {
  const [values, setValues] = useState<ProductoFormValues>({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
    setErrors({});
  }, [initialValues]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.sku.trim()) newErrors.sku = 'SKU requerido';
    if (!values.nombre.trim()) newErrors.nombre = 'Nombre requerido';
    if (values.cod_categoria === '') newErrors.cod_categoria = 'Selecciona categoría';
    if (values.cod_unidad === '') newErrors.cod_unidad = 'Selecciona unidad';
    if (values.cod_estado === '') newErrors.cod_estado = 'Selecciona estado';
    if (values.cantidad === '' || values.cantidad < 0) newErrors.cantidad = 'Cantidad inválida';
    if (values.precio === '' || values.precio < 0) newErrors.precio = 'Precio inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsed: any = value;

    if (['cod_categoria', 'cod_unidad', 'cod_estado'].includes(name)) {
      parsed = value === '' ? '' : parseInt(value, 10);
    }
    if (name === 'cantidad') {
      parsed = value === '' ? '' : Math.max(0, parseInt(value, 10));
    }
    if (name === 'precio') {
      parsed = value === '' ? '' : Math.max(0, parseFloat(value));
    }

    setValues(prev => ({ ...prev, [name]: parsed }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    setEnviando(true);

    const payload: ProductoFormValues = {
      ...values,
      cod_categoria: Number(values.cod_categoria),
      cod_unidad: Number(values.cod_unidad),
      cod_estado: Number(values.cod_estado),
      cantidad: Number(values.cantidad),
      precio: Number(values.precio),
    };

    await onSubmit(payload);
  } catch (error) {
    console.error('Error al guardar producto:', error);
  } finally {
    setEnviando(false);
  }
};


  const renderError = (field: keyof ProductoFormValues) =>
    errors[field] && <span className={styles.error}>{errors[field]}</span>;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="sku" className={styles.label}>SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            className={styles.input}
            value={values.sku}
            onChange={handleChange}
            placeholder="p.ej. ABA-001"
            maxLength={20}
            required
          />
          {renderError('sku')}
        </div>

        <div className={styles.field} style={{ gridColumn: 'span 2' }}>
          <label htmlFor="nombre" className={styles.label}>Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={styles.input}
            value={values.nombre}
            onChange={handleChange}
            placeholder="p.ej. Agua mineral 600ml"
            maxLength={100}
            required
          />
          {renderError('nombre')}
        </div>

        <div className={styles.field}>
          <label htmlFor="cod_categoria" className={styles.label}>Categoría</label>
          <select
            id="cod_categoria"
            name="cod_categoria"
            className={styles.input}
            value={values.cod_categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {renderError('cod_categoria')}
        </div>

        <div className={styles.field}>
          <label htmlFor="cod_unidad" className={styles.label}>Unidad</label>
          <select
            id="cod_unidad"
            name="cod_unidad"
            className={styles.input}
            value={values.cod_unidad}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona unidad</option>
            {unidades.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
          {renderError('cod_unidad')}
        </div>

        <div className={styles.field}>
          <label htmlFor="cod_estado" className={styles.label}>Estado</label>
          <select
            id="cod_estado"
            name="cod_estado"
            className={styles.input}
            value={values.cod_estado}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona estado</option>
            {estados.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
          {renderError('cod_estado')}
        </div>

        <div className={styles.field}>
          <label htmlFor="cantidad" className={styles.label}>Cantidad</label>
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            className={styles.input}
            value={values.cantidad}
            onChange={handleChange}
            placeholder="0"
            min={0}
            step={1}
            required
          />
          {renderError('cantidad')}
        </div>

        <div className={styles.field}>
          <label htmlFor="precio" className={styles.label}>Precio</label>
          <input
            id="precio"
            name="precio"
            type="number"
            className={styles.input}
            value={values.precio}
            onChange={handleChange}
            placeholder="0.00"
            min={0}
            step="0.01"
            required
          />
          {renderError('precio')}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={onCancel}
          disabled={enviando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={enviando}
        >
          {enviando ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
