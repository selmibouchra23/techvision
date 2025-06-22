import { useNavigate } from "react-router-dom";
import "./Our-services.css";
import OurServicesData from "./Our-services-data";
import service1 from "../img/15.png";
import service2 from "../img/18.jpg";
import service3 from "../img/16.jpg";


import React from 'react'
import { auth } from '../firebase'
import { toast } from 'react-toastify'
 
function OurServices() {
    const navigate = useNavigate();
    

    // Fonctions pour naviguer vers les différentes pages de service
    const handleService1Click = () => {
         const user = auth.currentUser;
          if (!user) {
    toast.info('🔒 Please log in to continue.', {
      position: 'bottom-center',
    });
    navigate('/log-in');
  } else {
        navigate(`/request-website-development`);
    }
};

    const handleService2Click = () => {
         const user = auth.currentUser;
          if (!user) {
    toast.info('🔒 Please log in to continue.', {
      position: 'bottom-center',
    });
    navigate('/log-in');
  } else {
        navigate(`/request-rental-service`);
    }
};

    const handleService3Click = () => {
         const user = auth.currentUser;
          if (!user) {
    toast.info('🔒 Please log in to continue.', {
      position: 'bottom-center',
    });
    navigate('/log-in');
  } else {
        navigate(`/request-repair-service`);
    }
};

    return (
        <div className="OurServices">
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-center text-black"></h1>
            <p className="mt-2 text-lg md:text-xl text-center text-gray-700">
                Our organization offers many services to meet your needs
            </p>
            <div className="servicecard">
                <OurServicesData
                    image={service1}
                    heading="App and Website Development"
                    text="We design and develop tailor-made applications and websites, tailored to your specific needs. Whether you are a startup, an SME or a large company, our team of experts creates high-performance, intuitive and scalable digital solutions. From design to launch, we ensure an optimal user experience and an online presence that strengthens your brand image."
                    onClick={handleService1Click}
                />
                <OurServicesData
                    image={service2}
                    heading="Rental of Advanced Technological Equipment"
                    text="We provide a wide range of high-end technology equipment for rent, including multimedia devices, computers, interactive whiteboards, projectors (datashow), USB drives, and more. Our rental services ensure you have access to the latest technology without the burden of ownership, perfect for events, presentations, or temporary needs."
                    onClick={handleService2Click}
                />
                <OurServicesData
                    image={service3}
                    heading="Fast and Efficient Repair Service"
                    text="If your system is damaged or malfunctioning, we are here to help. Our skilled technicians offer quick and reliable repair services to fix hardware and software issues in the shortest possible time. We ensure your devices are back to optimal performance with minimal downtime."
                    onClick={handleService3Click}
                />
            </div>
        </div>
    );
}

export default OurServices;
