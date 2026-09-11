import { useNavigate } from 'react-router-dom'
import { webRoutes } from '@/routes/web'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

export default function NotFoundError() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>{t('dashboard.error.not_found.title')}</h1>
        <span className='font-medium'>{t('dashboard.error.not_found.message')}</span>
        <p className='text-center text-muted-foreground'>
          {t('dashboard.error.not_found.description')}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            {t('dashboard.error.not_found.go_back')}
          </Button>
          <Button onClick={() => navigate(webRoutes.home)}>{t('dashboard.error.not_found.back_home')}</Button>
        </div>
      </div>
    </div>
  )
}