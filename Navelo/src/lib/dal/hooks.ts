import * as React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { mutateLocalFirst } from './sync';

export function useSyncStatus() {
  const [isOnline, setIsOnline] = React.useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pendingCount = useLiveQuery(() => {
    return db.sync_queue.count();
  }, []) ?? 0;

  const isSynced = isOnline && pendingCount === 0;

  return {
    isOnline,
    pendingCount,
    isSynced,
    statusText: isSynced
      ? 'Sincronizado com o servidor'
      : !isOnline
      ? 'Modo local (offline)'
      : `${pendingCount} alteração(ões) pendente(s)`
  };
}

// Hooks de leitura reativos por Tenant/Company
export function useProducts(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.products.toArray();
    return db.products.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useCategories(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.categories.toArray();
    return db.categories.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useCustomers(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.customers.toArray();
    return db.customers.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useOperators(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.users.toArray();
    return db.users.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useCashRegisters(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.cash_registers.toArray();
    return db.cash_registers.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useTables(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.restaurant_tables.toArray();
    return db.restaurant_tables.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useTabs(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.tabs.toArray();
    return db.tabs.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useSuppliers(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.suppliers.toArray();
    return db.suppliers.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useUnits(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.units.toArray();
    return db.units.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function usePrintPoints(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.print_points.toArray();
    return db.print_points.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useContingencyNotes(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.contingency_notes.toArray();
    return db.contingency_notes.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useRiders(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.riders.toArray();
    return db.riders.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useDeliveryRates(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.delivery_rates.toArray();
    return db.delivery_rates.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useSales(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.sales.toArray();
    return db.sales.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export function useDeliveryOrders(tenantId?: string) {
  return useLiveQuery(() => {
    if (!tenantId) return db.delivery_orders.toArray();
    return db.delivery_orders.where('company_id').equals(tenantId).or('tenant_id').equals(tenantId).toArray();
  }, [tenantId]);
}

export type DalPayload = { id: string; company_id?: string; tenant_id?: string; [key: string]: any };

// Repositório Unificado da DAL (Local-First Mutate)
export const dal = {
  products: {
    getById: async (id: string) => db.products.get(id),
    create: async (item: DalPayload) => mutateLocalFirst('products', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('products', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('products', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  categories: {
    create: async (item: DalPayload) => mutateLocalFirst('categories', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('categories', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('categories', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  customers: {
    create: async (item: DalPayload) => mutateLocalFirst('customers', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('customers', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('customers', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  users: {
    create: async (item: DalPayload) => mutateLocalFirst('users', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('users', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('users', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  suppliers: {
    create: async (item: DalPayload) => mutateLocalFirst('suppliers', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('suppliers', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('suppliers', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  units: {
    create: async (item: DalPayload) => mutateLocalFirst('units', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('units', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('units', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  printPoints: {
    create: async (item: DalPayload) => mutateLocalFirst('print_points', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('print_points', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('print_points', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  cashRegisters: {
    create: async (item: DalPayload) => mutateLocalFirst('cash_registers', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('cash_registers', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('cash_registers', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  tables: {
    create: async (item: DalPayload) => mutateLocalFirst('restaurant_tables', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('restaurant_tables', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('restaurant_tables', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  tabs: {
    create: async (item: DalPayload) => mutateLocalFirst('tabs', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('tabs', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('tabs', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  contingencyNotes: {
    create: async (item: DalPayload) => mutateLocalFirst('contingency_notes', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('contingency_notes', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('contingency_notes', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  riders: {
    create: async (item: DalPayload) => mutateLocalFirst('riders', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('riders', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('riders', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  deliveryRates: {
    create: async (item: DalPayload) => mutateLocalFirst('delivery_rates', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('delivery_rates', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('delivery_rates', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  sales: {
    create: async (item: DalPayload) => mutateLocalFirst('sales', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('sales', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('sales', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  saleItems: {
    create: async (item: DalPayload) => mutateLocalFirst('sale_items', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('sale_items', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('sale_items', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  },
  deliveryOrders: {
    create: async (item: DalPayload) => mutateLocalFirst('delivery_orders', item, 'INSERT'),
    update: async (item: DalPayload) => mutateLocalFirst('delivery_orders', item, 'UPDATE'),
    delete: async (id: string, tenantId?: string) => mutateLocalFirst('delivery_orders', { id, company_id: tenantId, tenant_id: tenantId }, 'DELETE')
  }
};
