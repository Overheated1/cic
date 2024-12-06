
import { useSelector } from "react-redux";

const CustomAlert = () => {

  const alert = useSelector(state => state['customAlert']);

  return (
    alert.showAlert && (
      <div className="alert">{alert.alertText}</div>
    )
  );
};


export default CustomAlert;
