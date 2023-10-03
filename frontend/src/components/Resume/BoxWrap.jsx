import boxIcon from "../../assets/images/resume/Vector.svg";

export const BoxWrap = ({title, children}) => (
    <div className="box__wrap">
        <div className="box__title">
            <img className="box__title__icon" src={boxIcon} alt="Map icon"/>
            <div className="box__title__text">{title}</div>
        </div>
        {children}
    </div>
);
