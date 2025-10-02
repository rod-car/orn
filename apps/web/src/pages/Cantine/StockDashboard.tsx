/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Button, PageTitle, Select, Spinner } from 'ui'
import { CardState } from '@base/components'
import { scholar_years } from 'functions'
import { AlertTriangle, Package, TrendingDown, School, ShoppingCart, Clock } from 'lucide-react'

// Interfaces
interface FoodItem {
  id: number
  label: string
  unit: string
  threshold_warning: number
  threshold_critical: number
}

interface ForecastData {
  quantity: number
  unit: string
  current_stock: number
  difference: number
  coverage_percentage: number | null
  days_remaining: number | null
  status: 'normal' | 'warning' | 'critical'
  needs_order: boolean
}

interface SchoolStockStatus {
  school_id: number
  school_name: string
  current_stock: number
  status: 'normal' | 'warning' | 'critical'
  forecast?: ForecastData
}

interface StockAlert {
  food: FoodItem
  school: SchoolStockStatus
  message: string
}

interface ForecastSummary {
  total_items: number
  items_needing_order: number
  critical_forecast: number
  warning_forecast: number
  schools_with_needs: number
}

interface StockSummary {
  total_foods: number
  critical_alerts: number
  warning_alerts: number
  total_schools: number
  forecast_summary: ForecastSummary
}

interface StockData {
  food: FoodItem
  schools: SchoolStockStatus[]
  total_stock: number
  forecast_summary?: {
    total_quantity_needed: number
    schools_needing_order: number
    total_schools: number
  }
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

// Composants
interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'critical'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    critical: { label: 'Critique', class: 'bg-red-100 text-red-800 border-red-200' },
    warning: { label: 'Attention', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    normal: { label: 'Normal', class: 'bg-green-100 text-green-800 border-green-200' }
  }

