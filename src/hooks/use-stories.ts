// hooks/use-stories.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client"; // Adjust path as needed
import { Story } from "@/components/feed/Stories";

export const useStories = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            const { data, error } = await supabase
                .from("stories")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching stories:", error.message);
            } else {
                setStories(data as unknown as Story[]);
            }

            setLoading(false);
        };

        fetchStories();
    }, []);

    return { stories, loading };
};
