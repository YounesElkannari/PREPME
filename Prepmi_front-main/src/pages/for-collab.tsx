import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { 
  IconStar, IconTarget, IconLeaf, IconCurrencyDollar, IconClipboardList, 
  IconShieldCheck, IconShare, IconAward, IconUsers, IconUserPlus, 
  IconHeart, IconUser, IconMail, IconPhone, IconBrandInstagram, 
  IconSparkles, IconCheck
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiRoutes } from "@/routes/api";
import http from "@/utils/http";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  social_url_1: z.string().refine((val) => {
    if (!val) return false;
    const urlPattern = /^https?:\/\/.+/;
    const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return urlPattern.test(val) || domainPattern.test(val);
  }, "Invalid URL or domain"),
  social_url_2: z.string().refine((val) => {
    if (!val) return true;
    const urlPattern = /^https?:\/\/.+/;
    const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return urlPattern.test(val) || domainPattern.test(val);
  }, "Invalid URL or domain").optional().or(z.literal("")),
  social_url_3: z.string().refine((val) => {
    if (!val) return true;
    const urlPattern = /^https?:\/\/.+/;
    const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return urlPattern.test(val) || domainPattern.test(val);
  }, "Invalid URL or domain").optional().or(z.literal("")),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  country: z.string().min(1, "Country is required"),
});

type FormData = z.infer<typeof formSchema>;

