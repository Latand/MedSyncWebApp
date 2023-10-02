const SpecializationCard = ({className, imgSrc, title, subtitle}) => {
    return (
        <section className={`specialization-card ${className}`}>
            <div className="specialization-card__overlay">
            <img
                className="specialization-card__img"
                src={imgSrc}
                alt={title}
            />
            </div>
            <div className="specialization-card__text">
                <div className="specialization-card__title">{title}</div>
                <div className="specialization-card__subtitle">{subtitle}</div>
            </div>
        </section>
    );
}

export default SpecializationCard;