import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { webRoutes } from '@/routes/web'
import { RootState } from '@/store'
import { defaultHttp } from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { handleErrorResponse, setPageTitle } from '@/utils'
import { Admin } from '@/interfaces/admin'
import { PasswordInput } from '../dashboard/custom/password-input'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { login } from '@/store/slices/adminSlice'
import { RoleEnum } from '@/enum/RoleEnum'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const from = location.state?.from?.pathname || webRoutes.dashboard;
  const admin = useSelector((state: RootState) => state.admin);

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('validation.emailRequired') }),
    password: z
      .string()
      .min(1, {
        message: t('validation.passwordRequired'),
      })
      .min(4, {
        message: t('validation.passwordMinLength'),
      }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })




  useEffect(() => {
    setPageTitle('Log in');
  }, []);

  useEffect(() => {
    if (admin?.token) {
      // Redirect cuisinier to meal preparation dashboard
      if (admin.user?.role === RoleEnum.CUISINIER) {
        navigate(webRoutes.dashboard_meal_preparation, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [admin]);

  function onSubmit(values: z.infer<typeof formSchema>) {


    setIsLoading(true)


    defaultHttp
      .post(apiRoutes.login, {
        email: values.email,
        password: values.password,
      })
      .then((response) => {


        const admin: Admin = {
          token: response.data.token,
          user: response.data.user,
          favoris: response.data.favoris
        };
        dispatch(login(admin));
      })
      .catch((error) => {
        handleErrorResponse(error);
        setIsLoading(false);
      });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>{t('login.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>{t('login.password')}</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      {t('login.forgot_password')}
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' variant='secondary'
              loading={isLoading}
            >
              {t('login.title')}
            </Button>

          </div>
        </form>
      </Form>
    </div>
  )
}