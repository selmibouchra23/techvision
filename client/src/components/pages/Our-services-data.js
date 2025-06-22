import "./Our-services.css";

function OurServicesData({ image, heading, text, onClick }) {
    return (
        <div className="s-card cursor-pointer" onClick={onClick}>
            <div className="s-image">
                <img src={image} alt="img" />
            </div>
            <h4>{heading}</h4>
            <p>{text}</p>
        </div>
    ); 
}

export default OurServicesData;
