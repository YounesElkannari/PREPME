import { Outlet } from 'react-router-dom'

import { memo } from 'react'
import { UserNav } from '../user-nav'
// import { TopNav } from '../top-nav'
import SkipToMain from '../skip-to-main'
import Sidebar from '../sidebar'
import { LayoutDashbord } from '../custom/LayoutDashbord'
import useIsCollapsed from '../hooks/use-is-collapsed'
import ThemeSwitcher from '@/components/theme-switcher'

const Layout = () => {

  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  // const topNav: any = [
  //   // {
  //   //   title: 'Overview',
  //   //   href: 'dashboard/overview',
  //   //   isActive: true,
  //   // },
  //   // {
  //   //   title: 'Customers',
  //   //   href: 'dashboard/customers',
  //   //   isActive: false,
  //   // },
  //   // {
  //   //   title: 'Products',
  //   //   href: 'dashboard/products',
  //   //   isActive: false,
  //   // },
  //   // {
  //   //   title: 'Settings',
  //   //   href: 'dashboard/settings',
  //   //   isActive: false,
  //   // },
  // ]
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <SkipToMain />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <LayoutDashbord>
          {/* ===== Top Heading ===== */}
          <LayoutDashbord.Header>
            {/* <TopNav links={topNav} /> */}
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitcher />
              <UserNav />
            </div>
          </LayoutDashbord.Header>

          {/* ===== Main ===== */}
          <LayoutDashbord.Body>

            <Outlet />
          </LayoutDashbord.Body>
        </LayoutDashbord>
      </main>
    </div>

  )
}

export default memo(Layout)