const ForCollab = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const settings = useSelector((state: RootState) => state.settings);

  const collabBgImage = settings.settings?.find(s => s.key === 'collaboration_bg_image')?.value || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      social_url_1: "",
      social_url_2: "",
      social_url_3: "",
      email: "",
      phone: "",
      country: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await http.post(apiRoutes.collaborations, data);
      toast.success("Application submitted successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-28 md:py-36 overflow-hidden bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80" 
          style={{ backgroundImage: `url(${collabBgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        
        <div className="relative container mx-auto px-4 text-white">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-md">
              {t("for_collab.hero_title", "BECOME A PREPME PARTNER")}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow">
              {t("for_collab.hero_description", "Join our partnership program and help your clients achieve their health goals while earning rewards. Together, we can make healthy eating accessible to everyone.")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#b03334] hover:bg-[#b03334]/90 text-white px-8 py-4 text-lg font-bold shadow-xl transition-transform hover:scale-105"
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t("for_collab.apply_now", "APPLY NOW")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#174522] mb-4">
              {t("for_collab.benefits_title", "AWESOME PERKS OF PARTNERING WITH PREPME")}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t("for_collab.benefits_description", "Discover the benefits of joining our partnership network.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <IconTarget className="w-10 h-10 text-[#174522]" />, title: "benefit1_title", desc: "benefit1_desc", defaultTitle: "Achieve Results", defaultDesc: "Help your clients reach their health goals with our nutritious, chef-prepared meals." },
              { icon: <IconLeaf className="w-10 h-10 text-[#174522]" />, title: "benefit2_title", desc: "benefit2_desc", defaultTitle: "Sustainable Growth", defaultDesc: "Build your reputation as a trusted health professional by offering comprehensive nutrition solutions." },
              { icon: <IconCurrencyDollar className="w-10 h-10 text-[#174522]" />, title: "benefit3_title", desc: "benefit3_desc", defaultTitle: "Generate Revenue", defaultDesc: "Earn commissions when your clients subscribe using your referral code. Turn your network into income." }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#174522]/10 group-hover:bg-[#174522] transition-colors flex items-center justify-center">
                  <div className="group-hover:text-white transition-colors">{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#174522] mb-3">
                  {t(`for_collab.${item.title}`, item.defaultTitle)}
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {t(`for_collab.${item.desc}`, item.defaultDesc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#174522] mb-4">
              {t("for_collab.how_title", "HOW IT WORKS")}
            </h2>
            <p className="text-lg text-gray-700">
              {t("for_collab.how_description", "Joining our partnership program is simple and rewarding.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", icon: <IconClipboardList className="w-8 h-8 text-[#174522]" />, title: "step1_title", desc: "step1_desc", defTitle: "Apply", defDesc: "Fill out our simple application form. It takes less than 2 minutes!" },
              { step: "2", icon: <IconShieldCheck className="w-8 h-8 text-[#174522]" />, title: "step2_title", desc: "step2_desc", defTitle: "Get Approved", defDesc: "We'll review your application and get back to you within 48 hours." },
              { step: "3", icon: <IconShare className="w-8 h-8 text-[#174522]" />, title: "step3_title", desc: "step3_desc", defTitle: "Share & Promote", defDesc: "Use your unique referral link and promotional materials to share PrepMe." },
              { step: "4", icon: <IconAward className="w-8 h-8 text-[#174522]" />, title: "step4_title", desc: "step4_desc", defTitle: "Earn Rewards", defDesc: "Earn commissions on every successful referral. Watch your network grow!" },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="absolute top-4 right-4 w-8 h-8 bg-[#b03334] text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                  {s.step}
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#174522]/10 flex items-center justify-center">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-[#174522] mb-2">
                  {t(`for_collab.${s.title}`, s.defTitle)}
                </h3>
                <p className="text-gray-700 text-sm">
                  {t(`for_collab.${s.desc}`, s.defDesc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats Section */}
      <section className="py-16 bg-[#174522]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#174522] mb-4">
              {t("for_collab.stats_title", "PARTNERSHIP SUCCESS STORIES")}
            </h2>
            <p className="text-lg text-gray-700">
              {t("for_collab.stats_description", "See how our partners are succeeding with PrepMe")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <IconUsers className="w-8 h-8 text-white" />, stat: "500+", label: "stat1_desc", def: "Active Partners" },
              { icon: <IconCurrencyDollar className="w-8 h-8 text-white" />, stat: "$2M+", label: "stat2_desc", def: "Partner Earnings" },
              { icon: <IconUserPlus className="w-8 h-8 text-white" />, stat: "10K+", label: "stat3_desc", def: "Clients Referred" },
              { icon: <IconHeart className="w-8 h-8 text-white" />, stat: "98%", label: "stat4_desc", def: "Partner Satisfaction" },
            ].map((st, idx) => (
              <div key={idx} className="text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#174522] rounded-2xl flex items-center justify-center shadow">
                  {st.icon}
                </div>
                <div className="text-3xl font-extrabold text-[#174522] mb-1">{st.stat}</div>
                <p className="text-gray-700 font-medium text-sm">
                  {t(`for_collab.${st.label}`, st.def)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#174522] mb-4">
              {t("for_collab.testimonials_title", "WHAT OUR PARTNERS SAY")}
            </h2>
            <p className="text-lg text-gray-700">
              {t("for_collab.testimonials_description", "Hear from successful partners in our network.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sarah M.", title: "Fitness Coach", quote: "PrepMe has been a game-changer for my clients. The meals are delicious and the results speak for themselves!" },
              { name: "Ahmed K.", title: "Nutrition Specialist", quote: "The partnership program is fantastic. I've earned great commissions while helping my clients eat healthier." },
              { name: "Fatima R.", title: "Wellness Coach", quote: "PrepMe makes it easy to provide complete nutrition solutions to my clients. Highly recommended!" },
              { name: "Youssef B.", title: "Health Consultant", quote: "The support team is amazing and the commissions are paid on time. Great partnership opportunity!" }
            ].map((t_item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#174522]/10 flex items-center justify-center">
                    <IconUser className="w-7 h-7 text-[#174522]" />
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <IconStar key={idx} className="w-4 h-4 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">
                    "{t_item.quote}"
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[#174522]">{t_item.name}</p>
                  <p className="text-xs text-gray-500">{t_item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section id="apply" className="py-24 bg-gradient-to-b from-[#174522] to-[#0f2e16] text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#b03334]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/20 shadow-sm">
              <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Candidature Rapide & Sécurisée</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              {t("for_collab.apply_title", "READY TO BECOME A PREPME PARTNER?")}
            </h2>
          </div>
          
          <Card className="bg-white text-gray-900 max-w-3xl mx-auto shadow-2xl rounded-3xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-[#174522] text-xl font-bold flex items-center gap-2">
                  <IconClipboardList className="w-5 h-5 text-[#b03334]" />
                  {t("for_collab.form.title", "Application Form")}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Remplissez les champs ci-dessous pour soumettre votre dossier.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <IconCheck className="w-4 h-4" /> Réponse sous 48h
              </div>
            </div>

            <CardContent className="p-8 md:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                  
                  {/* Section: Informations Personnelles */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">1. Informations Personnelles</h4>
                    
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold text-sm flex items-center gap-1.5">
                            <IconUser className="w-4 h-4 text-[#174522]" /> {t("for_collab.form.full_name", "Full Name")}
                          </FormLabel>
                          <FormControl>
                            <Input className="h-12 bg-gray-50/50 border-gray-200 focus:border-[#174522] focus:ring-[#174522]/20 rounded-xl transition-all" placeholder="ex. Sarah Jenkins" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-sm flex items-center gap-1.5">
                              <IconMail className="w-4 h-4 text-[#174522]" /> {t("for_collab.form.email", "Email")}
                            </FormLabel>
                            <FormControl>
                              <Input type="email" className="h-12 bg-gray-50/50 border-gray-200 focus:border-[#174522] focus:ring-[#174522]/20 rounded-xl transition-all" placeholder="sarah@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-sm flex items-center gap-1.5">
                              <IconPhone className="w-4 h-4 text-[#174522]" /> {t("for_collab.form.phone", "Phone")}
                            </FormLabel>
                            <FormControl>
                              <Input className="h-12 bg-gray-50/50 border-gray-200 focus:border-[#174522] focus:ring-[#174522]/20 rounded-xl transition-all" placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                   
                  </div>

                  {/* Section: Réseaux & Motivation */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">2. Présence en ligne & Intérêts</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="social_url_1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-sm flex items-center gap-1.5">
                              <IconBrandInstagram className="w-4 h-4 text-[#b03334]" /> {t("for_collab.form.social_url_1", "Social Media URL 1")}
                            </FormLabel>
                            <FormControl>
                              <Input className="h-12 bg-gray-50/50 border-gray-200 focus:border-[#174522] focus:ring-[#174522]/20 rounded-xl transition-all" placeholder="instagram.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="social_url_2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-sm flex items-center gap-1.5">
                              <IconBrandInstagram className="w-4 h-4 text-gray-400" /> {t("for_collab.form.social_url_2", "Social Media URL 2 (Optional)")}
                            </FormLabel>
                            <FormControl>
                              <Input className="h-12 bg-gray-50/50 border-gray-200 focus:border-[#174522] focus:ring-[#174522]/20 rounded-xl transition-all" placeholder="website.com ou autre lien" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="social_url_3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold text-sm">{t("for_teams.form.products_interested", "Products Interested / Notes")}</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[100px] bg-gray-50/50 border-gray-200 focus:border-[#174522] focus:ring-[#174522]/20 rounded-xl transition-all resize-none p-3" placeholder={t("for_teams.form.list_products", "List products you're interested in")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#b03334] hover:bg-[#b03334]/90 text-white h-14 text-base font-extrabold rounded-2xl shadow-xl shadow-[#b03334]/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        t("for_collab.form.submit", "Submit Application")
                      )}
                    </Button>
                  </div>

                </form>
              </Form>
            </CardContent>
          </Card>
          
          <p className="text-xs text-gray-300 text-center mt-6">
            {t("for_collab.application_note", "Applications are reviewed within 48 hours. We'll get back to you with next steps.")}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ForCollab;