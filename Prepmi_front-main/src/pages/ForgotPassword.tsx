import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Prepme.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { webRoutes } from '@/routes/web'
import { useToast } from '@/hooks/use-toast'
import { apiRoutes } from '@/routes/api'
import defaultHttp from '@/utils/http'

export default function ForgotPassword() {
    const { t } = useTranslation()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [code1, setCode1] = useState('')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<'email' | 'reset'>('email')

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await defaultHttp.post(apiRoutes.forgotPassword, {
                email: email
            })

            setStep('reset')
            toast({
                title: t('forgot_password.email_sent_title'),
                description: t('forgot_password.email_sent_description'),
            })
        } catch (error: any) {
            toast({
                title: t('forgot_password.error_title'),
                description: error?.response?.data?.message || t('forgot_password.error_description'),
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: t('forgot_password.error_title'),
                description: t('forgot_password.password_mismatch'),
                variant: 'destructive',
            })
            return
        }

        if (password.length < 6) {
            toast({
                title: t('forgot_password.error_title'),
                description: t('forgot_password.password_too_short'),
                variant: 'destructive',
            })
            return
        }

        if (!code1) {
            toast({
                title: t('forgot_password.error_title'),
                description: t('forgot_password.code_required'),
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)

        try {
            await defaultHttp.post(`${apiRoutes.forgotPassword}/reset`, {
                email: email,
                code: code1,
                password: password
            })

            toast({
                title: t('forgot_password.password_reset_title'),
                description: t('forgot_password.password_reset_description'),
            })

            // Redirect to login after successful reset
            navigate(webRoutes.login)
        } catch (error: any) {
            toast({
                title: t('forgot_password.error_title'),
                description: error?.response?.data?.message || t('forgot_password.reset_error'),
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
            {/* First Section */}
            <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex overflow-hidden bg-primary'>
                <div className='absolute inset-0 bg-primary' />
                <div className='relative z-20 flex items-center text-lg font-medium'>
                </div>
                <div className='flex justify-center items-center h-full'>
                    <img src={logo} alt='logo' className='h-20 w-full filter brightness-0 invert' />
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
                        <img src={logo} />
                        <h1 className='text-2xl font-semibold tracking-tight'>
                            {step === 'email' && t('forgot_password.title')}
                            {step === 'reset' && t('forgot_password.reset_password_title')}
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            {step === 'email' && t('forgot_password.description')}
                            {step === 'reset' && t('forgot_password.reset_password_description')}
                        </p>
                    </div>

                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='email'>{t('login.email')}</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='name@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? t('forgot_password.loading') : t('forgot_password.submit')}
                            </Button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handleResetSubmit} className='space-y-4'>
                            <div className=' '>
                                <div className='space-y-2'>
                                    <Label htmlFor='code'>{t('forgot_password.code')} 1</Label>
                                    <Input
                                        id='code'
                                        type='text'
                                        placeholder='1234'
                                        value={code1}
                                        onChange={(e) => setCode1(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        maxLength={4}
                                    />
                                </div>

                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='password'>{t('forgot_password.new_password')}</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder='••••••••'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='confirmPassword'>{t('forgot_password.confirm_password')}</Label>
                                <Input
                                    id='confirmPassword'
                                    type='password'
                                    placeholder='••••••••'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? t('forgot_password.resetting') : t('forgot_password.reset_password')}
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                className='w-full'
                                onClick={() => setStep('email')}
                                disabled={isLoading}
                            >
                                {t('forgot_password.back')}
                            </Button>
                        </form>
                    )}
                    <p className='px-8 text-center text-sm text-muted-foreground'>
                        <Link to={webRoutes.login} className='underline underline-offset-4 hover:text-primary'>
                            {t('forgot_password.back_to_login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}