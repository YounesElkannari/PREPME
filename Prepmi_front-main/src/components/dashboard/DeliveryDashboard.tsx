import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    IconTruck,
    IconUser
} from '@tabler/icons-react'

export default function DeliveryDashboard() {
    return (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Livraisons aujourd'hui
                    </CardTitle>
                    <IconTruck />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>18</div>
                    <p className='text-xs text-muted-foreground'>
                        8 terminées, 10 en cours
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Distance parcourue
                    </CardTitle>
                    <IconTruck />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>125 km</div>
                    <p className='text-xs text-muted-foreground'>
                        Aujourd'hui
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Temps moyen de livraison
                    </CardTitle>
                    <IconTruck />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>28 min</div>
                    <p className='text-xs text-muted-foreground'>
                        -3 min par rapport à hier
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Évaluations clients
                    </CardTitle>
                    <IconUser />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>4.8/5</div>
                    <p className='text-xs text-muted-foreground'>
                        Basé sur 24 avis
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
