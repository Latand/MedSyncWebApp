interface ResumeBlockProps {
    title: string;
    children: React.ReactNode;
}

export const ResumeBlock: React.FC<ResumeBlockProps> = ({
    title,
    children
}) => (
    <div className="resume__block">
        <div className="resume__block__text">{title}</div>
        {children}
    </div>
);
