import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { IconCheck, IconUsers, IconClock, IconHeart, IconStar, IconBuilding, IconMail } from "@tabler/icons-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { apiRoutes } from "@/routes/api";
import http from "@/utils/http";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  job_title: z.string().optional(),
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  company_name: z.string().min(1, "Company name is required"),
  company_website: z.string().refine((val) => {
    if (!val) return true;
    const urlPattern = /^https?:\/\/.+/;
    const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return urlPattern.test(val) || domainPattern.test(val);
  }, "Invalid URL or domain").optional().or(z.literal("")),
  partnership_type: z.string().min(1, "Partnership type is required"),
  team_members_per_week: z.string().min(1, "Team members per week is required"),
  products_interested: z.string().min(1, "Products interested is required"),
  heard_about_us: z.string().optional(),
  accept_terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
  accept_communications: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const ForTeams = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const settings = useSelector((state: RootState) => state.settings);
  
  const teamBgImage = settings.settings?.find(s => s.key === 'team_bg_image')?.value || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      email: "",
      first_name: "",
      last_name: "",
      company_name: "",
      company_website: "",
      partnership_type: "",
      team_members_per_week: "",
      products_interested: "",
      heard_about_us: "",
      accept_terms: false,
      accept_communications: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await http.post(apiRoutes.teamPartnerships, data);
      toast.success("Form submitted successfully!");
      console.log('Success:', response.data);
      form.reset();
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Hero Section (Hauteur ajustée pour ne plus dépasser de l'écran) */}
      <section className="relative py-20 md:py-28 overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none z-0 scale-105 transition-transform duration-1000" 
          style={{ backgroundImage: `url(${teamBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-950/80 pointer-events-none z-0" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm max-w-4xl mx-auto leading-tight">
            {t("for_teams.hero_title", "CORPORATE MEAL DELIVERY FOR YOUR TEAM")}
          </h1>
          <p className="text-base md:text-lg text-slate-200 mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow font-normal">
            {t("for_teams.hero_description", "Elevate your employees' well-being with fresh, nutritious meals delivered directly to your workplace. Show you care about their health and productivity.")}
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 font-bold"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t("for_teams.get_started", "GET STARTED")}
          </Button>
        </div>
      </section>

      {/* Why Choose PrepMe Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">
              {t("for_teams.why_title", "WHY CHOOSE PREPME FOR YOUR TEAM?")}
            </h2>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto">
              {t("for_teams.why_description", "Invest in your team's health and productivity with our comprehensive corporate meal solution.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <IconHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {t("for_teams.benefit1_title", "Employee Well-being")}
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {t("for_teams.benefit1_desc", "Promote healthy eating habits and show your team you care about their health and happiness.")}
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <IconClock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {t("for_teams.benefit2_title", "Time Saving")}
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {t("for_teams.benefit2_desc", "No more lunch breaks spent searching for food. Meals arrive ready to eat.")}
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <IconUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {t("for_teams.benefit3_title", "Team Building")}
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {t("for_teams.benefit3_desc", "Create opportunities for team bonding during lunch breaks with shared healthy meals.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">
              {t("for_teams.comparison_title", "HOW WE COMPARE")}
            </h2>
            <p className="text-lg text-primary/70">
              {t("for_teams.comparison_description", "See why PrepMe is the better choice for corporate meal delivery.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                {t("for_teams.takeout_title", "Takeout & Delivery")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <IconCheck className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                  <span>{t("for_teams.takeout_con1", "Expensive per meal")}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <IconCheck className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                  <span>{t("for_teams.takeout_con2", "Limited healthy options")}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <IconCheck className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                  <span>{t("for_teams.takeout_con3", "Inconsistent quality")}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                {t("for_teams.restaurant_title", "Restaurant Catering")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <IconCheck className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                  <span>{t("for_teams.restaurant_con1", "Time-consuming setup")}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <IconCheck className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                  <span>{t("for_teams.restaurant_con2", "Employees leave office")}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <IconCheck className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                  <span>{t("for_teams.restaurant_con3", "Higher costs")}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary p-8 rounded-3xl shadow-xl text-white relative overflow-hidden transform md:-translate-y-2 border border-primary-foreground/20">
              <h3 className="text-xl font-bold mb-6 text-center">
                {t("for_teams.prepme_title", "PrepMe Solution")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <IconStar className="w-5 h-5 mr-3 shrink-0 text-yellow-300" />
                  <span>{t("for_teams.prepme_pro1", "Fresh, chef-prepared meals")}</span>
                </div>
                <div className="flex items-center">
                  <IconStar className="w-5 h-5 mr-3 shrink-0 text-yellow-300" />
                  <span>{t("for_teams.prepme_pro2", "Delivered to your office")}</span>
                </div>
                <div className="flex items-center">
                  <IconStar className="w-5 h-5 mr-3 shrink-0 text-yellow-300" />
                  <span>{t("for_teams.prepme_pro3", "Cost-effective & convenient")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">
              {t("for_teams.how_title", "HOW IT WORKS")}
            </h2>
            <p className="text-lg text-primary/70">
              {t("for_teams.how_description", "Getting started with corporate meal delivery is simple.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {t("for_teams.step1_title", "Contact Us")}
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {t("for_teams.step1_desc", "Reach out to discuss your team's needs and preferences.")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {t("for_teams.step2_title", "Customize Plan")}
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {t("for_teams.step2_desc", "We'll create a tailored meal plan that fits your budget and team size.")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {t("for_teams.step3_title", "Enjoy Delivery")}
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {t("for_teams.step3_desc", "Fresh meals delivered weekly to your office. No hassle, just great food.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form & CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-b from-white to-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary font-bold tracking-wider uppercase text-xs px-3 py-1 bg-primary/10 rounded-full mb-3 inline-block">
              Contact & Devis Personnalisé
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {t("for_teams.cta_title", "READY TO FEED YOUR TEAM?")}
            </h2>
            <p className="text-slate-600 text-base">
              {t("for_teams.cta_description", "Contact us today to learn more about our corporate meal delivery solutions.")}
            </p>
          </div>

          <Card className="bg-white text-slate-900 max-w-4xl mx-auto shadow-2xl rounded-3xl border border-slate-200/60 overflow-hidden">
            <div className="bg-primary px-8 py-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{t("for_teams.contact_title", "Contact Us for Corporate Meals")}</h3>
                <p className="text-white/80 text-xs mt-1">Sécurisé et sans engagement</p>
              </div>
              <IconBuilding className="w-8 h-8 text-white/80" />
            </div>

            <CardContent className="p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* SECTION 1 */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                      Informations de Contact
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary" placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary" placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IconMail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <Input className="h-12 pl-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary" type="email" placeholder="Email" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="job_title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">Job Title <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                            <FormControl>
                              <Input className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary" placeholder="Job Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* SECTION 2 */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                      Détails de l'Entreprise
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Company Name</FormLabel>
                            <FormControl>
                              <Input className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary" placeholder="Company Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company_website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Company Website <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                            <FormControl>
                              <Input className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary" placeholder="example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="partnership_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Partnership Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary">
                                  <SelectValue placeholder="Select partnership type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="partner">Partner</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="team_members_per_week"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Team Members per Week</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary">
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="1-10">1-10</SelectItem>
                                <SelectItem value="11-50">11-50</SelectItem>
                                <SelectItem value="51-100">51-100</SelectItem>
                                <SelectItem value="100+">100+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="products_interested"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">Products Interested</FormLabel>
                            <FormControl>
                              <Textarea className="rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary min-h-[100px] p-4" placeholder="List products you're interested in" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="heard_about_us"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">How did you hear about us? <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="social_media">Social Media</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                                <SelectItem value="search">Search Engine</SelectItem>
                                <SelectItem value="advertisement">Advertisement</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* SECTION 3 */}
                  <div className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="accept_terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="rounded-md w-5 h-5 border-slate-300"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal text-slate-600 cursor-pointer">
                              {t("for_teams.form.accept_terms", "I accept the terms and conditions")}
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accept_communications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="rounded-md w-5 h-5 border-slate-300"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal text-slate-600 cursor-pointer">
                              {t("for_teams.form.accept_communications", "I agree to receive communications")}
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.01] mt-6" 
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : t("for_teams.form.submit", "Submit")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ForTeams;