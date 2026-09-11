import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./routes/browserRouter";
import persistStore from "redux-persist/es/persistStore";
import { injectStore } from "./utils/http";
import { store } from "./store";
import i18next from "./i18n";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


const queryClient = new QueryClient();

const persistor = persistStore(store);
injectStore(store);

i18next.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});
document.documentElement.setAttribute('dir', i18next.language === 'ar' ? 'rtl' : 'ltr');


const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <Provider store={store}>
        <PersistGate persistor={persistor}>


          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={browserRouter} />

          </TooltipProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;