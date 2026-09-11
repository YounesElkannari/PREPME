import { UserAuthForm } from '@/components/login/UserAuthForm'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from "../assets/Prepme-simple.svg";
import { Button } from '@/components/ui/button'
import { webRoutes } from '@/routes/web'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function SignIn() {
  const { t } = useTranslation()
  const settings = useSelector((state: RootState) => state.settings)
  
  // Get login background image from settings
  const loginBgImage = settings.settings?.find(s => s.key === 'login_bg_image')?.value || './healthy-meal-bowl.png'
  
  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        {/* First Section */}
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex bg-primary'>
          <div className='  bg-primary' />



          <div className='relative z-20 flex items-center text-lg font-medium'>

          </div>
          <div className='flex justify-center items-center h-full '>
            <img src={loginBgImage} alt='logo' className=' w-full  z-50 animate-float' />

          </div>


          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;
                {t('hero_description')}
                &rdquo;
              </p>
              <footer className='text-sm'><a href='https://www.adev.ma' target='_blank'>Adev.ma</a></footer>
            </blockquote>
          </div>
        </div>

        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <img src={logo} className='h-40  w-auto' />

              <h1 className='text-2xl font-semibold tracking-tight'>{t('login.title')}</h1>
              < p className='text-sm text-muted-foreground' dangerouslySetInnerHTML={{ __html: t('login.description') }} >
              </p>
            </div>
            <UserAuthForm />
            <Button asChild className="w-full bg-primary hover:bg-primary/80">
              <Link to={webRoutes.register}>{t('register.create')}</Link>
            </Button>
            <p className='px-8 text-center text-sm text-muted-foreground'>
              {t('login.condition')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}