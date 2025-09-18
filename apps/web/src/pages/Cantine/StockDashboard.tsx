/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState, useMemo } from 'react'
import { Button, PageTitle, Select, Spinner } from 'ui'
import { CardState } from '@base/components'
import { scholar_years } from 'functions'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  TooltipProps
} from 'recharts'
import { AlertTriangle, Package, TrendingDown, School } from 'lucide-react'

// Interfaces améliorées avec des types plus précis
interface FoodItem {
  id: number
  label: string
  unit: string
  threshold_warning: number
  threshold_critical: number
}

interface SchoolStockStatus {
  school_id: number
  school_name: string
  current_stock: number
  status: 'normal' | 'warning' | 'critical'
}

interface StockAlert {
  food: FoodItem
  school: SchoolStockStatus
  message: string
}

interface StockSummary {
  total_foods: number
  critical_alerts: number
  warning_alerts: number
  total_schools: number
}

interface StockData {
  food: FoodItem
  schools: SchoolStockStatus[]
  total_stock: number
}

interface DashboardData {
  summary: StockSummary
  stocks: StockData[]
  alerts: StockAlert[]
  scholar_year: {
    id: number
    start: number
    end: number
  }
}

interface School {
  id: number
  name: string
}

interface StockHistoryItem {
  date: string
  stock: number
  entries: number
  exits: number
}

