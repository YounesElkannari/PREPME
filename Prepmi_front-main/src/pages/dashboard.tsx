
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEffect } from 'react'
import { setPageTitle } from '@/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { RoleEnum } from '@/enum/RoleEnum'

import ClientDashboard from '@/components/dashboard/ClientDashboard'
import AdminDashboard from '@/components/dashboard/AdminDashboard'

export default function Dashboard() {
    const user = useSelector((state: RootState) => state.admin?.user?.role)
    const userRole = user
    console.log("User role:", user)
    useEffect(() => {
        setPageTitle("Tableau de Bord")
    }, [])

    // const getDashboardTitle = () => {
    //     switch (userRole) {
    //         case 'client': return 'Tableau de Bord - Client'
    //         case 'admin': return 'Tableau de Bord - Administrateur'
    //         case 'delivery': return 'Tableau de Bord - Livreur'
    //         case 'cuisine': return 'Tableau de Bord - Cuisine'
    //         default: return 'Tableau de Bord'
    //     }
    // }


    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                {/* <h1 className='text-2xl font-bold tracking-tight'>{getDashboardTitle()}</h1> */}
                <div className='flex items-center space-x-2'>
                    {/* Sélecteur de rôle pour demo - à supprimer en production */}
                    {/* <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className='px-3 py-1 border rounded'
                    >
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                        <option value="delivery">Livreur</option>
                        <option value="cuisine">Cuisine</option>
                    </select> */}
                </div>
            </div>

            <Tabs
                orientation='vertical'
                defaultValue='overview'
                className='space-y-4'
            >
                <div className='w-full overflow-x-auto pb-2'>
                    {/* <TabsList>
                        <TabsTrigger value='overview'>Aperçu</TabsTrigger>
                    </TabsList> */}
                </div>
                <TabsContent value='overview' className='space-y-4'>
                    {userRole === RoleEnum.ADMIN && <AdminDashboard />}
                    {userRole === RoleEnum.CLIENT && <ClientDashboard />}
                </TabsContent>
            </Tabs>
        </>
    )
}

