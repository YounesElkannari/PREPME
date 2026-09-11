import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface ThemeSwitcherProps {
    type?: "default" | "checkbox";
}

export default function ThemeSwitcher({ type = "default" }: ThemeSwitcherProps) {
    const { theme, setTheme } = useTheme();

    // Determine if the current theme is dark
    const isDarkMode = theme === "dark";

    // Handle the switch toggle
    const handleToggle = (checked: boolean) => {
        setTheme(checked ? "dark" : "light");
    };

    return (
        <>
            {type === "default" ? (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    {theme === "light" ? (
                        <Moon className="h-5 w-5 hover:text-primary" />
                    ) : (
                        <Sun className="h-5 w-5 hover:text-primary" />
                    )}
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <Switch
                        id="dark-mode"
                        checked={isDarkMode}
                        onCheckedChange={handleToggle}
                    />
                    <Moon className="h-4 w-4" />
                    <Label htmlFor="dark-mode" className="sr-only">
                        Toggle dark mode
                    </Label>
                </div>
            )}
        </>
    );
}