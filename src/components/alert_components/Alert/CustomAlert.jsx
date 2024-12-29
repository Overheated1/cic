import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { createRoot } from "react-dom/client"; 
import { createPortal } from "react-dom";
import "./resources/style-sheets/Alert.css";
import errorIcon from "./resources/images/error.svg";
import infoIcon from "./resources/images/info.svg";
import successIcon from "./resources/images/success.svg";
import warningIcon from "./resources/images/warning.svg";
import questionIcon from "./resources/images/question.svg";
import { ErrorSvg } from "../../svg_components/ErrorSvg";
import { SuccessSvg } from "../../svg_components/SuccessSvg";

var alertRoot = null; 
var alertContainer = null;

const icons = {
  error: errorIcon,
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  question: questionIcon,
};


const svgIcons = {
  error: <ErrorSvg/>,
  success: <SuccessSvg/>,
};


const Popup = ({ html,title,icon,draggable,showCancelButton,showDenyButton,showConfirmButton,cancelButtonText,denyButtontext,confirmButtonText,footer,isHtmlComponent,didOpen,onCanceled,onDenied,onAccepted }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const userPopup = useRef(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if(isOpen)
      if(didOpen) didOpen();
  })
  
  const handleMouseDown = (e) => {
    if(draggable){
      setIsDragging(true);
  
      setOffset({
        x: e.clientX - userPopup.current.getBoundingClientRect().left,
        y: e.clientY - userPopup.current.getBoundingClientRect().top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      userPopup.current.style.insetInlineStart = `${e.clientX - offset.x}px`;
      userPopup.current.style.insetBlockStart = `${e.clientY - offset.y}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClose = () => {
    handleClosePopup();
    // if (onClose) {
    //   onClose();
    // }
  };

  const handleClosePopup = () => {
    setIsOpen(false);

    setTimeout(() => {
      removeRoot();
    },200)
  }

  const handleClickPopup = (e) => {
      if(userPopup?.current){
          if(!userPopup.current.contains(e.target) && isOpen && userPopup.current != e.target){
            handleClosePopup();
          }
      }
  }

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handlePopupButtons = (e,type) => {
    switch(type){
      case "denied":
        if(onDenied) onDenied() 
        break;
      case "accepted":
        if(onAccepted) onAccepted()
          break;
      case "canceled":
        if(onCanceled) onCanceled()
        break;
      default:
        break;
    }
    handleClose()
  }
  
  return (
      <div onClick={handleClickPopup} className="popup-container">
        <div ref={userPopup} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onDragEnd={handleDragEnd} className={`popup ${isOpen ? "popup-shown" : "popup-hide"} ${isDragging ? "popup-dragging" : ""} ${draggable ? "popup-draggable" : ""}`} >
          { 
            svgIcons?.[icon] &&
            <div className={`alert-icon popup-icon alert-${icon}`}>
              { svgIcons?.[icon] }
            </div>
          }
          
          {
            title?.length && 
              <div className="popup-title">
                <span>{ title }</span>
              </div>
          }
          
          {
          isHtmlComponent ?
          <div className="popup-content" >{ html }</div>
            :
          <div className="popup-content" dangerouslySetInnerHTML={{ __html: html }} />
            
          }

          <div className="popup-buttons">
            {
              showConfirmButton && 
              <button className="popup-close" onClick={(e) => handlePopupButtons(e,"accepted")}>
                { confirmButtonText ? confirmButtonText : "OK" }
              </button>
            }
            { 
              showDenyButton &&
                <button className="popup-close popup-deny" onClick={(e) => handlePopupButtons(e,"denied")}>
                 { denyButtontext ? denyButtontext : "Deny" } 
                </button>
            }
            {
              showCancelButton &&
                <button className="popup-close popup-cancel" onClick={(e) => handlePopupButtons(e,"canceled")}>
                  { cancelButtonText ? cancelButtonText : "Cancel" }
                </button>
            }
          </div>
            {
              footer && 
              <div className="footer" dangerouslySetInnerHTML={{__html:footer}}></div>
            }
        </div>
      </div>
  );
};

const Alert = ({ text, duration = 3000, type, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [id] = useState(uuid());

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      if (onClose) {
        onClose();
      }

    }, 700);
  };

  const progressBarStart = () => {
    let timePassed = 0;
    const UpdateInterval = 10;
    const elem = document.getElementById(`alert-progress-bar-${id}`);
    const UpdateProgress = () => {
      timePassed += UpdateInterval;
      const progress = Math.floor((timePassed / duration) * 100);
      elem.style.width = progress + "%";

      if (timePassed < duration) {
        setTimeout(UpdateProgress, UpdateInterval);
      }
    };
    setTimeout(UpdateProgress, UpdateInterval);
  };

  useEffect(() => {
    if (visible) {
      progressBarStart();
    }
  }, [visible]);

  return createPortal(
      <div id={`alert-${id}`} className={`alert alert-${type} ${visible ? "starting" : ""}`}>
        <div className="alert-content-container">
          <img className={`alert-icon toast-icon alert-${type}`} src={icons[type]} alt={`${type}-alert`} />
          {text}
        </div>
        <div id={`alert-progress-bar-${id}`} className={`alert-progress-bar alert-${type}`}></div>
      </div>,
    document.body
  );
};


const checkRoot = () => {
  if (!alertContainer) { 
    alertContainer = document.createElement("div");
    document.body.appendChild(alertContainer); 
    alertRoot = createRoot(alertContainer); 
  } 
}

const removeRoot = () => { 
  if (alertRoot) { 
      alertRoot.unmount(); document.body.removeChild(alertContainer); 
      alertContainer = null; alertRoot = null; 
  } 
};

export const fireToast = ({ text, duration, type }) => { 
    removeRoot();
    checkRoot();
    alertRoot.render(<Alert text={text} duration={duration} type={type} onClose={removeRoot} />); 
};

export const firePopup = ({ html = "",title = undefined,icon = undefined,showCancelButton = false,showDenyButton = false,showConfirmButton = true,cancelButtonText = undefined,denyButtontext = undefined,confirmButtonText = undefined,footer=undefined,draggable=false,isHtmlComponent=false,didOpen=undefined,onCanceled=undefined,onDenied=undefined,onAccepted=undefined}) => { 
  removeRoot();
  checkRoot();

  alertRoot.render(
    <Popup 
    html={html} title={title} 
    icon={icon} footer={footer} 
    showCancelButton={showCancelButton} 
    showConfirmButton={showConfirmButton} 
    cancelButtonText={cancelButtonText}
    denyButtontext={denyButtontext}
    confirmButtonText={confirmButtonText}
    showDenyButton={showDenyButton} onClose={removeRoot} 
    draggable={draggable} isHtmlComponent={isHtmlComponent}
    didOpen={didOpen} onCanceled={onCanceled} onAccepted={onAccepted} onDenied={onDenied}
    />); 
};

export const closePopup = ({minTime = 0,onClose = undefined}) => { 

  setTimeout(() => {
    removeRoot();
    checkRoot();

    if(onClose) onClose();
  },minTime);
};


