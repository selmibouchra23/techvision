/* eslint-disable react/prop-types */
import MyContext from './myContext';

function MyState({children}) {
    const name = "Kamal Nayan Upadhyay"
  return (
    <MyContext.Provider value={name}>
       {children}
    </MyContext.Provider>
  )
}

export default MyState