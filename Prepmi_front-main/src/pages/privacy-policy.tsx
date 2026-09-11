import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PrivacyPolicy() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
              {t('privacy.back')}
            </Button>
            <h1 className="text-4xl font-bold mb-4">{t('privacy.title')}</h1>
            <p className="text-muted-foreground">{t('privacy.last_updated')}: {t('privacy.date')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.section1.title')}</h2>
              <p className="mb-4">{t('privacy.section1.content1')}</p>
              <p className="mb-4">{t('privacy.section1.content2')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.section2.title')}</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>{t('privacy.section2.item1')}</li>
                <li>{t('privacy.section2.item2')}</li>
                <li>{t('privacy.section2.item3')}</li>
                <li>{t('privacy.section2.item4')}</li>
                <li>{t('privacy.section2.item5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.section3.title')}</h2>
              <p className="mb-4">{t('privacy.section3.content1')}</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>{t('privacy.section3.item1')}</li>
                <li>{t('privacy.section3.item2')}</li>
                <li>{t('privacy.section3.item3')}</li>
                <li>{t('privacy.section3.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.section4.title')}</h2>
              <p className="mb-4">{t('privacy.section4.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.section5.title')}</h2>
              <p className="mb-4">{t('privacy.section5.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.section6.title')}</h2>
              <p className="mb-4">{t('privacy.section6.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
              <p className="mb-2">{t('privacy.contact.content')}</p>
              <p className="mb-2"><strong>{t('footer.email')}:</strong> {t('footer.email_address')}</p>
              <p className="mb-2"><strong>{t('footer.phone')}:</strong> {t('footer.phone_number')}</p>
              <p><strong>{t('footer.address_line1')}</strong></p>
              <p><strong>{t('footer.address_line2')}</strong></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
