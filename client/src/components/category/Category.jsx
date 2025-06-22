import { useNavigate } from "react-router-dom";
import imageA from '../img/projector.png';
import imageB from '../img/gaming.png';
import imageC from '../img/multimedia.png';

const category = [
    {
        image: imageB,
        name: 'Computers & Peripherals'
    },
    {
        image: imageA,
        name: 'Projectors and Interaction'
    },
    {
        image: imageC,
        name: 'Audio & Video Equipment'
    }
];

const Category = () => {
    const navigate = useNavigate();
    console.log("Category component loaded!");
    return (
        <div className="mt-5 overflow-x-auto hide-scroll-bar snap-x snap-mandatory pl-10">
            <div className="flex gap-4 lg:justify-center">
                {category.map((item, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center min-w-[30%] sm:min-w-[20%] md:min-w-[15%] lg:min-w-0 snap-center px-3 lg:px-10"
                    >
                        
                        <div onClick={() => navigate(`/category/${item.name}`)} 
                        className="w-20 h-20 lg:w-28 lg:h-28 rounded-full p-[2px] bg-gradient-to-tr from-yellow-300 via-pink-500 to-blue-500 flex items-center justify-center transition-all hover:scale-105 cursor-pointer mb-1"
>
                           <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-18 h-18 lg:w-20 lg:h-20 "  />{/*rounded-full object-cover*/}
                        </div>
                        {/* name of category */}
                        <h1 className="text-sm lg:text-lg text-center font-medium capitalize">{item.name}</h1>
                    </div>
                ))}
            </div>

            {/* masker la bar de scrol*/}
            <style dangerouslySetInnerHTML={{ __html: `
                .hide-scroll-bar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scroll-bar::-webkit-scrollbar {
                    display: none;
                }
            ` }} />
        </div>
    );
}

export default Category;
