
import { supabase } from '../lib/supabaseClient';

const HERO_TABLE = 'insta_audio_homepage_content';
const WEBSITE_TABLE = 'insta_audio_website_content';

// --- Hero Section ---

export const fetchHeroSectionData = async () => {
    try {
        const { data, error } = await supabase
            .from(HERO_TABLE)
            .select('content')
            .eq('section_name', 'hero')
            .single();

        if (error) {
            // If no data found, return null (the component will use defaults)
            if (error.code === 'PGRST116') return null;
            console.error('Error fetching hero data:', error);
            return null;
        }
        return data?.content || null;
    } catch (err) {
        console.error('Unexpected error fetching hero data:', err);
        return null;
    }
};

export const updateHeroSectionData = async (newData) => {
    try {
        // Upsert the data
        const { error } = await supabase
            .from(HERO_TABLE)
            .upsert(
                { section_name: 'hero', content: newData },
                { onConflict: 'section_name' }
            );

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error updating hero data:', err);
        throw err;
    }
};

export const subscribeToHeroSection = (callback) => {
    const channel = supabase
        .channel('hero-updates')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: HERO_TABLE,
                filter: 'section_name=eq.hero',
            },
            (payload) => {
                if (payload.new && payload.new.content) {
                    callback(payload.new.content);
                }
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: HERO_TABLE,
                filter: 'section_name=eq.hero',
            },
            (payload) => {
                if (payload.new && payload.new.content) {
                    callback(payload.new.content);
                }
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// --- Maintenance Mode ---

export const fetchMaintenanceMode = async () => {
    try {
        const { data, error } = await supabase
            .from(WEBSITE_TABLE)
            .select('value')
            .eq('setting_name', 'maintenance_mode')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return false;
            console.error('Error fetching maintenance mode:', error);
            return false;
        }
        // value is expected to be a boolean string or actual boolean in jsonb
        // simpler to just store as boolean in json
        return data?.value === true || data?.value === 'true';
    } catch (err) {
        console.error('Unexpected error fetching maintenance mode:', err);
        return false;
    }
};

export const updateMaintenanceMode = async (mode) => {
    try {
        const { error } = await supabase
            .from(WEBSITE_TABLE)
            .upsert(
                { setting_name: 'maintenance_mode', value: mode },
                { onConflict: 'setting_name' }
            );

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error updating maintenance mode:', err);
        throw err;
    }
};

export const subscribeToMaintenanceMode = (callback) => {
    const channel = supabase
        .channel('maintenance-updates')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: WEBSITE_TABLE,
                filter: 'setting_name=eq.maintenance_mode',
            },
            (payload) => {
                // payload.new.value might be boolean or string depending on how it was upserted
                const val = payload.new.value;
                callback(val === true || val === 'true');
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: WEBSITE_TABLE,
                filter: 'setting_name=eq.maintenance_mode',
            },
            (payload) => {
                const val = payload.new.value;
                callback(val === true || val === 'true');
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// --- Home Rich Text ---

export const fetchHomeRichText = async () => {
    try {
        const { data, error } = await supabase
            .from(HERO_TABLE) // Reusing this table as per plan
            .select('content')
            .eq('section_name', 'home_rich_text')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return ''; // Return empty string if not found
            console.error('Error fetching home rich text:', error);
            return '';
        }
        return data?.content || '';
    } catch (err) {
        console.error('Unexpected error fetching home rich text:', err);
        return '';
    }
};

export const updateHomeRichText = async (content) => {
    try {
        const { error } = await supabase
            .from(HERO_TABLE)
            .upsert(
                { section_name: 'home_rich_text', content: content },
                { onConflict: 'section_name' }
            );

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error updating home rich text:', err);
        throw err;
    }
};
