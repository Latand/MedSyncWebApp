import arrowRight from "../assets/images/landing-page/arrow-right.svg"

const LargeButton = ({handleSubmit, title, typeButton}) => {
  return (
    <a className={`button ${typeButton}__button`} onClick={handleSubmit}>
      {title}
      <span className="arrow">
        <img src={arrowRight} alt="Arrow Right"/>
      </span>
    </a>
  )
}
export default LargeButton
