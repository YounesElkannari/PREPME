import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Mail, Check, AlertCircle, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function Newsletter() {
    const { t } = useTranslation()
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState("")

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            setStatus('error')
            setMessage(t('newsletter.error_empty'))
            return
        }

        if (!validateEmail(email)) {
            setStatus('error')
            setMessage(t('newsletter.error_invalid'))
            return
        }

        setStatus('loading')

        try {
            // Simulate API call - replace with your actual newsletter API
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Here you would typically call your newsletter API
            // const response = await fetch('/api/newsletter/subscribe', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email })
            // })

            setStatus('success')
            setMessage(t('newsletter.success_message'))
            setEmail("")

            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus('idle')
                setMessage("")
            }, 5000)

        } catch (error) {
            setStatus('error')
            setMessage(t('newsletter.error_general'))
        }
    }

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background with primary/secondary colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background dark:from-primary/3 dark:via-secondary/3 dark:to-background">
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                {t('newsletter.badge')}
                            </span>
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
                            {t('newsletter.title')}
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t('newsletter.description')}
                        </p>
                    </div>

                    {/* Newsletter Form */}
                    <Card className="max-w-2xl mx-auto bg-card/90 dark:bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <Input
                                            type="email"
                                            placeholder={t('newsletter.email_placeholder')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 text-base border-2 focus:border-primary transition-colors"
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={status === 'loading'}
                                        className="h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                                                <span>{t('newsletter.subscribing')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>{t('newsletter.subscribe_button')}</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Status Messages */}
                                {message && (
                                    <div className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-all duration-300 ${status === 'success'
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                                        }`}>
                                        {status === 'success' ? (
                                            <Check className="w-5 h-5 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-medium">{message}</span>
                                    </div>
                                )}

                                {/* Benefits */}
                                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-sm text-foreground mb-1">{t('newsletter.benefit1_title')}</h4>
                                        <p className="text-xs text-muted-foreground">{t('newsletter.benefit1_desc')}</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Send className="w-6 h-6 text-secondary" />
                                        </div>
                                        <h4 className="font-semibold text-sm text-foreground mb-1">{t('newsletter.benefit2_title')}</h4>
                                        <p className="text-xs text-muted-foreground">{t('newsletter.benefit2_desc')}</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Check className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-sm text-foreground mb-1">{t('newsletter.benefit3_title')}</h4>
                                        <p className="text-xs text-muted-foreground">{t('newsletter.benefit3_desc')}</p>
                                    </div>
                                </div>

                                {/* Privacy Notice */}
                                <p className="text-xs text-muted-foreground text-center">
                                    {t('newsletter.privacy_notice')}
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}