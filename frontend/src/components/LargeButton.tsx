import arrowRight from "../assets/images/landing-page/arrow-right.svg";

interface LargeButtonProps {
    handleSubmit: React.MouseEventHandler<HTMLAnchorElement>;
    title: string;
    typeButton: string;
}

export const LargeButton: React.FC<LargeButtonProps> = ({
    handleSubmit,
    title,
    typeButton
}) => {
    return (
        <a
            className={`button ${typeButton}__button`}
            onClick={handleSubmit}
        >
            {title}
            <span className="arrow">
                <img
                    src={arrowRight}
                    alt="Arrow Right"
                />
            </span>
        </a>
    );
};
