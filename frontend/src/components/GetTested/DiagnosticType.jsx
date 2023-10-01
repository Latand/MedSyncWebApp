const SpecializationCard = ({className, imgSrc, title, subtitle}) => {
    return (
        <section className={`specialization-card ${className}`}>
            <img
                className="specialization-card__img"
                src={imgSrc}
                alt={title}
            />
            <div className="specialization-card__title">{title}</div>
            <div className="specialization-card__subtitle">{subtitle}</div>
        </section>
    );
}

export default SpecializationCard;