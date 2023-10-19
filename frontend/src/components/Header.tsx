import aboutIcon from "../assets/images/about/about-icon.svg"

interface HeaderProps {
    title: string;
    className: string;
}

export const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <header className={`${className}__header`}>
      <div className="top-bar">
        <p className="top-bar__text">{title}</p>
        <div className="top-bar__icon">
          <img
            className="top-bar__icon__img--about"
            src={aboutIcon}
            alt="Button"
          />
        </div>
      </div>
    </header>
  )
}
