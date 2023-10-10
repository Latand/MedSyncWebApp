import LocationIcon from "./LocationIcon.jsx"
import React from "react"

export const BoxWrap = ({title, children}) => (
  <div className="box__wrap">
    <div className="box__title">
      <LocationIcon name="box__title__icon"/>
      <div className="box__title__text">{title}</div>
    </div>
    {children}
  </div>
)
