import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    IconChefHat,
    IconClipboardList,
    IconApple
} from '@tabler/icons-react'

export default function CuisineDashboard() {
    return (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Plats préparés aujourd'hui
                    </CardTitle>
                    <IconChefHat />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>65</div>
                    <p className='text-xs text-muted-foreground'>
                        +12 par rapport à hier
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Commandes en attente
                    </CardTitle>
                    <IconClipboardList />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>23</div>
                    <p className='text-xs text-muted-foreground'>
                        À préparer
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Temps moyen de préparation
                    </CardTitle>
                    <IconChefHat />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>15 min</div>
                    <p className='text-xs text-muted-foreground'>
                        Par plat
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Stock critique
                    </CardTitle>
                    <IconApple />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>3</div>
                    <p className='text-xs text-muted-foreground'>
                        Ingrédients à commander
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
