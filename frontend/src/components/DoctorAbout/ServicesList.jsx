

const ServicesList = ({services}) => {
  if (!services) {
    return null
  }
  const servicesArray = services.split("\n")
  return (
    <ul className="about__section__text services__list">
      {servicesArray.map((service, index) => (
        <li key={index} className="services__item">{service}</li>
      ))}
    </ul>
  )
}

export default ServicesList