  const config = statusConfig[status]

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.class}`}>
      {config.label}
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
              ? [
                  { id: '', label: 'Toutes les écoles' },
                  ...schools.map((s) => ({ id: s.id.toString(), label: s.name }))
                ]
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
    <div className="row mb-4">
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
          link="#alerts"
          value={isLoading ? <Spinner /> : dashboardData?.summary?.critical_alerts || 0}
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
        />
      </div>
      <div className="col-3">
        <CardState
          title="Commandes nécessaires"
          link="#stock-table"
          value={
            isLoading ? (
              <Spinner />
            ) : (
              dashboardData?.summary?.forecast_summary?.items_needing_order || 0
            )
          }
          icon={<ShoppingCart className="h-6 w-6 text-orange-500" />}
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
  stocks: StockData[]
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, stocks }) => {
  return (
    <div className="row mb-4" id="alerts">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">🚨 Alertes de Stock Actuelles</h5>
            <small className="text-muted">
              Mise à jour: {new Date().toLocaleTimeString('fr-FR')}
            </small>
          </div>
          <div className="card-body">
            {alerts.length > 0 ? (
              <div className="list-group list-group-flush">
                {alerts.map((alert, index) => {
                  // Trouver les données de stock et forecast pour cette alerte
                  const stockItem = stocks.find(s => s.food.id === alert.food.id)
                  const schoolData = stockItem?.schools.find(
                    s => s.school_id === alert.school.school_id
                  )
                  const forecast = schoolData?.forecast
                  const hasForecast = forecast && forecast.quantity > 0

                  return (
                    <div
                      key={`${alert.food.id}-${alert.school.school_id}-${index}`}
                      className={`list-group-item border-start border-4 ${
                        alert.school.status === 'critical' ? 'border-danger' : 'border-warning'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <strong className="d-block">{alert.food.label}</strong>
                              <span className="text-muted small">{alert.school.school_name}</span>
                            </div>
                            <StatusBadge status={alert.school.status} />
                          </div>

                          <div className="row g-2 mt-2">
                            <div className="col-md-6">
                              <div className="p-2 bg-light rounded">
                                <small className="text-muted d-block">Stock actuel</small>
                                <strong>
                                  {alert.school.current_stock} {alert.food.unit}
                                </strong>
                                <small className="text-muted d-block mt-1">
                                  Seuil {alert.school.status === 'critical' ? 'critique' : 'attention'}:{' '}
                                  {alert.school.status === 'critical'
                                    ? alert.food.threshold_critical
                                    : alert.food.threshold_warning}{' '}
                                  {alert.food.unit}
                                </small>
                              </div>
                            </div>

                            {hasForecast && (
                              <div className="col-md-6">
                                <div className="p-2 bg-warning bg-opacity-10 rounded border border-warning">
                                  <small className="text-muted d-block">
                                    Prévision (2 semaines)
                                  </small>
                                  <strong className="text-warning">
                                    {forecast.quantity} {forecast.unit}
                                  </strong>
                                  <div className="mt-1">
                                    <span
                                      className={`badge ${
                                        forecast.difference < 0 ? 'bg-danger' : 'bg-success'
                                      } me-1`}
                                    >
                                      {forecast.difference >= 0 ? '+' : ''}
                                      {forecast.difference.toFixed(1)} {forecast.unit}
                                    </span>
                                    {forecast.days_remaining !== null && (
                                      <span className="badge bg-secondary">
                                        <Clock className="h-3 w-3 d-inline me-1" />
                                        {forecast.days_remaining} jours
                                      </span>
                                    )}
                                  </div>
                                  {forecast.needs_order && (
                                    <div className="mt-2">
                                      <span className="badge bg-danger">
                                        <ShoppingCart className="h-3 w-3 d-inline me-1" />
                                        Commande nécessaire
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

interface StockTableProps {
  stocks: StockData[]
  selectedSchool: string
  onRefresh: () => void
}

const StockTable: React.FC<StockTableProps> = ({ stocks, selectedSchool, onRefresh }) => {
  return (
    <div className="row mb-4" id="stock-table">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 Stocks et Prévisions (2 semaines)</h5>
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
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Collation</th>
                    {!selectedSchool && <th className="text-center">Écoles concernées</th>}
                    <th className="text-end">Stock Actuel</th>
                    <th className="text-end">Besoin (2 sem.)</th>
                    <th className="text-end">Différence</th>
                    <th className="text-center">Couverture</th>
                    <th className="text-center">Jours restants</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((item) => {
                    // Si une école est sélectionnée, prendre ses données
                    const schoolData = selectedSchool
                      ? item.schools.find((s) => s.school_id.toString() === selectedSchool)
                      : null

                    // Pour toutes les écoles, calculer les totaux
                    const totalStock = selectedSchool
                      ? schoolData?.current_stock || 0
                      : item.total_stock

                    const totalForecast = selectedSchool
                      ? schoolData?.forecast?.quantity || 0
                      : item.forecast_summary?.total_quantity_needed || 0

                    const difference = totalStock - totalForecast
                    const coverage = totalForecast > 0 
                      ? ((totalStock / totalForecast) * 100).toFixed(0) 
                      : null

                    const daysRemaining = selectedSchool && schoolData?.forecast
                      ? schoolData.forecast.days_remaining
                      : totalForecast > 0
                      ? ((totalStock / totalForecast) * 14).toFixed(1)
                      : null

                    const status = selectedSchool && schoolData?.forecast
                      ? schoolData.forecast.status
                      : totalStock <= totalForecast * 0.5
                      ? 'critical'
                      : totalStock <= totalForecast
                      ? 'warning'
                      : 'normal'

                    const needsOrder = difference < 0

                    return (
                      <tr key={item.food.id} className={needsOrder ? 'table-warning' : ''}>
                        <td>
                          <strong>{item.food.label}</strong>
                          <br />
                          <small className="text-muted">{item.food.unit}</small>
                        </td>
                        {!selectedSchool && (
                          <td className="text-center">
                            <span className="badge bg-secondary">
                              {item.forecast_summary?.schools_needing_order || 0} /{' '}
                              {item.forecast_summary?.total_schools || 0}
                            </span>
                          </td>
                        )}
                        <td className="text-end">
                          <strong>{totalStock.toFixed(2)}</strong>
                        </td>
                        <td className="text-end">
                          <strong>{totalForecast.toFixed(2)}</strong>
                        </td>
                        <td className="text-end">
                          <span className={difference < 0 ? 'text-danger' : 'text-success'}>
                            {difference >= 0 ? '+' : ''}
                            {difference.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-center">
                          {coverage ? (
                            <span
                              className={`badge ${
                                parseFloat(coverage) < 50
                                  ? 'bg-danger'
                                  : parseFloat(coverage) < 100
                                  ? 'bg-warning'
                                  : 'bg-success'
                              }`}
                            >
                              {coverage}%
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {daysRemaining ? (
                            <span className="d-flex align-items-center justify-content-center gap-1">
                              <Clock className="h-4 w-4" />
                              {daysRemaining} j
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          <StatusBadge status={status} />
                        </td>
                        <td className="text-center">
                          {needsOrder && (
                            <span className="badge bg-danger">
                              <ShoppingCart className="h-3 w-3 d-inline me-1" />
                              Commander
                            </span>
                          )}
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

interface SchoolDetailProps {
  stocks: StockData[]
  selectedSchool: string
  schools: School[] | null
}

const SchoolDetail: React.FC<SchoolDetailProps> = ({ stocks, selectedSchool, schools }) => {
  const school = schools?.find((s) => s.id.toString() === selectedSchool)
  
  // Compter les items nécessitant une commande
  const itemsNeedingOrder = stocks.filter((item) => {
    const schoolData = item.schools.find((s) => s.school_id.toString() === selectedSchool)
    return schoolData?.forecast?.needs_order
  }).length

  const criticalItems = stocks.filter((item) => {
    const schoolData = item.schools.find((s) => s.school_id.toString() === selectedSchool)
    return schoolData?.forecast?.status === 'critical'
  }).length

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="alert alert-info">
          <h6 className="alert-heading mb-3">
            📊 Résumé pour: <strong>{school?.name}</strong>
          </h6>
          <div className="row">
            <div className="col-4">
              <div className="text-center">
                <div className="h3 mb-0">{itemsNeedingOrder}</div>
                <small className="text-muted">Articles à commander</small>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center">
                <div className="h3 mb-0 text-danger">{criticalItems}</div>
                <small className="text-muted">Niveaux critiques</small>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center">
                <div className="h3 mb-0">{stocks.length}</div>
                <small className="text-muted">Total collations</small>
              </div>
            </div>
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

  // API calls
  const {
    Client: DashboardClient,
    datas: dashboardData,
    loading: dashboardLoading,
    error: dashboardError
  } = useApi<DashboardData>({
    url: '/stocks/dashboard',
    key: 'data'
  })

  const { Client: SchoolClient, datas: schools } = useApi<{ data: School[] }>({
    url: '/schools'
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

  useEffect(() => {
    loadDashboard()
    loadSchools()
  }, [scholarYear, selectedSchool])

  if (dashboardError) {
    return (
      <div className="alert alert-danger" role="alert">
        Erreur lors du chargement des données: {dashboardError.message}
      </div>
    )
  }

  return (
    <>
      <PageTitle title="Tableau de Bord - Stocks et Prévisions" />

      <DashboardFilters
        scholarYear={scholarYear}
        onScholarYearChange={setScholarYear}
        selectedSchool={selectedSchool}
        onSchoolChange={setSelectedSchool}
        schools={schools?.data || null}
      />

      <StatsCards dashboardData={dashboardData || null} isLoading={dashboardLoading} />

      {selectedSchool && dashboardData && (
        <SchoolDetail
          stocks={dashboardData.stocks}
          selectedSchool={selectedSchool}
          schools={schools?.data || null}
        />
      )}

      {dashboardData && dashboardData.alerts && dashboardData.alerts.length > 0 && (
        <AlertsSection alerts={dashboardData.alerts} stocks={dashboardData.stocks} />
      )}

      {dashboardData && dashboardData.stocks && (
        <StockTable
          stocks={dashboardData.stocks}
          selectedSchool={selectedSchool}
          onRefresh={loadDashboard}
        />
      )}
    </>
  )
}