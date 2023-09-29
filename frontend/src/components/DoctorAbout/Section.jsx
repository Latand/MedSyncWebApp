import React from 'react';

const Section = ({title, children}) => (
    <section className={`about__section ${title.toLowerCase()}`}>
        <p className="about__section__title">{title}</p>
        <div className="about__section__text">{children}</div>
    </section>
);

export default Section;
