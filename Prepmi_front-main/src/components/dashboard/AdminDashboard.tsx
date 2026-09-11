import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  IconZoomMoney,
  IconClipboardList,
  IconUsersGroup,
  IconChefHat,
  IconTrendingUp,
  IconSparkles,
} from '@tabler/icons-react'
import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'

interface DashboardData {
  dailyRevenue: number
  monthlyRevenue: number
  todayOrders: number
  activeClients: number
  totalUsers: number
  totalMeals: number
  pendingOrders: number
  totalOrders: number
}

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.dashboard)
      return response.data as DashboardData
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  const {
    dailyRevenue = 0,
    monthlyRevenue = 0,
    todayOrders = 0,
    activeClients = 0,
    totalUsers = 0,
    totalMeals = 0,
    totalOrders = 0,
  } = dashboardData || {}

  const mainStats = [
    {
      title: "Chiffre d'affaires journalier",
      value: `${Number(dailyRevenue).toFixed(2)} DH`,
      description: "Revenus d'aujourd'hui",
      icon: IconZoomMoney,
      accent: 'from-emerald-500/15 to-emerald-500/5',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500/15',
      ring: 'hover:ring-emerald-500/20',
    },
    {
      title: "Commandes aujourd'hui",
      value: todayOrders,
      description: 'Commandes reçues',
      icon: IconClipboardList,
      accent: 'from-blue-500/15 to-blue-500/5',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/15',
      ring: 'hover:ring-blue-500/20',
    },
    {
      title: 'Clients actifs',
      value: activeClients,
      description: 'Utilisateurs actifs',
      icon: IconUsersGroup,
      accent: 'from-violet-500/15 to-violet-500/5',
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-500/15',
      ring: 'hover:ring-violet-500/20',
    },
    {
      title: "Chiffre d'affaires mensuel",
      value: `${Number(monthlyRevenue).toFixed(2)} DH`,
      description: 'Revenus du mois',
      icon: IconTrendingUp,
      accent: 'from-amber-500/15 to-amber-500/5',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-500/15',
      ring: 'hover:ring-amber-500/20',
    },
  ]

  const secondaryStats = [
    {
      title: 'Total Utilisateurs',
      value: totalUsers,
      description: 'Utilisateurs inscrits',
      icon: IconUsersGroup,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      title: 'Total Commandes',
      value: totalOrders,
      description: 'Toutes les commandes',
      icon: IconClipboardList,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
    },
    {
      title: 'Total Repas',
      value: totalMeals,
      description: 'Repas disponibles',
      icon: IconChefHat,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
    },
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="space-y-8 p-1 animate-in fade-in duration-500">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-2">
              <IconSparkles size={14} />
              Aperçu en direct
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Vue d'ensemble de votre activité PrepMe
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mainStats.map((stat, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ring-1 ring-transparent ${stat.ring}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`}
              />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <stat.icon size={18} className={stat.iconColor} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Indicateurs globaux
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryStats.map((stat, index) => (
              <Card
                key={index}
                className="group border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <stat.icon size={22} className={stat.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-0.5">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}