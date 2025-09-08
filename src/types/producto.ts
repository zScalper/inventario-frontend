interface Categoria {
  id?: number;
  nombre_categoria: string;
}

interface Unidad {
  id?: number;
  unidad: string;
}

interface Estado {
  id?: number;
  estado: string;
}

export interface Producto {
  id?: number;
  sku: string;
  nombre: string;
  cod_categoria: Categoria;
  cod_unidad: Unidad;
  cod_estado: Estado;
  cantidad: number;
  precio: number;
}
