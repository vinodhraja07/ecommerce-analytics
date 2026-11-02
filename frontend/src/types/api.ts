export interface KPIData {
  total_revenue: number
  total_orders: number
  total_customers: number
  avg_order_value: number
  revenue_change: number
  orders_change: number
  customers_change: number
  aov_change: number
}

export interface RevenuePoint {
  date: string
  revenue: number
  orders: number
}

export interface CategoryRevenue {
  category: string
  revenue: number
  percentage: number
}

export interface TopProduct {
  id: number
  name: string
  category: string
  units_sold: number
  revenue: number
}

export interface RecentOrder {
  id: number
  order_id: string
  customer_name: string
  product_name: string
  category: string
  quantity: number
  revenue: number
  date: string
  status: string
}

export interface InsightItem {
  type: 'positive' | 'warning' | 'neutral'
  icon: string
  title: string
  description: string
}

export interface InventoryAlert {
  out_of_stock: number
  low_stock: number
  healthy: number
  products: Array<{
    id: number
    name: string
    category: string
    stock: number
    status: string
  }>
}
