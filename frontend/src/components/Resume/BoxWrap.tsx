import { LocationIcon } from "./LocationIcon"

interface BoxWrapProps {
    title: string;
    children: React.ReactNode;
}

export const BoxWrap: React.FC<BoxWrapProps> = ({ title, children }) => (
  <div className="box__wrap">
    <div className="box__title">
      <LocationIcon className="box__title__icon" />
      <div className="box__title__text">{title}</div>
    </div>
    {children}
  </div>
)
