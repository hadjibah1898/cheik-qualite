import React from 'react';
import { testimonialsData } from '../../../data/testimonialsData.js';
import './Testimonials.css';

const Testimonials = () => {
    return (
        <section className="section-box testimonials-section" id="testimonials">
            <h2 className="section-title">Ce qu'ils en disent</h2>
            <div className="testimonials-grid">
                {testimonialsData.map(testimonial => (
                    <div key={testimonial.id} className="testimonial-card">
                        <img src={testimonial.avatarUrl} alt={testimonial.name} className="testimonial-avatar" />
                        <p className="testimonial-quote">« {testimonial.quote} »</p>
                        <footer className="testimonial-author">- {testimonial.name}, <span>{testimonial.role}</span></footer>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;