// Composants enfants pour une meilleure organisation
interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'critical'
  count: number
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, count }) => {
  const statusConfig = {
    critical: { label: 'Critique', class: 'bg-red-100 text-red-800 border-red-200' },
    warning: { label: 'Attention', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    normal: { label: 'Normal', class: 'bg-green-100 text-green-800 border-green-200' }
  }

  const config = statusConfig[status]

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.class}`}>
      {count} {config.label}
    </span>
  )
}

interface DashboardFiltersProps {
  scholarYear: string
  onScholarYearChange: (year: string) => void
  selectedSchool: string
  onSchoolChange: (schoolId: string) => void
  schools: School[] | null
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  scholarYear,
  onScholarYearChange,
  selectedSchool,
  onSchoolChange,
  schools
}) => {
  return (
    <div className="row mb-4">
      <div className="col-6">
        <Select
          label="Année scolaire"
          value={scholarYear}
          onChange={(e) => onScholarYearChange(e.target.value)}
          options={scholar_years()}
          placeholder="Sélectionner une année"
          controlled
        />
      </div>

      <div className="col-6">
        <Select
          label="École"
          value={selectedSchool}
          onChange={(e) => onSchoolChange(e.target.value)}
          options={
            schools
              ? schools.map((s) => ({ id: s.id.toString(), label: s.name }))
              : []
          }
          placeholder="Toutes les écoles"
          controlled
        />
      </div>
    </div>
  )
}

interface StatsCardsProps {
  dashboardData: DashboardData | null
  isLoading: boolean
}

const StatsCards: React.FC<StatsCardsProps> = ({ dashboardData, isLoading }) => {
  return (
    <div className="row mb-5">
      <div className="col-3">
        <CardState
          title="Collations suivis"
          link="/cantine/foods/list"
          value={isLoading ? <Spinner /> : dashboardData?.summary?.total_foods || 0}
          icon={<Package className="h-6 w-6" />}
        />
      </div>
      <div className="col-3">
        <CardState
          title="Alertes critiques"
          link="#"
          value={isLoading ? <Spinner /> : dashboardData?.summary?.critical_alerts || 0}
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
        />
      </div>
      <div className="col-3">
        <CardState
          title="Alertes attention"
          link="#"
          value={isLoading ? <Spinner /> : dashboardData?.summary?.warning_alerts || 0}
          icon={<TrendingDown className="h-6 w-6 text-yellow-500" />}
        />
      </div>
      <div className="col-3">
        <CardState
          title="Écoles"
          link="/anthropo-measure/school/list"
          value={isLoading ? <Spinner /> : dashboardData?.summary?.total_schools || 0}
          icon={<School className="h-6 w-6" />}
        />
      </div>
    </div>
  )
}

interface AlertsSectionProps {
  alerts: StockAlert[]
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts }) => {
  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">🚨 Alertes de Stock</h5>
            <small className="text-muted">
              Mise à jour: {new Date().toLocaleTimeString('fr-FR')}
            </small>
          </div>
          <div className="card-body">
            {alerts.length > 0 ? (
              <div className="list-group list-group-flush">
                {alerts.map((alert, index) => (
                  <div
                    key={`${alert.food.id}-${alert.school.school_id}-${index}`}
                    className={`list-group-item d-flex justify-content-between align-items-center border-left-4 ${
                      alert.school.status === 'critical' ? 'border-danger' : 'border-warning'
                    }`}
                  >
                    <div>
                      <strong>{alert.food.label}</strong> - {alert.school.school_name}
                      <br />
                      <small className="text-muted">
                        Stock actuel: {alert.school.current_stock} {alert.food.unit}
                        (Seuil {alert.school.status === 'critical' ? 'critique' : 'attention'}:{
                          alert.school.status === 'critical'
                            ? alert.food.threshold_critical
                            : alert.food.threshold_warning
                        } {alert.food.unit})
                      </small>
                    </div>
                    <StatusBadge status={alert.school.status} count={1} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-success">
                ✅ Aucune alerte de stock - Tous les niveaux sont normaux
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChartsSectionProps {
  stocks: StockData[]
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ stocks }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444'
      case 'warning': return '#f59e0b'
      default: return '#10b981'
    }
  }

  // Préparer les données pour les graphiques avec useMemo pour éviter des recalculs inutiles
  const stocksByStatus = useMemo(() => {
    return stocks.reduce((acc, item) => {
      item.schools.forEach(school => {
        acc[school.status] = (acc[school.status] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)
  }, [stocks])

  const pieChartData = useMemo(() => {
    return Object.entries(stocksByStatus).map(([status, count]) => ({
      name: status === 'critical' ? 'Critique' : status === 'warning' ? 'Attention' : 'Normal',
      value: count,
      color: getStatusColor(status)
    }))
  }, [stocksByStatus])

  const stockLevelsData = useMemo(() => {
    return stocks.map(item => ({
      food: item.food.label,
      stock: item.total_stock,
      warning: item.food.threshold_warning,
      critical: item.food.threshold_critical,
      unit: item.food.unit
    }))
  }, [stocks])

  // Custom tooltip pour le graphique à barres
  const CustomBarTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const unit = payload[0]?.payload?.unit || ''
      const labels: Record<string, string> = {
        stock: 'Stock actuel',
        warning: 'Seuil attention',
        critical: 'Seuil critique'
      }

      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded shadow">
          <p className="font-weight-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${labels[entry.dataKey as string] || entry.dataKey}: ${entry.value} ${unit}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="row mb-5">
      <div className="col-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">📊 Niveaux de Stock par Collation</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="food" />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      stock: 'Stock actuel',
                      warning: 'Seuil attention',
                      critical: 'Seuil critique'
                    }
                    return labels[value] || value
                  }}
                />
                <Bar dataKey="stock" fill="#3b82f6" name="stock" />
                <Bar dataKey="warning" fill="#f59e0b" name="warning" />
                <Bar dataKey="critical" fill="#ef4444" name="critical" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">🎯 Répartition des Statuts</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StockTableProps {
  stocks: StockData[]
  schools: School[] | null
  selectedSchool: string
  onFoodSelect: (foodId: number, foodName: string) => void
  onRefresh: () => void
}

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  schools,
  selectedSchool,
  onFoodSelect,
  onRefresh
}) => {
  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 État Détaillé des Stocks</h5>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onRefresh}
              aria-label="Actualiser les données"
            >
              🔄 Actualiser
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Collation</th>
                    <th>Stock Total</th>
                    <th>Unité</th>
                    <th>Seuil Attention</th>
                    <th>Seuil Critique</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((item) => {
                    const minStatus = item.schools.reduce((min, school) => {
                      if (school.status === 'critical') return 'critical'
                      if (school.status === 'warning' && min !== 'critical') return 'warning'
                      return min
                    }, 'normal' as const)

                    return (
                      <tr key={item.food.id}>
                        <td>
                          <strong>{item.food.label}</strong>
                          <br />
                          <small className="text-muted">
                            {item.schools.length} école(s) concernée(s)
                          </small>
                        </td>
                        <td>
                          <span className="badge badge-primary">
                            {item.total_stock}
                          </span>
                        </td>
                        <td>{item.food.unit}</td>
                        <td>{item.food.threshold_warning}</td>
                        <td>{item.food.threshold_critical}</td>
                        <td><StatusBadge status={minStatus} count={1} /></td>
                        <td>
                          <Button
                            permission="*"
                            className="btn-outline-info btn-sm"
                            onClick={() => onFoodSelect(item.food.id, item.food.label)}
                            disabled={!selectedSchool}
                            aria-label={`Voir l'historique de ${item.food.label}`}
                          >
                            📈 Historique
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface HistoryChartProps {
  stockHistory: StockHistoryItem[] | null
  selectedFoodName: string
  selectedSchool: string
  schools: School[] | null
  onClose: () => void
}

const HistoryChart: React.FC<HistoryChartProps> = ({
  stockHistory,
  selectedFoodName,
  selectedSchool,
  schools,
  onClose
}) => {
  // Custom tooltip pour le graphique d'historique
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded shadow">
          <p className="font-weight-bold">{new Date(label).toLocaleDateString('fr-FR')}</p>
          {payload.map((entry, index) => {
            const labels: Record<string, string> = {
              stock: 'Stock actuel',
              entries: 'Entrées',
              exits: 'Sorties'
            }
            return (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {`${labels[entry.dataKey as string] || entry.dataKey}: ${entry.value}`}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              📈 Évolution du Stock - {selectedFoodName}
              {selectedSchool && schools && (
                <small className="text-muted ms-2">
                  ({schools.find((s) => s.id.toString() === selectedSchool)?.name || 'École sélectionnée'})
                </small>
              )}
            </h5>
            <Button
              permission="*"
              className="btn-outline-secondary btn-sm"
              onClick={onClose}
              aria-label="Fermer l'historique"
            >
              Fermer
            </Button>
          </div>
          <div className="card-body">
            {stockHistory ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={stockHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Stock actuel"
                  />
                  <Line
                    type="monotone"
                    dataKey="entries"
                    stroke="#10b981"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="Entrées"
                  />
                  <Line
                    type="monotone"
                    dataKey="exits"
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="Sorties"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">
                <Spinner />
                <p>Chargement de l'historique...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal
export function StockDashboard(): ReactNode {
  const [scholarYear, setScholarYear] = useState<string>(scholar_years().at(0) as string)
  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const [selectedFood, setSelectedFood] = useState<number | null>(null)
  const [selectedFoodName, setSelectedFoodName] = useState<string>('')

  // API calls avec gestion d'erreur améliorée
  const { 
    Client: DashboardClient, 
    datas: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError 
  } = useApi<DashboardData>({
    url: '/stocks/dashboard',
    key: 'data'
  })

  const { 
    Client: SchoolClient, 
    datas: schools,
    loading: schoolsLoading 
  } = useApi<{ data: School[] }>({
    url: '/schools',
  })

  const { 
    Client: HistoryClient, 
    data: stockHistory,
    loading: historyLoading 
  } = useApi<StockHistoryItem[]>({
    url: `/stocks/history`,
    key: 'data'
  })

  const loadDashboard = useCallback(async () => {
    const params: { year: number; school_id?: string } = { year: parseInt(scholarYear) }
    if (selectedSchool) params.school_id = selectedSchool

    try {
      await DashboardClient.get(params)
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
    }
  }, [scholarYear, selectedSchool, DashboardClient])

  const loadSchools = useCallback(async () => {
    try {
      await SchoolClient.get({ per_page: 100 })
    } catch (error) {
      console.error('Erreur lors du chargement des écoles:', error)
    }
  }, [SchoolClient])

  const loadHistory = useCallback(async () => {
    if (selectedFood === null) return
    const params: { year: number; school_id?: string } = { year: parseInt(scholarYear) }
    if (selectedSchool) params.school_id = selectedSchool

    try {
      await HistoryClient.find(selectedFood, params)
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error)
    }
  }, [selectedFood, scholarYear, selectedSchool, HistoryClient])

  useEffect(() => {
    loadDashboard()
    loadSchools()
  }, [scholarYear, selectedSchool])

  useEffect(() => {
    if (selectedFood !== null) {
      loadHistory()
    }
  }, [selectedFood, scholarYear, selectedSchool])

  const handleFoodSelection = (foodId: number, foodName: string) => {
    setSelectedFood(foodId)
    setSelectedFoodName(foodName)
  }

  const closeFoodHistory = () => {
    setSelectedFood(null)
    setSelectedFoodName('')
  }

  // Gestion des états de chargement et d'erreur
  if (dashboardError) {
    return (
      <div className="alert alert-danger" role="alert">
        Erreur lors du chargement des données: {dashboardError.message}
      </div>
    )
  }

  return (
    <>
      <PageTitle title="Tableau de Bord - Suivi des Stocks" />

      <DashboardFilters
        scholarYear={scholarYear}
        onScholarYearChange={setScholarYear}
        selectedSchool={selectedSchool}
        onSchoolChange={setSelectedSchool}
        schools={schools?.data || null}
      />

      <StatsCards 
        dashboardData={dashboardData || null} 
        isLoading={dashboardLoading} 
      />

      {dashboardData && dashboardData.alerts && (
        <AlertsSection alerts={dashboardData.alerts} />
      )}

      {dashboardData && dashboardData.stocks && (
        <>
          <ChartsSection stocks={dashboardData.stocks} />
          <StockTable
            stocks={dashboardData.stocks}
            schools={schools?.data || null}
            selectedSchool={selectedSchool}
            onFoodSelect={handleFoodSelection}
            onRefresh={loadDashboard}
          />
        </>
      )}

      {selectedFood !== null && (
        <HistoryChart
          stockHistory={stockHistory || null}
          selectedFoodName={selectedFoodName}
          selectedSchool={selectedSchool}
          schools={schools?.data || null}
          onClose={closeFoodHistory}
        />
      )}
    </>
  )
}