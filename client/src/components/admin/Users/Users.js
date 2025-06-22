import { useContext } from "react";
import myContext from "../../../context/myContext";
import { FiUsers } from "react-icons/fi";

const UserDetail = () => {
    const context = useContext(myContext);
    const { getAllUser } = context;
    return (
        <div>
               <div>
            <div className="w-full flex justify-center sm:justify-start items-center gap-2 my-4">
            {/*<div className="inline-flex items-center gap-2">*/}
                <FiUsers size={24} className="text-[#007FFF]" />
                <h1 className=" text-xl text-blue-300 font-bold text-center">All User</h1>
               {/* </div>*/}
            </div>

            {/* table  */}
           {/* table  */}
           <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border border-collapse sm:border-separate border-blue-100 text-blue-400" >
                        <tbody>
                            <tr>
                                <th scope="col"
                                    className="h-12 px-6 text-md border-l first:border-l-0 border-blue-100 text-slate-700 bg-slate-100 font-bold fontPara">
                                    S.No
                                </th>
                                <th scope="col"
                                    className="h-12 px-6 text-md border-l first:border-l-0 border-blue-100 text-slate-700 bg-slate-100 font-bold fontPara">
                                        First Name
                                </th>
                                <th scope="col"
                                    className="h-12 px-6 text-md border-l first:border-l-0 border-blue-100 text-slate-700 bg-slate-100 font-bold fontPara">
                                     Last Name
                                </th>
                                <th scope="col"
                                    className="h-12 px-6 text-md border-l first:border-l-0 border-blue-100 text-slate-700 bg-slate-100 font-bold fontPara">
                                    Email 
                                </th>
<th scope="col"
                                    className="h-12 px-6 text-md border-l first:border-l-0 border-blue-100 text-slate-700 bg-slate-100 font-bold fontPara">
                                UID 
                                </th>
                                <th scope="col"
                                    className="h-12 px-6 text-md border-l first:border-l-0 border-blue-100 text-slate-700 bg-slate-100 font-bold fontPara">
                                Password</th>
                            </tr>
                            {
                                getAllUser.map((item, index) => {
                                    return (
                                        <tr key={index} className="text-blue-300">
                                            <td
                                                className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-blue-100 stroke-slate-500 text-slate-500 ">
                                                {index + 1}
                                            </td>
                                            <td
                                                className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-blue-100 stroke-slate-500 text-slate-500 first-letter:uppercase ">
                                                {item.firstName} 
                                            </td>
                                            <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-blue-100 stroke-slate-500 text-slate-500 cursor-pointer ">
                                                {item.lastName}
                                            </td>
                                            <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-blue-100 stroke-slate-500 text-slate-500  cursor-pointer ">
                                                {item.email}
                                            </td>
                                            <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-blue-100 stroke-slate-500 text-slate-500  cursor-pointer ">
                                               {item.uid}{/* {value.role}*/}
                                            </td>
                                            <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-blue-100 stroke-slate-500 text-slate-500 cursor-pointer ">
                                                {item.password}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;