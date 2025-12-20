import React, { useEffect, useState } from 'react';
import { fetchHomeRichText } from '../utils/supabaseService';
import './HomeContent.css';

export default function HomeContent() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const text = await fetchHomeRichText();
                setContent(text);
            } catch (error) {
                console.error('Failed to load home content:', error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    if (loading) {
        return null; // Don't show anything while loading to avoid layout shift or show a skeleton if preferred
    }

    if (!content) {
        return null; // Don't render section if no content
    }

    return (
        <section className="home-content-section">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div
                    className="ql-editor home-content-display"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </section>
    );
}
