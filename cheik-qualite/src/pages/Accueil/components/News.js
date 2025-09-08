import React from 'react';
import { newsData } from '../../../data/newsData.js';
import './News.css';

const News = () => {
    return (
        <section className="section-box news-section" id="news">
            <h2 className="section-title">Actualités Récentes</h2>
            <div className="news-grid">
                {newsData.map(newsItem => (
                    <div key={newsItem.id} className="news-card">
                        <img src={newsItem.imageUrl} alt={newsItem.title} className="news-image" />
                        <div className="news-content">
                            <h3>{newsItem.title}</h3>
                            <p className="news-meta">{new Date(newsItem.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="news-summary">{newsItem.summary}</p>
                            <button type="button" className="read-more-link">Lire la suite <i className="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default News;