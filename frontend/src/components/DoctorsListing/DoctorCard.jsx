import ellipseOnline from "../../assets/images/doctors-listing/ellipse-online.svg"
import {StarIcon} from "./StarIcon.jsx"

const DoctorCard = ({
  name, doctorImage, title, address, reviews, avg_rating, price,
  onClick, className
}) => (
  <section className={className} onClick={onClick}>
    <div className="card__image">
      <img
        className="card__image__img"
        src={doctorImage}
        alt="Doctor"
      />
    </div>

    <div className="card__info">
      <h1 className="card__title">{name}</h1>

      <p className="card__subtitle">{title}</p>

      <div className="card__review">
        <StarIcon/>
        <p className="card__review__text">{avg_rating.toFixed(2)} ({reviews} reviews)</p>
      </div>

      <p className="card__address">{address}</p>

      <p className="card__price">Price: {price.toFixed(2)}$</p>
    </div>

    <div className="card__icon">
      <img
        className="card__icon__img"
        src={ellipseOnline}
        alt="green ellipse"
      />
    </div>
  </section>
)

export default DoctorCard
