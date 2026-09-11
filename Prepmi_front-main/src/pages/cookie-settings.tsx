import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function CookieSettings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [cookies, setCookies] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    preferences: true
  })

  const handleCookieChange = (type: keyof typeof cookies, value: boolean) => {
    if (type === 'essential') return // Cannot disable essential cookies
    setCookies(prev => ({ ...prev, [type]: value }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save the settings to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookies))
    // Show success message or redirect
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('cookies.back')}
            </Button>
            <h1 className="text-4xl font-bold mb-4">{t('cookies.title')}</h1>
            <p className="text-muted-foreground mb-6">{t('cookies.description')}</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('cookies.essential.title')}
                  <Switch 
                    checked={cookies.essential} 
                    disabled={true}
                  />
                </CardTitle>
                <CardDescription>
                  {t('cookies.essential.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.essential.details')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('cookies.analytics.title')}
                  <Switch 
                    checked={cookies.analytics} 
                    onCheckedChange={(value) => handleCookieChange('analytics', value)}
                  />
                </CardTitle>
                <CardDescription>
                  {t('cookies.analytics.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.analytics.details')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('cookies.marketing.title')}
                  <Switch 
                    checked={cookies.marketing} 
                    onCheckedChange={(value) => handleCookieChange('marketing', value)}
                  />
                </CardTitle>
                <CardDescription>
                  {t('cookies.marketing.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.marketing.details')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('cookies.preferences.title')}
                  <Switch 
                    checked={cookies.preferences} 
                    onCheckedChange={(value) => handleCookieChange('preferences', value)}
                  />
                </CardTitle>
                <CardDescription>
                  {t('cookies.preferences.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.preferences.details')}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4 pt-6">
              <Button onClick={handleSaveSettings} className="flex-1">
                {t('cookies.save_settings')}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                {t('cookies.cancel')}
              </Button>
            </div>
          </div>

          <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">{t('cookies.what_are_cookies.title')}</h2>
            <p className="mb-4">{t('cookies.what_are_cookies.content')}</p>
            
            <h3 className="text-xl font-semibold mb-4">{t('cookies.how_we_use.title')}</h3>
            <p className="mb-4">{t('cookies.how_we_use.content')}</p>
            
            <h3 className="text-xl font-semibold mb-4">{t('cookies.contact.title')}</h3>
            <p className="mb-2">{t('cookies.contact.content')}</p>
            <p className="mb-2"><strong>{t('footer.email')}:</strong> {t('footer.email_address')}</p>
            <p className="mb-2"><strong>{t('footer.phone')}:</strong> {t('footer.phone_number')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
