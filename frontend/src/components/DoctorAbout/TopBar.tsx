import aboutIcon from "../../assets/images/about/about-icon.svg"

interface TopBarProps {
    title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => (
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
)
