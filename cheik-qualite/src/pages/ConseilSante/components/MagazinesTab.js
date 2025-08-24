import React, { useState, useEffect } from 'react';

const MagazinesTab = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/health-advice');
                if (!response.ok) {
                    throw new Error('Failed to fetch health advice articles');
                }
                const data = await response.json();
                setArticles(data);
                setFilteredArticles(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = articles.filter(article =>
            article.title.toLowerCase().includes(lowercasedSearchTerm) ||
            article.content.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredArticles(filtered);
    }, [searchTerm, articles]);

    return (
        <div className="tab-content active" id="magazines-tab">
            <section className="magazines-section">
                <h2 className="section-title"><i className="fas fa-newspaper"></i> Magazines et Articles Santé</h2>
                
                <div className="search-bar-magazines">
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="magazines-grid">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <div className="magazine-card" key={article._id}>
                                <div className="magazine-image" style={{ background: article.background || 'linear-gradient(45deg, #3498db, #2ecc71)' }}>
                                    <i className={article.icon || 'fas fa-heartbeat'}></i>
                                </div>
                                <div className="magazine-info">
                                    <h3>{article.title}</h3>
                                    <p>{article.content}</p>
                                    <div className="magazine-date">
                                        <span><i className="fas fa-calendar"></i> {new Date(article.date).toLocaleDateString()}</span>
                                        <span><i className="fas fa-clock"></i> {article.readTime} min</span>
                                    </div>
                                </div>
                                <button className="read-more">Lire l'article</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#7f8c8d', gridColumn: '1 / -1' }}>Aucun article ne correspond à votre recherche.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MagazinesTab;