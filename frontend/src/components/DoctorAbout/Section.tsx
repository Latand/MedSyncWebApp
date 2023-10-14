interface SectionProps {
    title: string;
    tag: string;
    children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, tag, children }) => (
    <section className={`about__section ${tag}`}>
        <p className="about__section__title">{title}</p>
        <div className="about__section__text">{children}</div>
    </section>
);
