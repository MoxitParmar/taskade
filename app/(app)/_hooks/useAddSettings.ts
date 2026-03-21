
import { useOrganization } from "@clerk/nextjs";
import { LucideIcon, Settings } from "lucide-react";

interface pages {
    name: string;
    url: string;
    icon: LucideIcon;
} 


export const useAddSettings = (pages: pages[]) => {

    const { membership } = useOrganization();
    const isAdmin = membership?.role === "admin";
    
    if (!isAdmin && pages.some(page => page.name === "Settings")) {
        pages.splice(pages.findIndex(page => page.name === "Settings"), 1);
    }
    
    if (isAdmin) {
        pages.push({
            name: "Settings",
            url: "/settings",
            icon: Settings,
        });
    } 
}