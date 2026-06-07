import React from 'react';
import About from '../components/About';
import Skills from '../components/Skills';

const AboutPage = () => {
    return (
        <div className="min-h-screen [&>section:first-child]:!pt-8">
            <About />
            <Skills />
        </div>
    );
};

export default AboutPage;
