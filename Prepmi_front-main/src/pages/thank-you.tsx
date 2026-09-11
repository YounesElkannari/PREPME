import { CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function ThankYouPage() {
    const { t } = useTranslation();


    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="max-w-xl w-full space-y-6 p-8 bg-card rounded-lg shadow">
                <div className="text-center space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <h1 className="text-2xl font-bold">{t("thank_you.title")}</h1>
                    <p className="text-muted-foreground">
                        {t("thank_you.description")}
                    </p>
                </div>


                <div className="text-center space-x-2 mt-8">
                    <Link to="/" className="inline-block px-4 py-2 bg-primary text-white rounded">
                        {t("thank_you.home")}
                    </Link>
                </div>
            </div>
        </div>
    )
}
