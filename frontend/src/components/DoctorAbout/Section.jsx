

const Section = ({title, tag, children}) => (
  <section className={`about__section ${tag}`}>
    <p className="about__section__title">{title}</p>
    <div className="about__section__text">{children}</div>
  </section>
)

export default Section
